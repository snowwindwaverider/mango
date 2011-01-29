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

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;

import com.serotonin.db.spring.ExtendedJdbcTemplate;
import com.serotonin.db.spring.GenericRowMapper;
import com.serotonin.mango.Common;
import com.serotonin.mango.rt.event.type.EventType;
import com.serotonin.mango.vo.publish.PublishedPointVO;
import com.serotonin.mango.vo.publish.PublisherVO;
import com.serotonin.util.SerializationHelper;
import com.serotonin.util.StringUtils;

/**
 * @author Matthew Lohbihler
 */
public class PublisherDao extends BaseDao {
    public String generateUniqueXid() {
        return generateUniqueXid(PublisherVO.XID_PREFIX, "publishers");
    }

    public boolean isXidUnique(String xid, int excludeId) {
        return isXidUnique(xid, excludeId, "publishers");
    }

    private static final String PUBLISHER_SELECT = "select id, xid, data from publishers ";

    public List<PublisherVO<? extends PublishedPointVO>> getPublishers() {
        return query(PUBLISHER_SELECT, new PublisherRowMapper());
    }

    public List<PublisherVO<? extends PublishedPointVO>> getPublishers(Comparator<PublisherVO<?>> comparator) {
        List<PublisherVO<? extends PublishedPointVO>> result = getPublishers();
        Collections.sort(result, comparator);
        return result;
    }

    public static class PublisherNameComparator implements Comparator<PublisherVO<?>> {
        public int compare(PublisherVO<?> p1, PublisherVO<?> p2) {
            if (StringUtils.isEmpty(p1.getName()))
                return -1;
            return p1.getName().compareTo(p2.getName());
        }
    }

    public PublisherVO<? extends PublishedPointVO> getPublisher(int id) {
        return queryForObject(PUBLISHER_SELECT + " where id=?", new Object[] { id }, new PublisherRowMapper(), null);
    }

    public PublisherVO<? extends PublishedPointVO> getPublisher(String xid) {
        return queryForObject(PUBLISHER_SELECT + " where xid=?", new Object[] { xid }, new PublisherRowMapper(), null);
    }

    class PublisherRowMapper implements GenericRowMapper<PublisherVO<? extends PublishedPointVO>> {
        @SuppressWarnings("unchecked")
        public PublisherVO<? extends PublishedPointVO> mapRow(ResultSet rs, int rowNum) throws SQLException {
            PublisherVO<? extends PublishedPointVO> p = (PublisherVO<? extends PublishedPointVO>) SerializationHelper
                    .readObject(rs.getBlob(3).getBinaryStream());
            p.setId(rs.getInt(1));
            p.setXid(rs.getString(2));
            return p;
        }
    }

    public void savePublisher(final PublisherVO<? extends PublishedPointVO> vo) {
        // Decide whether to insert or update.
        if (vo.getId() == Common.NEW_ID)
            vo.setId(doInsert("insert into publishers (xid, data) values (?,?)", new Object[] { vo.getXid(),
                    SerializationHelper.writeObjectToArray(vo) }, new int[] { Types.VARCHAR, Types.BLOB }));
        else
            ejt.update("update publishers set xid=?, data=? where id=?", new Object[] { vo.getXid(),
                    SerializationHelper.writeObject(vo), vo.getId() }, new int[] { Types.VARCHAR, Types.BLOB,
                    Types.INTEGER });
    }

    public void deletePublisher(final int publisherId) {
        final ExtendedJdbcTemplate ejt2 = ejt;
        getTransactionTemplate().execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                ejt2.update("delete from eventHandlers where eventTypeId=" + EventType.EventSources.PUBLISHER
                        + " and eventTypeRef1=?", new Object[] { publisherId });
                ejt2.update("delete from publishers where id=?", new Object[] { publisherId });
            }
        });
    }
}
