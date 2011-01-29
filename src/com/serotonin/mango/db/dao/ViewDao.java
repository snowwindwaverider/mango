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

import java.sql.Blob;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;

import com.serotonin.db.IntValuePair;
import com.serotonin.db.spring.GenericRowMapper;
import com.serotonin.db.spring.IntValuePairRowMapper;
import com.serotonin.mango.Common;
import com.serotonin.mango.view.ShareUser;
import com.serotonin.mango.view.View;
import com.serotonin.util.SerializationHelper;

public class ViewDao extends BaseDao {
    //
    // /
    // / Views
    // /
    //
    private static final String VIEW_SELECT = "select data, id, xid, name, background, userId, anonymousAccess from mangoViews";
    private static final String USER_ID_COND = " where userId=? or id in (select mangoViewId from mangoViewUsers where userId=?)";

    public List<View> getViews() {
        List<View> views = query(VIEW_SELECT, new ViewRowMapper());
        setViewUsers(views);
        return views;
    }

    public List<View> getViews(int userId) {
        List<View> views = query(VIEW_SELECT + USER_ID_COND, new Object[] { userId, userId }, new ViewRowMapper());
        setViewUsers(views);
        return views;
    }

    public List<IntValuePair> getViewNames(int userId) {
        return query("select id, name from mangoViews" + USER_ID_COND, new Object[] { userId, userId },
                new IntValuePairRowMapper());
    }

    private void setViewUsers(List<View> views) {
        for (View view : views)
            setViewUsers(view);
    }

    public View getView(int id) {
        return getSingleView(VIEW_SELECT + " where id=?", new Object[] { id });
    }

    public View getViewByXid(String xid) {
        return getSingleView(VIEW_SELECT + " where xid=?", new Object[] { xid });
    }

    public View getView(String name) {
        return getSingleView(VIEW_SELECT + " where name=?", new Object[] { name });
    }

    private View getSingleView(String sql, Object[] params) {
        View view = queryForObject(sql, params, new ViewRowMapper(), null);
        if (view == null)
            return null;

        setViewUsers(view);
        return view;
    }

    class ViewRowMapper implements GenericRowMapper<View> {
        public View mapRow(ResultSet rs, int rowNum) throws SQLException {
            View v;
            Blob blob = rs.getBlob(1);
            if (blob == null)
                // This can happen during upgrade
                v = new View();
            else
                v = (View) SerializationHelper.readObject(blob.getBinaryStream());

            v.setId(rs.getInt(2));
            v.setXid(rs.getString(3));
            v.setName(rs.getString(4));
            v.setBackgroundFilename(rs.getString(5));
            v.setUserId(rs.getInt(6));
            v.setAnonymousAccess(rs.getInt(7));

            return v;
        }
    }

    class ViewNameRowMapper implements GenericRowMapper<View> {
        public View mapRow(ResultSet rs, int rowNum) throws SQLException {
            View v = new View();
            v.setId(rs.getInt(1));
            v.setName(rs.getString(2));
            v.setUserId(rs.getInt(3));

            return v;
        }
    }

    public String generateUniqueXid() {
        return generateUniqueXid(View.XID_PREFIX, "mangoViews");
    }

    public boolean isXidUnique(String xid, int excludeId) {
        return isXidUnique(xid, excludeId, "mangoViews");
    }

    public void saveView(final View view) {
        getTransactionTemplate().execute(new TransactionCallbackWithoutResult() {
            @Override
            protected void doInTransactionWithoutResult(TransactionStatus status) {
                // Decide whether to insert or update.
                if (view.getId() == Common.NEW_ID)
                    insertView(view);
                else
                    updateView(view);

                saveViewUsers(view);
            }
        });
    }

    void insertView(View view) {
        view.setId(doInsert(
                "insert into mangoViews (xid, name, background, userId, anonymousAccess, data) values (?,?,?,?,?,?)",
                new Object[] { view.getXid(), view.getName(), view.getBackgroundFilename(), view.getUserId(),
                        view.getAnonymousAccess(), SerializationHelper.writeObject(view) }, new int[] { Types.VARCHAR,
                        Types.VARCHAR, Types.VARCHAR, Types.INTEGER, Types.INTEGER, Types.BLOB }));
    }

    void updateView(View view) {
        ejt.update("update mangoViews set xid=?, name=?, background=?, anonymousAccess=?, data=? where id=?",
                new Object[] { view.getXid(), view.getName(), view.getBackgroundFilename(), view.getAnonymousAccess(),
                        SerializationHelper.writeObject(view), view.getId() }, new int[] { Types.VARCHAR,
                        Types.VARCHAR, Types.VARCHAR, Types.INTEGER, Types.BLOB, Types.INTEGER });
    }

    public void removeView(final int viewId) {
        deleteViewUsers(viewId);
        ejt.update("delete from mangoViews where id=?", new Object[] { viewId });
    }

    //
    // /
    // / View users
    // /
    //
    private void setViewUsers(View view) {
        view.setViewUsers(query("select userId, accessType from mangoViewUsers where mangoViewId=?",
                new Object[] { view.getId() }, new ViewUserRowMapper()));
    }

    class ViewUserRowMapper implements GenericRowMapper<ShareUser> {
        public ShareUser mapRow(ResultSet rs, int rowNum) throws SQLException {
            ShareUser vu = new ShareUser();
            vu.setUserId(rs.getInt(1));
            vu.setAccessType(rs.getInt(2));
            return vu;
        }
    }

    private void deleteViewUsers(int viewId) {
        ejt.update("delete from mangoViewUsers where mangoViewId=?", new Object[] { viewId });
    }

    void saveViewUsers(final View view) {
        // Delete anything that is currently there.
        deleteViewUsers(view.getId());

        // Add in all of the entries.
        ejt.batchUpdate("insert into mangoViewUsers values (?,?,?)", new BatchPreparedStatementSetter() {
            @Override
            public int getBatchSize() {
                return view.getViewUsers().size();
            }

            @Override
            public void setValues(PreparedStatement ps, int i) throws SQLException {
                ShareUser vu = view.getViewUsers().get(i);
                ps.setInt(1, view.getId());
                ps.setInt(2, vu.getUserId());
                ps.setInt(3, vu.getAccessType());
            }
        });
    }

    public void removeUserFromView(int viewId, int userId) {
        ejt.update("delete from mangoViewUsers where mangoViewId=? and userId=?", new Object[] { viewId, userId });
    }
}
