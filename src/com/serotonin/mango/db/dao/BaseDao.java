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

import java.util.List;

import javax.sql.DataSource;

import com.serotonin.db.DaoUtils;
import com.serotonin.mango.Common;

public class BaseDao extends DaoUtils {
    /**
     * Public constructor for code that needs to get stuff from the database.
     */
    public BaseDao() {
        super(Common.ctx.getDatabaseAccess().getDataSource());
    }

    protected BaseDao(DataSource dataSource) {
        super(dataSource);
    }

    //
    // Convenience methods for storage of booleans.
    //
    protected static String boolToChar(boolean b) {
        return b ? "Y" : "N";
    }

    protected static boolean charToBool(String s) {
        return "Y".equals(s);
    }

    protected void deleteInChunks(String sql, List<Integer> ids) {
        int chunk = 1000;
        for (int i = 0; i < ids.size(); i += chunk) {
            String idStr = createDelimitedList(ids, i, i + chunk, ",", null);
            ejt.update(sql + " (" + idStr + ")");
        }
    }

    //
    // XID convenience methods
    //
    protected String generateUniqueXid(String prefix, String tableName) {
        String xid = Common.generateXid(prefix);
        while (!isXidUnique(xid, -1, tableName))
            xid = Common.generateXid(prefix);
        return xid;
    }

    protected boolean isXidUnique(String xid, int excludeId, String tableName) {
        return ejt.queryForInt("select count(*) from " + tableName + " where xid=? and id<>?", new Object[] { xid,
                excludeId }) == 0;
    }
}
