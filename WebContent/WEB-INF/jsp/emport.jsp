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

<tag:page dwr="EmportDwr" onload="init">
  <script type="text/javascript">
    function init() {
        setDisabled("cancelBtn", true);
        importUpdate();
    }
    
    function doExport() {
        setDisabled("exportBtn", true);
        EmportDwr.createExportData($get("prettyIndent"), $get("graphicalViews"), $get("eventHandlers"),
                $get("dataSources"), $get("dataPoints"), $get("scheduledEvents"), $get("compoundEventDetectors"),
                $get("pointLinks"), $get("users"), $get("pointHierarchy"), $get("mailingLists"), $get("publishers"),
                $get("watchLists"), $get("maintenanceEvents"), function(data) {
            $set("emportData", data);
            setDisabled("exportBtn", false);
        });
    }
    
    function doImport() {
        setDisabled("importBtn", true);
        hideGenericMessages("importMessages");
        $set("alternateMessage", "<fmt:message key="emport.importProgress"/>");
        EmportDwr.importData($get("emportData"), function(response) {
            if (response.data.importStarted)
                importUpdate();
            else if (response.hasMessages) {
                showDwrMessages(response.messages, $("importMessages"));
                $set("alternateMessage");
                setDisabled("importBtn", false);
            }
            else {
                $set("alternateMessage", "<fmt:message key="emport.noMessages"/>");
                setDisabled("importBtn", false);
            }
        });
    }
    
    function importUpdate() {
        EmportDwr.importUpdate(function(response) {
            if (response.data.noImport)
                // no op
                return;
            
            $set("alternateMessage", "<fmt:message key="emport.importProgress"/>");
            setDisabled("importBtn", true);
            setDisabled("cancelBtn", false);
            
            showDwrMessages(response.messages, $("importMessages"));
            
            if (response.data.cancelled || response.data.complete) {
                setDisabled("importBtn", false);
                setDisabled("cancelBtn", true);
                
                if (response.data.cancelled)
                    $set("alternateMessage", "<fmt:message key="emport.importCancelled"/>");
                else
                    $set("alternateMessage", "<fmt:message key="emport.importComplete"/>");
            }
            else
                setTimeout(importUpdate, 1000);
        });
    }
    
    function importCancel() {
        EmportDwr.importCancel();
    }
    
    function selectAll(checked) {
        $set("graphicalViews", checked);
        $set("eventHandlers", checked);
        $set("dataSources", checked);
        $set("dataPoints", checked);
        $set("scheduledEvents", checked);
        $set("compoundEventDetectors", checked);
        $set("pointLinks", checked);
        $set("users", checked);
        $set("pointHierarchy", checked);
        $set("mailingLists", checked);
        $set("publishers", checked);
        $set("watchLists", checked);
        $set("maintenanceEvents", checked);
    }
  </script>
  
  <div class="borderDiv marR marB" style="float:left;">
    <table width="100%">
      <tr>
        <td colspan="2">
          <span class="smallTitle"><fmt:message key="emport.export"/></span>
          <tag:help id="emport"/>
        </td>
      </tr>
      <tr>
        <td class="formLabel">
          <b><fmt:message key="emport.select"/></b><br/>
          <a href="#" onclick="selectAll(true); return false"><fmt:message key="emport.selectAll"/></a> |
          <a href="#" onclick="selectAll(false); return false"><fmt:message key="emport.unselectAll"/></a>
        </td>
        <td></td>
      </tr>
      <tr>
        <td class="formField" style="padding-left:50px;">
          <input type="checkbox" id="watchLists"/> <label for="watchLists"><fmt:message key="header.watchLists"/></label><br/>
          <input type="checkbox" id="graphicalViews"/> <label for="graphicalViews"><fmt:message key="header.views"/></label><br/>
          <input type="checkbox" id="eventHandlers"/> <label for="eventHandlers"><fmt:message key="header.eventHandlers"/></label><br/>
          <input type="checkbox" id="dataSources"/> <label for="dataSources"><fmt:message key="header.dataSources"/></label><br/>
          <input type="checkbox" id="dataPoints"/> <label for="dataPoints"><fmt:message key="emport.dataPoints"/></label><br/>
          <input type="checkbox" id="scheduledEvents"/> <label for="scheduledEvents"><fmt:message key="header.scheduledEvents"/></label><br/>
          <input type="checkbox" id="compoundEventDetectors"/> <label for="compoundEventDetectors"><fmt:message key="header.compoundEvents"/></label><br/>
        </td>
        <td>
          <input type="checkbox" id="pointLinks"/> <label for="pointLinks"><fmt:message key="header.pointLinks"/></label><br/>
          <input type="checkbox" id="users"/> <label for="users"><fmt:message key="header.users"/></label><br/>
          <input type="checkbox" id="pointHierarchy"/> <label for="pointHierarchy"><fmt:message key="header.pointHierarchy"/></label><br/>
          <input type="checkbox" id="mailingLists"/> <label for="mailingLists"><fmt:message key="header.mailingLists"/></label><br/>
          <input type="checkbox" id="publishers"/> <label for="publishers"><fmt:message key="header.publishers"/></label><br/>
          <input type="checkbox" id="maintenanceEvents"/> <label for="maintenanceEvents"><fmt:message key="header.maintenanceEvents"/></label><br/>
        </td>
<!--          <input type="checkbox" id="reports"/> <label for="reports"><fmt:message key="header.reports"/></label><br/>-->
<!--          <input type="checkbox" id="systemSettings"/> <label for="systemSettings"><fmt:message key="header.systemSettings"/></label><br/>-->
<!--          <input type="checkbox" id="imageSets"/> <label for="imageSets"><fmt:message key="header.imageSets"/></label><br/>-->
<!--          <input type="checkbox" id="dynamicImages"/> <label for="dynamicImages"><fmt:message key="header.dynamicImages"/></label><br/>-->
      </tr>
      <tr>
        <td class="formLabelRequired"><fmt:message key="emport.indent"/></td>
        <td><input type="text" id="prettyIndent" value="3" class="formVeryShort"/></td>
      </tr>
      <tr>
        <td colspan="2" align="center">
          <input id="exportBtn" type="button" value="<fmt:message key="emport.export"/>" onclick="doExport()"/>
        </td>
      </tr>
    </table>
  </div>

  <div class="borderDiv marB" style="float:left;">
    <table width="100%">
      <tr><td><span class="smallTitle"><fmt:message key="emport.import"/></span></td></tr>
      <tr>
        <td>
          <fmt:message key="emport.importInstruction"/>
          <input id="importBtn" type="button" value="<fmt:message key="emport.import"/>" onclick="doImport()"/>
          <input id="cancelBtn" type="button" value="<fmt:message key="common.cancel"/>" onclick="importCancel()" disabled="disabled"/>
        </td>
      </tr>
      <tbody id="importMessages"></tbody>
      <tr><td id="alternateMessage"></td></tr>
    </table>
  </div>
  
  <div style="clear:both;">
    <span class="formLabelRequired"><fmt:message key="emport.data"/></span><br/>
    <textarea rows="40" cols="150" id="emportData"></textarea>
  </div>
</tag:page>