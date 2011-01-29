/*
    Mango - Open Source M2M - http://mango.serotoninsoftware.com
    Copyright (C) 2006-2011 Serotonin Software Technologies Inc.
    @author Matthew Lohbihler
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.serotonin.mango.db.dao;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.ResourceBundle;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;

import com.serotonin.db.spring.ExtendedJdbcTemplate;
import com.serotonin.db.spring.GenericRowMapper;
import com.serotonin.db.spring.GenericTransactionCallback;
import com.serotonin.mango.Common;
import com.serotonin.mango.rt.event.type.AuditEventType;
import com.serotonin.mango.rt.event.type.EventType;
import com.serotonin.mango.util.ChangeComparable;
import com.serotonin.mango.vo.DataPointVO;
import com.serotonin.mango.vo.dataSource.DataSourceVO;
import com.serotonin.mango.vo.event.PointEventDetectorVO;
import com.serotonin.util.SerializationHelper;
import com.serotonin.util.StringUtils;
import com.serotonin.web.i18n.LocalizableMessage;

public class DataSourceDao extends BaseDao {
    private static final String DATA_SOURCE_SELECT = "select id, xid, name, data from dataSources ";

    public List<DataSourceVO<?>> getDataSources() {
        List<DataSourceVO<?>> dss = query(DATA_SOURCE_SELECT, new DataSourceRowMapper());
        Collections.sort(dss, new DataSourceNameComparator());
        return dss;
    }

    static class DataSourceNameComparator implements Comparator<DataSourceVO<?>> {
        public int compare(DataSourceVO<?> ds1, DataSourceVO<?> ds2) {
            if (StringUtils.isEmpty(ds1.getName()))
                return -1;
            return ds1.getName().compareToIgnoreCase(ds2.getName());
        }
    }

    public DataSourceVO<?> getDataSource(int id) {
        return queryForObject(DATA_SOURCE_SELECT + " where id=?", new Object[] { id }, new DataSourceRowMapper(), null);
    }

    public DataSourceVO<?> getDataSource(String xid) {
        return queryForObject(DATA_SOURCE_SELECT + " where xid=?", new Object[] { xid }, new DataSourceRowMapper(),
                null);
    }

    class DataSourceRowMapper implements GenericRowMapper<DataSourceVO<?>> {
        public DataSourceVO<?> mapRow(ResultSet rs, int rowNum) throws SQLException {
            DataSourceVO<?> ds = (DataSourceVO<?>) SerializationHelper.readObject(rs.getBlob(4).getBinaryStream());
            ds.setId(rs.getInt(1));
            ds.setXid(rs.getString(2));
            ds.setName(rs.getString(3));
            return ds;
        }
    }

    public String generateUniqueXid() {
        return generateUniqueXid(DataSourceVO.XID_PREFIX, "dataSources");
    }

    public boolean isXidUnique(String xid, int excludeId) {
        return isXidUnique(xid, excludeId, "dataSources");
    }

    public void saveDataSource(final DataSourceVO<?> vo) {
        // Decide whether to insert or update.
        if (vo.getId() == Common.NEW_ID)
            insertDataSource(vo);
        else
            updateDataSource(vo);
    }

    private void insertDataSource(final DataSourceVO<?> vo) {
        vo.setId(doInsert("insert into dataSources (xid, name, dataSourceType, data) values (?,?,?,?)", new Object[] {
                vo.getXid(), vo.getName(), vo.getType().getId(), SerializationHelper.writeObject(vo) }, new int[] {
                Types.VARCHAR, Types.VARCHAR, Types.INTEGER, Types.BLOB }));

        AuditEventType.raiseAddedEvent(AuditEventType.TYPE_DATA_SOURCE, vo);
    }

    @SuppressWarnings("unchecked")
    private void updateDataSource(final DataSourceVO<?> vo) {
        DataSourceVO<?> old = getDataSource(vo.getId());
        ejt.update("update dataSources set xid=?, name=?, data=? where id=?", new Object[] { vo.getXid(), vo.getName(),
                SerializationHelper.writeObject(vo), vo.getId() }, new int[] { Types.VARCHAR, Types.VARCHAR,
                Types.BLOB, Types.INTEGER });

        AuditEventType.raiseChangedEvent(AuditEventType.TYPE_DATA_SOURCE, old, (ChangeComparable<DataSourceVO<?>>) vo);
    }

    public void deleteDataSource(final int dataSourceId) {
        DataSourceVO<?> vo = getDataSource(dataSourceId);
        final ExtendedJdbcTemplate ejt2 = ejt;
        if (vo != null) {
            getTransactionTemplate().execute(new TransactionCallbackWithoutResult() {
                @Override
                protected void doInTransactionWithoutResult(TransactionStatus status) {
                    new MaintenanceEventDao().deleteMaintenanceEventsForDataSource(dataSourceId);
                    new DataPointDao().deleteDataPoints(dataSourceId);
                    ejt2.update("delete from eventHandlers where eventTypeId=" + EventType.EventSources.DATA_SOURCE
                            + " and eventTypeRef1=?", new Object[] { dataSourceId });
                    ejt2.update("delete from dataSourceUsers where dataSourceId=?", new Object[] { dataSourceId });
                    ejt2.update("delete from dataSources where id=?", new Object[] { dataSourceId });
                }
            });

            AuditEventType.raiseDeletedEvent(AuditEventType.TYPE_DATA_SOURCE, vo);
        }
    }

    public void copyPermissions(final int fromDataSourceId, final int toDataSourceId) {
        final List<Integer> userIds = queryForList("select userId from dataSourceUsers where dataSourceId=?",
                new Object[] { fromDataSourceId }, Integer.class);

        ejt.batchUpdate("insert into dataSourceUsers values (?,?)", new BatchPreparedStatementSetter() {
            @Override
            public int getBatchSize() {
                return userIds.size();
            }

            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ps.setInt(1, toDataSourceId);
                ps.setInt(2, userIds.get(i));
            }
        });
    }

    public int copyDataSource(final int dataSourceId, final ResourceBundle bundle) {
        return getTransactionTemplate().execute(new GenericTransactionCallback<Integer>() {
            @Override
            public Integer doInTransaction(TransactionStatus status) {
                DataPointDao dataPointDao = new DataPointDao();

                DataSourceVO<?> dataSource = getDataSource(dataSourceId);

                // Copy the data source.
                DataSourceVO<?> dataSourceCopy = dataSource.copy();
                dataSourceCopy.setId(Common.NEW_ID);
                dataSourceCopy.setXid(generateUniqueXid());
                dataSourceCopy.setEnabled(false);
                dataSourceCopy.setName(StringUtils.truncate(
                        LocalizableMessage.getMessage(bundle, "common.copyPrefix", dataSource.getName()), 40));
                saveDataSource(dataSourceCopy);

                // Copy permissions.
                copyPermissions(dataSource.getId(), dataSourceCopy.getId());

                // Copy the points.
                for (DataPointVO dataPoint : dataPointDao.getDataPoints(dataSourceId, null)) {
                    DataPointVO dataPointCopy = dataPoint.copy();
                    dataPointCopy.setId(Common.NEW_ID);
                    dataPointCopy.setXid(dataPointDao.generateUniqueXid());
                    dataPointCopy.setName(dataPoint.getName());
                    dataPointCopy.setDataSourceId(dataSourceCopy.getId());
                    dataPointCopy.setEnabled(dataPoint.isEnabled());
                    dataPointCopy.getComments().clear();

                    // Copy the event detectors
                    for (PointEventDetectorVO ped : dataPointCopy.getEventDetectors()) {
                        ped.setId(Common.NEW_ID);
                        ped.njbSetDataPoint(dataPointCopy);
                    }

                    dataPointDao.saveDataPoint(dataPointCopy);

                    // Copy permissions
                    dataPointDao.copyPermissions(dataPoint.getId(), dataPointCopy.getId());
                }

                return dataSourceCopy.getId();
            }
        });
    }
}
