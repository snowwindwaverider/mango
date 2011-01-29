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
package com.serotonin.mango.web.dwr;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.directwebremoting.WebContextFactory;
import org.joda.time.DateTime;

import com.serotonin.mango.Common;
import com.serotonin.mango.db.dao.EventDao;
import com.serotonin.mango.rt.event.EventInstance;
import com.serotonin.mango.util.DateUtils;
import com.serotonin.mango.vo.User;
import com.serotonin.util.StringUtils;
import com.serotonin.web.dwr.DwrResponseI18n;
import com.serotonin.web.i18n.LocalizableMessage;

public class EventsDwr extends BaseDwr {
    private static final int PAGE_SIZE = 50;
    private static final int PAGINATION_RADIUS = 3;

    public static final String STATUS_ALL = "*";
    public static final String STATUS_ACTIVE = "A";
    public static final String STATUS_RTN = "R";
    public static final String STATUS_NORTN = "N";

    public DwrResponseI18n search(int eventId, int eventSourceType, String status, int alarmLevel, String keywordStr,
            int page, Date date) {
        DwrResponseI18n response = new DwrResponseI18n();
        HttpServletRequest request = WebContextFactory.get().getHttpServletRequest();
        User user = Common.getUser(request);

        String[] keywordArr = keywordStr.split("\\s+");
        List<String> keywords = new ArrayList<String>();
        for (String s : keywordArr) {
            if (!StringUtils.isEmpty(s))
                keywords.add(s);
        }

        if (keywords.isEmpty())
            keywordArr = null;
        else {
            keywordArr = new String[keywords.size()];
            keywords.toArray(keywordArr);
        }

        int from = PAGE_SIZE * page;
        int to = from + PAGE_SIZE;

        // The date is set for the top of the day, which will end up excluding all of the events for that day. So,
        // we need to add 1 day to it.
        if (date != null)
            date = DateUtils.minus(new DateTime(date.getTime()), Common.TimePeriods.DAYS, -1).toDate();

        EventDao eventDao = new EventDao();
        List<EventInstance> results = eventDao.search(eventId, eventSourceType, status, alarmLevel, keywordArr, user
                .getId(), getResourceBundle(), from, to, date);

        Map<String, Object> model = new HashMap<String, Object>();
        int searchRowCount = eventDao.getSearchRowCount();
        int pages = (int) Math.ceil(((double) searchRowCount) / PAGE_SIZE);

        if (date != null) {
            int startRow = eventDao.getStartRow();
            if (startRow == -1)
                page = pages - 1;
            else
                page = eventDao.getStartRow() / PAGE_SIZE;
        }

        if (pages > 1) {
            model.put("displayPagination", true);

            if (page - PAGINATION_RADIUS > 1)
                model.put("leftEllipsis", true);
            else
                model.put("leftEllipsis", false);

            int linkFrom = page + 1 - PAGINATION_RADIUS;
            if (linkFrom < 2)
                linkFrom = 2;
            model.put("linkFrom", linkFrom);
            int linkTo = page + 1 + PAGINATION_RADIUS;
            if (linkTo >= pages)
                linkTo = pages - 1;
            model.put("linkTo", linkTo);

            if (page + PAGINATION_RADIUS < pages - 2)
                model.put("rightEllipsis", true);
            else
                model.put("rightEllipsis", false);

            model.put("numberOfPages", pages);
        }
        else
            model.put("displayPagination", false);

        model.put("events", results);
        model.put("page", page);
        model.put("pendingEvents", false);

        response.addData("content", generateContent(request, "eventList.jsp", model));
        response.addData("resultCount", new LocalizableMessage("events.search.resultCount", searchRowCount));

        return response;
    }
}
