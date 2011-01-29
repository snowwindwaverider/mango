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
<%@ include file="/WEB-INF/jsp/include/tech.jsp" %>
<%@page import="br.org.scadabr.vo.dataSource.dnp3.Dnp3SerialDataSourceVO"%>

<script type="text/javascript">
function saveDataSourceImpl() {
    DataSourceEditDwr.saveDNP3SerialDataSource($get("dataSourceName"), $get("dataSourceXid"),
  		  $get("sourceAddress"), $get("slaveAddress"), $get("commPortId"), $get("baudRate"), 
  		  $get("staticPollPeriods"), $get("rbePollPeriods"),
  		  $get("rbePeriodType"), $get("timeout"), $get("retries"), saveDataSourceCB);
}
</script>

<tr>
  <td class="formLabelRequired"><fmt:message key="dsEdit.dnp3Serial.commPortId"/></td>
  <td class="formField"><input id="commPortId" type="text" value="${dataSource.commPortId}"/></td>
</tr>

<tr>
  <td class="formLabelRequired"><fmt:message key="dsEdit.dnp3Serial.baud"/></td>
  <td class="formField">
    <sst:select id="baudRate" value="${dataSource.baudRate}">
      <sst:option>110</sst:option>
      <sst:option>300</sst:option>
      <sst:option>1200</sst:option>
      <sst:option>2400</sst:option>
      <sst:option>4800</sst:option>
      <sst:option>9600</sst:option>
      <sst:option>19200</sst:option>
      <sst:option>38400</sst:option>
      <sst:option>57600</sst:option>
      <sst:option>115200</sst:option>
      <sst:option>230400</sst:option>
      <sst:option>460800</sst:option>
      <sst:option>921600</sst:option>
    </sst:select>
  </td>
</tr>