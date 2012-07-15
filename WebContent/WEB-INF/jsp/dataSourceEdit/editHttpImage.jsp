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
<%-- Errors occurred if the script type javascript was not flush with the import of datatypes.  --%>
<%@include file="/WEB-INF/jsp/include/tech.jsp"%>
<%@page import="com.serotonin.mango.vo.dataSource.http.HttpImagePointLocatorVO"%>
<%@page import="com.serotonin.mango.DataTypes"%><script type="text/javascript">


  function saveDataSourceImpl() {
      DataSourceEditDwr.saveHttpImageDataSource($get("dataSourceName"), $get("dataSourceXid"), $get("updatePeriods"),
              $get("updatePeriodType"), saveDataSourceCB);
  }
  
  function editPointCBImpl(locator) {
      $set("url", locator.url);
      $set("timeoutSeconds", locator.timeoutSeconds);
      $set("retries", locator.retries);
      $set("scaleType", locator.scaleType);
      $set("scalePercent", locator.scalePercent);
      $set("scaleWidth", locator.scaleWidth);
      $set("scaleHeight", locator.scaleHeight);
      $set("readLimit", locator.readLimit);
      $set("webcamLiveFeedCode", locator.webcamLiveFeedCode);
      
      reportPointsArray = new Array();
      for (var i=0; i<locator.overlayPoints.length; i++)
          addToReportPointsArray(locator.overlayPoints[i]);        
      writeReportPointsArray();

      scaleTypeChanged();
  }
  
  function savePointImpl(locator) {
      delete locator.settable;
      delete locator.dataTypeId;
      
      locator.url = $get("url");
      locator.timeoutSeconds = $get("timeoutSeconds");
      locator.retries = $get("retries");
      locator.scaleType = $get("scaleType");
      locator.scalePercent = $get("scalePercent");
      locator.scaleWidth = $get("scaleWidth");
      locator.scaleHeight = $get("scaleHeight");
      locator.readLimit = $get("readLimit");
      locator.webcamLiveFeedCode = $get("webcamLiveFeedCode");
      locator.overlayPoints = getReportPointIdsArray();
      
      DataSourceEditDwr.saveHttpImagePointLocator(currentPoint.id, $get("xid"), $get("name"), locator, savePointCB);
  }
  
  function scaleTypeChanged() {
      var type = $get("scaleType");
      if (type == <c:out value="<%= HttpImagePointLocatorVO.SCALE_TYPE_NONE %>"/>) {
          hide("scalePercentRow");
          hide("scaleWidthRow");
          hide("scaleHeightRow");
      }
      else if (type == <c:out value="<%= HttpImagePointLocatorVO.SCALE_TYPE_PERCENT %>"/>) {
          show("scalePercentRow");
          hide("scaleWidthRow");
          hide("scaleHeightRow");
      }
      else if (type == <c:out value="<%= HttpImagePointLocatorVO.SCALE_TYPE_BOX %>"/>) {
          hide("scalePercentRow");
          show("scaleWidthRow");
          show("scaleHeightRow");
      }
  }
  
  //  copied from reports.jsp 
  var allPointsArray = new Array();
  var allPointsArrayInitialized = false;
  var reportPointsArray;
  if (allPointsArrayInitialized == false) {
	  DataSourceEditDwr.getAllPoints(function(response) {
			allPointsArray = response;
			allPointsArrayInitialized = true;
  		})
  }
  function addPointToReport() {
      var pointId = $get("allPointsList");
      addToReportPointsArray(pointId);
      writeReportPointsArray();
  }
  function addToReportPointsArray(pointId) {
      var data = getPointData(pointId);
      if (data) {
          // Missing names imply that the point was deleted, so ignore.
          reportPointsArray[reportPointsArray.length] = {
              pointId: pointId,
              pointName : data.name,
              pointType : data.dataTypeMessage
          };
      }
  }
  function getPointData(pointId) {
      for (var i=0; i<allPointsArray.length; i++) {
          if (allPointsArray[i].id == pointId)
              return allPointsArray[i];
      }
      return null;
  }
  function writeReportPointsArray() {
      dwr.util.removeAllRows("reportPointsTable");
      if (reportPointsArray.length == 0) {
          show($("reportPointsTableEmpty"));
          hide($("reportPointsTableHeaders"));
      }
      else {
          hide($("reportPointsTableEmpty"));
          show($("reportPointsTableHeaders"));
          dwr.util.addRows("reportPointsTable", reportPointsArray,
              [
                  function(data) { return data.pointName; },
                  function(data) { return data.pointType; },
                  function(data) { 
                          return "<img src='images/bullet_delete.png' class='ptr' "+
                                  "onclick='removeFromReportPointsArray("+ data.pointId +")'/>";
                  }
              ],
              {
                  rowCreator:function(options) {
                      var tr = document.createElement("tr");
                      tr.className = "smRow"+ (options.rowIndex % 2 == 0 ? "" : "Alt");
                      return tr;
                  }
              });
      }
      updatePointsList();
  }
  function updatePointsList() {
      dwr.util.removeAllOptions("allPointsList");
      var availPoints = new Array();
      for (var i=0; i<allPointsArray.length; i++) {
          var found = false;
          for (var j=0; j<reportPointsArray.length; j++) {
              if (reportPointsArray[j].pointId == allPointsArray[i].id) {
                  found = true;
                  break;
              }
          }
          if (!found && (allPointsArray[i].dataType != <%=DataTypes.IMAGE%>))
              availPoints[availPoints.length] = allPointsArray[i];
      }
      dwr.util.addOptions("allPointsList", availPoints, "id", "name");
  }
  function removeFromReportPointsArray(pointId) {
      for (var i=reportPointsArray.length-1; i>=0; i--) {
          if (reportPointsArray[i].pointId == pointId)
              reportPointsArray.splice(i, 1);
      }
      writeReportPointsArray();
  }
  function getReportPointIdsArray() {
      var points = new Array();
      for (var i=0; i<reportPointsArray.length; i++)
          points[points.length] = reportPointsArray[i].pointId;
      return points;
  }
    
</script>

<c:set var="dsDesc"><fmt:message key="dsEdit.httpImage.desc"/></c:set>
<c:set var="dsHelpId" value="httpImageDS"/>
<%@ include file="/WEB-INF/jsp/dataSourceEdit/dsHead.jspf" %>
  <tr>
    <td class="formLabelRequired"><fmt:message key="dsEdit.updatePeriod"/></td>
    <td class="formField">
      <input type="text" id="updatePeriods" value="${dataSource.updatePeriods}" class="formShort"/>
      <sst:select id="updatePeriodType" value="${dataSource.updatePeriodType}">
        <tag:timePeriodOptions sst="true" s="true" min="true" h="true"/>
      </sst:select>
    </td>
  </tr>
<%@ include file="/WEB-INF/jsp/dataSourceEdit/dsEventsFoot.jspf" %>

<tag:pointList pointHelpId="httpImagePP">
  <tr>
    <td class="formLabelRequired"><fmt:message key="dsEdit.httpImage.url"/></td>
    <td class="formField">
      <input id="url" type="text" class="formLong"/>
      <tag:img png="bullet_go" onclick="window.open($get('url'), 'httpImageTarget')" title="dsEdit.httpImage.openUrl"/>
    </td>
  </tr>
  
  <tr>
    <td class="formLabelRequired"><fmt:message key="dsEdit.httpImage.timeout"/></td>
    <td class="formField"><input id="timeoutSeconds" type="text"/></td>
  </tr>
  
  <tr>
    <td class="formLabelRequired"><fmt:message key="dsEdit.httpImage.retries"/></td>
    <td class="formField"><input id="retries" type="text"/></td>
  </tr>

  <tr>
    <td class="formLabelRequired"><fmt:message key="dsEdit.httpImage.scalingType"/></td>
    <td class="formField">
      <select id="scaleType" onchange="scaleTypeChanged()">
        <option value="<c:out value="<%= HttpImagePointLocatorVO.SCALE_TYPE_NONE %>"/>"><fmt:message key="dsEdit.httpImage.scalingType.none"/></option>
        <option value="<c:out value="<%= HttpImagePointLocatorVO.SCALE_TYPE_PERCENT %>"/>"><fmt:message key="dsEdit.httpImage.scalingType.percent"/></option>
        <option value="<c:out value="<%= HttpImagePointLocatorVO.SCALE_TYPE_BOX %>"/>"><fmt:message key="dsEdit.httpImage.scalingType.box"/></option>
      </select>
    </td>
  </tr>
  
  <tbody id="scalePercentRow">
    <tr>
      <td class="formLabelRequired"><fmt:message key="dsEdit.httpImage.scalePercent"/></td>
      <td class="formField"><input id="scalePercent" type="text"/></td>
    </tr>
  </tbody>
  
  <tbody id="scaleWidthRow">
    <tr>
      <td class="formLabelRequired"><fmt:message key="dsEdit.httpImage.scaleWidth"/></td>
      <td class="formField"><input id="scaleWidth" type="text"/></td>
    </tr>
  </tbody>
  
  <tbody id="scaleHeightRow">
    <tr>
      <td class="formLabelRequired"><fmt:message key="dsEdit.httpImage.scaleHeight"/></td>
      <td class="formField"><input id="scaleHeight" type="text"/></td>
    </tr>
  </tbody>
  
  <tr>
    <td class="formLabelRequired"><fmt:message key="dsEdit.httpImage.readLimit"/></td>
    <td class="formField"><input id="readLimit" type="text"/></td>
  </tr>

  
 <!--  copied from reports.jsp -->  
 <tr>
    <td class="formLabelRequired"><fmt:message key="common.points"/></td>
    <td class="formField">
      <select id="allPointsList"></select>
      <tag:img png="add" onclick="addPointToReport();" title="common.add"/>
      
      <table cellspacing="1">
        <tbody id="reportPointsTableEmpty" style="display:none;">
          <tr><th colspan="4"><fmt:message key="reports.noPoints"/></th></tr>
        </tbody>
        <tbody id="reportPointsTableHeaders" style="display:none;">
          <tr class="smRowHeader">
            <td><fmt:message key="reports.pointName"/></td>
            <td><fmt:message key="reports.dataType"/></td>
            <td></td>
          </tr>
        </tbody>
        <tbody id="reportPointsTable"></tbody>
      </table>
      <span id="pointsError" class="formError"></span>
    </td>
  </tr>  
  
  <tr>
    <td class="formLabelRequired"><fmt:message key="dsEdit.httpImage.liveFeed"/></td>
    <td class="formField"><textarea id="webcamLiveFeedCode" rows="10" cols="37"></textarea></td>
  </tr>
</tag:pointList>