<%--
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
    along with this program.  If not, see http://www.gnu.org/licenses/.
--%>
<%@page import="com.serotonin.mango.Common"%>
<%@ include file="/WEB-INF/jsp/include/tech.jsp" %>
<%@page import="com.serotonin.mango.vo.UserComment"%>
<%@page import="com.serotonin.mango.rt.event.type.EventType"%>
<%@page import="com.serotonin.mango.web.dwr.EventsDwr"%>
<tag:page dwr="EventsDwr" onload="init">
  <%@ include file="/WEB-INF/jsp/include/userComment.jsp" %>
  <style>
    .incrementControl { width: 2em; }
  </style>
  <script type="text/javascript">
    // Tell the log poll that we're interested in monitoring pending alarms.
    mango.longPoll.pollRequest.pendingAlarms = true;
    dojo.requireLocalization("dojo.i18n.calendar", "gregorian", null, "de,en,es,fi,fr,ROOT,hu,it,ja,ko,nl,pt,pt-br,sv,zh,zh-cn,zh-hk,zh-tw");
    dojo.requireLocalization("dojo.i18n.calendar", "gregorianExtras", null, "ROOT,ja,zh");
    
    function init() {
        EventsDwr.getDateRangeDefaults(<c:out value="<%= Common.TimePeriods.DAYS %>"/>, 1, function(data) { setDateRange(data); });

        var x = dojo.widget.byId("datePicker");
        x.hide();
        x.setDate(x.today);
        dojo.event.connect(x,'onValueChanged','jumpToDateClicked');
    }
  
    function updatePendingAlarmsContent(content) {
        hide("hourglass");
        
        $set("pendingAlarms", content);
        if (content) {
            show("ackAllDiv");
            hide("noAlarms");
        }
        else {
            $set("pendingAlarms", "");
            hide("ackAllDiv");
            show("noAlarms");
        }
    }
    
    function doSearch(page, date) {
        setDisabled("searchBtn", true);
        $set("searchMessage", "<fmt:message key="events.search.searching"/>");
        EventsDwr.search($get("eventId"), $get("eventSourceType"), $get("eventStatus"), $get("alarmLevel"),
                $get("keywords"), $get("dateRangeType"), $get("relativeType"), $get("prevPeriodCount"), 
                $get("prevPeriodType"), $get("pastPeriodCount"), $get("pastPeriodType"), $get("fromNone"), 
                $get("fromYear"), $get("fromMonth"), $get("fromDay"), $get("fromHour"), $get("fromMinute"), 
                $get("fromSecond"), $get("toNone"), $get("toYear"), $get("toMonth"), $get("toDay"), $get("toHour"), 
                $get("toMinute"), $get("toSecond"), page, date, function(results) {
            $set("searchResults", results.data.content);
            setDisabled("searchBtn", false);
            $set("searchMessage", results.data.resultCount);
        });
    }

    function jumpToDate(parent) {
        var div = $("datePickerDiv");
        var bounds = getAbsoluteNodeBounds(parent);
        div.style.top = bounds.y +"px";
        div.style.left = bounds.x +"px";
        var x = dojo.widget.byId("datePicker");
        x.show();
    }

    var dptimeout = null;
    function expireDatePicker() {
        dptimeout = setTimeout(function() { dojo.widget.byId("datePicker").hide(); }, 500);
    }

    function cancelDatePickerExpiry() {
        if (dptimeout) {
            clearTimeout(dptimeout);
            dptimeout = null;
        }
    }

    function jumpToDateClicked(date) {
        var x = dojo.widget.byId("datePicker");
        if (x.isShowing()) {
            x.hide();
            doSearch(0, date);
        }
    }

    function newSearch() {
        var x = dojo.widget.byId("datePicker");
        x.setDate(x.today);
        doSearch(0);
    }
    
    function silenceAll() {
    	MiscDwr.silenceAll(function(result) {
    		var silenced = result.data.silenced;
    		for (var i=0; i<silenced.length; i++)
    			setSilenced(silenced[i], true);
    	});
    }

    function updateDateRangeFields() {
    	var dateRangeType = $get("dateRangeType");
        if (dateRangeType == <c:out value="<%= EventsDwr.DATE_RANGE_TYPE_RELATIVE %>"/>) {
    		show("dateRangeRelative");
    		hide("dateRangeSpecific");
    		
            var relativeType = $get("relativeType");
            if (relativeType == 1) {
                setDisabled("prevPeriodCount", false);
                setDisabled("prevPeriodType", false);
                setDisabled("pastPeriodCount", true);
                setDisabled("pastPeriodType", true);
            }
            else {
                setDisabled("prevPeriodCount", true);
                setDisabled("prevPeriodType", true);
                setDisabled("pastPeriodCount", false);
                setDisabled("pastPeriodType", false);
            }
    	}
    	else if (dateRangeType == <c:out value="<%= EventsDwr.DATE_RANGE_TYPE_SPECIFIC %>"/>) {
            hide("dateRangeRelative");
            show("dateRangeSpecific");
            updateDateRange();
    	}
    	else {
            hide("dateRangeRelative");
            hide("dateRangeSpecific");
    	}
    }
    
    function exportEvents() {
        startImageFader($("exportEventsImg"));
        EventsDwr.exportEvents($get("eventId"), $get("eventSourceType"), $get("eventStatus"), $get("alarmLevel"),
                $get("keywords"), $get("dateRangeType"), $get("relativeType"), $get("prevPeriodCount"), 
                $get("prevPeriodType"), $get("pastPeriodCount"), $get("pastPeriodType"), $get("fromNone"), 
                $get("fromYear"), $get("fromMonth"), $get("fromDay"), $get("fromHour"), $get("fromMinute"), 
                $get("fromSecond"), $get("toNone"), $get("toYear"), $get("toMonth"), $get("toDay"), $get("toHour"), 
                $get("toMinute"), $get("toSecond"), function(data) {
        	stopImageFader($("exportEventsImg"));
            window.location = "eventExport/eventData.csv";
        });
    }
  </script>
  
  <div class="borderDiv marB" style="float:left;">
    <div class="smallTitle titlePadding" style="float:left;">
      <tag:img png="flag_white" title="events.alarms"/>
      <fmt:message key="events.pending"/>
    </div>
    <div id="ackAllDiv" class="titlePadding" style="display:none;float:right;">
      <fmt:message key="events.acknowledgeAll"/>
      <tag:img png="tick" onclick="MiscDwr.acknowledgeAllPendingEvents()" title="events.acknowledgeAll"/>&nbsp;
      <fmt:message key="events.silenceAll"/>
      <tag:img png="sound_mute" onclick="silenceAll()" title="events.silenceAll"/><br/>
    </div>
    <div id="pendingAlarms" style="clear:both;"></div>
    <div id="noAlarms" style="display:none;padding:6px;text-align:center;">
      <b><fmt:message key="events.emptyList"/></b>
    </div>
    <div id="hourglass" style="padding:6px;text-align:center;"><tag:img png="hourglass"/></div>
  </div>
  
  <div class="borderDiv" style="clear:left;float:left;">
    <div class="smallTitle titlePadding"><fmt:message key="events.search"/></div>
    <div>
      <table>
        <tr>
          <td class="formLabel"><fmt:message key="events.id"/></td>
          <td class="formField"><input id="eventId" type="text"></td>
        </tr>
        <tr>
          <td class="formLabel"><fmt:message key="events.search.type"/></td>
          <td class="formField">
            <select id="eventSourceType">
              <option value="-1"><fmt:message key="common.all"/></option>
              <option value="<c:out value="<%= EventType.EventSources.DATA_POINT %>"/>"><fmt:message key="eventHandlers.pointEventDetector"/></option>
              <option value="<c:out value="<%= EventType.EventSources.SCHEDULED %>"/>"><fmt:message key="scheduledEvents.ses"/></option>
              <option value="<c:out value="<%= EventType.EventSources.COMPOUND %>"/>"><fmt:message key="compoundDetectors.compoundEventDetectors"/></option>
              <option value="<c:out value="<%= EventType.EventSources.DATA_SOURCE %>"/>"><fmt:message key="eventHandlers.dataSourceEvents"/></option>
              <option value="<c:out value="<%= EventType.EventSources.PUBLISHER %>"/>"><fmt:message key="eventHandlers.publisherEvents"/></option>
              <option value="<c:out value="<%= EventType.EventSources.MAINTENANCE %>"/>"><fmt:message key="eventHandlers.maintenanceEvents"/></option>
              <option value="<c:out value="<%= EventType.EventSources.SYSTEM %>"/>"><fmt:message key="eventHandlers.systemEvents"/></option>
              <option value="<c:out value="<%= EventType.EventSources.AUDIT %>"/>"><fmt:message key="eventHandlers.auditEvents"/></option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="formLabel"><fmt:message key="common.status"/></td>
          <td class="formField">
            <select id="eventStatus">
              <option value="<c:out value="<%= EventsDwr.STATUS_ALL %>"/>"><fmt:message key="common.all"/></option>
              <option value="<c:out value="<%= EventsDwr.STATUS_ACTIVE %>"/>"><fmt:message key="common.active"/></option>
              <option value="<c:out value="<%= EventsDwr.STATUS_RTN %>"/>"><fmt:message key="event.rtn.rtn"/></option>
              <option value="<c:out value="<%= EventsDwr.STATUS_NORTN %>"/>"><fmt:message key="common.nortn"/></option>
            </select>
          </td>
        </tr>
        <tr>
          <td class="formLabel"><fmt:message key="common.alarmLevel"/></td>
          <td class="formField"><select id="alarmLevel"><tag:alarmLevelOptions allOption="true"/></select></td>
        </tr>
        <tr>
          <td class="formLabel"><fmt:message key="events.search.keywords"/></td>
          <td class="formField"><input id="keywords" type="text"/></td>
        </tr>
        
        <tr>
          <td class="formLabel"><fmt:message key="events.search.dateRange"/></td>
          <td class="formField">
            <table>
              <tr><td>
                 <select id="dateRangeType" onchange="updateDateRangeFields()">
                   <option value="<c:out value="<%= EventsDwr.DATE_RANGE_TYPE_NONE %>"/>"><fmt:message key="events.search.dateRange.none"/></option>
                   <option value="<c:out value="<%= EventsDwr.DATE_RANGE_TYPE_RELATIVE %>"/>"><fmt:message key="events.search.dateRange.relative"/></option>
                   <option value="<c:out value="<%= EventsDwr.DATE_RANGE_TYPE_SPECIFIC %>"/>"><fmt:message key="events.search.dateRange.specific"/></option>
                 </select>
              </td></tr>
              <tr>
                <td style="padding-left:40px;">
                  <table id="dateRangeRelative" style="display: none;">
                    <tr>
                      <td valign="top"><input type="radio" name="relativeType" onchange="updateDateRangeFields()"
                              id="relprev" value="<c:out value="<%= EventsDwr.RELATIVE_DATE_TYPE_PREVIOUS %>"/>" 
                              checked="checked"/><label for="relprev"><fmt:message key="events.search.previous"/></label></td>
                      <td valign="top">
                        <input type="text" id="prevPeriodCount" class="formVeryShort"/>
                        <select id="prevPeriodType">
                          <tag:timePeriodOptions min="true" h="true" d="true" w="true" mon="true" y="true"/>
                        </select><br/>
                        <span class="formError" id="previousPeriodCountError"></span>
                      </td>
                    </tr>
                    <tr>
                      <td valign="top"><input type="radio" name="relativeType" onchange="updateDateRangeFields()"
                              id="relpast" value="<c:out value="<%= EventsDwr.RELATIVE_DATE_TYPE_PAST %>"/>"/><label 
                              for="relpast"><fmt:message key="events.search.past"/></label></td>
                      <td valign="top">
                        <input type="text" id="pastPeriodCount" class="formVeryShort"/>
                        <select id="pastPeriodType">
                          <tag:timePeriodOptions min="true" h="true" d="true" w="true" mon="true" y="true"/>
                        </select><br/>
                        <span class="formError" id="pastPeriodCountError"></span>
                      </td>
                    </tr>
                  </table>
                  
                  <div id="dateRangeSpecific" style="display: none;"><tag:dateRange/></div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <tr>
          <td colspan="2" align="center">
            <input id="searchBtn" type="button" value="<fmt:message key="events.search.search"/>" onclick="newSearch()"/>
            <span id="searchMessage" class="formError"></span>
          </td>
        </tr>
      </table>
    </div>
    <div id="searchResults"></div>
  </div>
  <div id="datePickerDiv" style="position:absolute; top:0px; left:0px;" onmouseover="cancelDatePickerExpiry()" onmouseout="expireDatePicker()">
    <div widgetId="datePicker" dojoType="datepicker" dayWidth="narrow" lang="${lang}"></div>
  </div>
</tag:page>