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
package com.serotonin.mango.db.upgrade;

import java.io.OutputStream;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.jdbc.core.PreparedStatementSetter;

import com.serotonin.db.spring.GenericRowMapper;
import com.serotonin.mango.vo.event.EventHandlerVO;
import com.serotonin.mango.vo.event.EventTypeVO;
import com.serotonin.mango.web.dwr.beans.RecipientListEntryBean;
import com.serotonin.util.SerializationHelper;

/**
 * @author Matthew Lohbihler
 */
public class Upgrade1_1_1 extends DBUpgrade {
    private final Log log = LogFactory.getLog(getClass());

    @Override
    public void upgrade() throws Exception {
        OutputStream out = createUpdateLogOutputStream("1_1_1");

        // Get the event handlers from the field mapping version.
        List<EventTypeAndHandler> eventHandlers = query(EVENT_HANDLER_SELECT, new EventHandlerRowMapper());
        for (EventTypeAndHandler e : eventHandlers)
            attachHandlerRelationalInfo(e.eventHandler);
        log.info("Retrieved " + eventHandlers.size() + " event handlers");

        // Run the script.
        log.info("Running script");
        runScript(script, out);

        // Save the event handlers to BLOBs.
        for (EventTypeAndHandler e : eventHandlers) {
            log.info("Saved handler " + e.eventHandler.getId());
            insertEventHandler(e.eventType, e.eventHandler);
        }

        out.flush();
        out.close();
    }

    @Override
    protected String getNewSchemaVersion() {
        return "1.2.0";
    }

    private static String[] script = { "drop table emailHandlerRecipients;", "drop table eventHandlers;",
            "create table eventHandlers (",
            "  id int not null generated by default as identity (start with 1, increment by 1),",
            "  eventTypeId int not null,", "  eventTypeRef1 int not null,", "  eventTypeRef2 int not null,",
            "  data blob not null", ");", "alter table eventHandlers add constraint eventHandlersPk primary key (id);",

            "alter table pointEventDetectors add column alphanumericState varchar(128);", };

    //
    // / Event handlers.
    //
    private class EventTypeAndHandler {
        EventTypeVO eventType;
        EventHandlerVO eventHandler;

        public EventTypeAndHandler(EventTypeVO eventType, EventHandlerVO eventHandler) {
            this.eventType = eventType;
            this.eventHandler = eventHandler;
        }
    }

    private static final String EVENT_HANDLER_SELECT = "select id, eventTypeId, eventTypeRef1, eventTypeRef2, "
            + "  handlerType, targetDataPointId, useSourceValue, valueToSet, "
            + "  sendEscalation, escalationDelayType, escalationDelay, sendInactive " + "from eventHandlers ";

    class EventHandlerRowMapper implements GenericRowMapper<EventTypeAndHandler> {
        @SuppressWarnings("synthetic-access")
        public EventTypeAndHandler mapRow(ResultSet rs, int rowNum) throws SQLException {

            EventHandlerVO h = new EventHandlerVO();
            int i = 0;
            h.setId(rs.getInt(++i));

            EventTypeVO t = new EventTypeVO(rs.getInt(++i), rs.getInt(++i), rs.getInt(++i));

            h.setHandlerType(rs.getInt(++i));
            h.setTargetPointId(rs.getInt(++i));
            if (charToBool(rs.getString(++i))) {
                h.setActiveAction(EventHandlerVO.SET_ACTION_POINT_VALUE);
                h.setActivePointId(t.getTypeRef1());
            }
            else
                h.setActiveAction(EventHandlerVO.SET_ACTION_STATIC_VALUE);
            h.setActiveValueToSet(rs.getString(++i));
            h.setSendEscalation(charToBool(rs.getString(++i)));
            h.setEscalationDelayType(rs.getInt(++i));
            h.setEscalationDelay(rs.getInt(++i));
            h.setSendInactive(charToBool(rs.getString(++i)));

            return new EventTypeAndHandler(t, h);
        }
    }

    private static final String EMAIL_HANDLER_SELECT = "select r.recipientType, r.refId, r.address, ml.name "
            + "from emailHandlerRecipients r " + "  left join mailingLists ml on r.refId = ml.id "
            + "where eventHandlerId=? and listType=?";

    private void attachHandlerRelationalInfo(EventHandlerVO handler) {
        RecipientListEntryBeanRowMapper mapper = new RecipientListEntryBeanRowMapper();
        handler.setActiveRecipients(query(EMAIL_HANDLER_SELECT, new Object[] { handler.getId(),
                EventHandlerVO.RECIPIENT_TYPE_ACTIVE }, mapper));
        handler.setEscalationRecipients(query(EMAIL_HANDLER_SELECT, new Object[] { handler.getId(),
                EventHandlerVO.RECIPIENT_TYPE_ESCALATION }, mapper));
    }

    class RecipientListEntryBeanRowMapper implements GenericRowMapper<RecipientListEntryBean> {
        public RecipientListEntryBean mapRow(ResultSet rs, int rowNum) throws SQLException {
            RecipientListEntryBean bean = new RecipientListEntryBean();
            bean.setRecipientType(rs.getInt(1));
            bean.setReferenceId(rs.getInt(2));
            bean.setReferenceAddress(rs.getString(3));
            return bean;
        }
    }

    private void insertEventHandler(final EventTypeVO type, final EventHandlerVO handler) {
        ejt.update("insert into eventHandlers " + "  (id, eventTypeId, eventTypeRef1, eventTypeRef2, data) "
                + "values (?,?,?,?,?)", new PreparedStatementSetter() {
            public void setValues(PreparedStatement ps) throws SQLException {
                ps.setInt(1, handler.getId());
                ps.setInt(2, type.getTypeId());
                ps.setInt(3, type.getTypeRef1());
                ps.setInt(4, type.getTypeRef2());
                ps.setBlob(5, SerializationHelper.writeObject(handler));
            }
        });
    }
}
