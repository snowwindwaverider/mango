<%@ include file="/WEB-INF/jsp/include/tech.jsp" %>
<%@page import="com.serotonin.modbus4j.code.RegisterRange"%>
<%@page import="com.serotonin.modbus4j.code.DataType"%>

<script type="text/javascript">
  function initImpl() {
	  hide("console");
	  hide("editImg-1");
	  if (!newDataSource())
		 searchServer();
  }

  function appendPointListColumnFunctions(pointListColumnHeaders, pointListColumnFunctions) {
  } 

  function deleteOPCPoint(pointId) {
      alert(pointId);
  }
  
  var cellFuncs = [
          function(data) { return data.tag; },
          function(data) {
              if (data.dataType == ${applicationScope['constants.DataTypes.BINARY']})
                  return "<fmt:message key="common.dataTypes.binary"/>";
              if (data.dataType == ${applicationScope['constants.DataTypes.MULTISTATE']})
                  return "<fmt:message key="common.dataTypes.multistate"/>";
              if (data.dataType == ${applicationScope['constants.DataTypes.NUMERIC']})
                  return "<fmt:message key="common.dataTypes.numeric"/>";
              if (data.dataType == ${applicationScope['constants.DataTypes.ALPHANUMERIC']})
                  return "<fmt:message key="common.dataTypes.alphanumeric"/>";
              return "<fmt:message key="common.unknown"/> ("+ data.dataType +")";
          },
          function(data) { return data.settable; },
          function(data) { return "<input type='checkbox' name='addTag'/>"; }
  ];
  
  function editPointCBImpl(locator) {
	  hide('pointSaveImg');
  }

  function searchServer() {
      DataSourceEditDwr.searchOpcServer($get("host"), $get("domain"), $get("user"), $get("password"), function(response) {
    	  if (response.hasMessages)
              $set("console", response.messages[0]);
    	  else {
              $set("console");
              
              dwr.util.removeAllOptions("server");
              dwr.util.addOptions("server", response.data.servers);
              
              if (!newDataSource()) {
                  var server = '${dataSource.server}';
                  serverList = $('server');
                  for (index = 0; index < serverList.length; index++) {
                      if (serverList[index].value == server)
                          serverList.selectedIndex = index;
                  }
              }
    	  }
      });
  }

  function newDataSource() {
	  if (${dataSource.id}!= -1) {
		  return false; 
	  } 
	  return true;
  }

  function saveDataSourceImpl() {
	  DataSourceEditDwr.saveOPCDataSource($get("dataSourceName"), $get("dataSourceXid"), $get("host"), $get("domain"), 
			  $get("user"), $get("password"), $get("server"), $get("updatePeriods"), $get("updatePeriodType"), 
			  saveDataSourceCB);
  }

  function savePointImpl(locator) {
	  // TODO Prevent warnings here?
  }
  
  function browseTags() {
      dwr.util.removeAllRows('tagsTable');
	  if ($get("server") != '') {
		  DataSourceEditDwr.listOPCTags($get("host"), $get("domain"), $get("user"), $get("password"), $get("server"),
				  function(tagList) {
			          dwr.util.addRows('tagsTable', tagList, cellFuncs, { escapeHtml:false });
			      }
		  );
      }
  }
  
  function addTags() {
	  DataSourceEditDwr.getPoint(-1, addTagsImpl);
  }
  
  function addTagsImpl(point) {
	  list = document.getElementById('tagsTable');
	  var locator = point.pointLocator;
      
      // Prevents DWR warnings
      delete locator.configurationDescription;
      delete locator.dataTypeMessage;
      delete locator.relinquish;
      
	  var tags = new Array();
	  var dataTypes = new Array();
	  var settables = new Array();
	  var locators = new Array();
	  for (var i = 0; i < list.rows.length; i++) {
		  if (list.rows[i].cells[3].firstChild.checked) { 
			  tags.push(list.rows[i].cells[0].innerHTML);
			  
			  // TODO Not good. What is put into innerHTML is not always what comes out.
			  if (list.rows[i].cells[1].innerHTML == "<fmt:message key="common.dataTypes.binary"/>") {
	           	  dataTypes.push(1);
    		  } else if (list.rows[i].cells[1].innerHTML == "<fmt:message key="common.dataTypes.multistate"/>") {
    			  dataTypes.push(2);
    		  } else if (list.rows[i].cells[1].innerHTML == "<fmt:message key="common.dataTypes.numeric"/>") {
    			  dataTypes.push(3);
    		  } else if (list.rows[i].cells[1].innerHTML == "<fmt:message key="common.dataTypes.alphanumeric"/>") {
    			  dataTypes.push(4);
    		  } else if (list.rows[i].cells[1].innerHTML == "<fmt:message key="common.unknown"/>") {
    			  dataTypes.push(0);
    		  }
    		  
    		  if (list.rows[i].cells[2].innerHTML == "false") {
    			  settables.push(false);
    		  } else {
    			  settables.push(true);
    		  }
			  locators.push(locator);
		  }
	  }
	  
	  if (locators.length > 0) {
		  DataSourceEditDwr.saveMultipleOPCPointLocator(tags, dataTypes, settables, locators, savePointCB);
	  } 
  }
</script>

<c:set var="dsDesc"><fmt:message key="dsEdit.opc.desc"/></c:set>
<c:set var="dsHelpId" value="opcDS"/>
<%@ include file="/WEB-INF/jsp/dataSourceEdit/dsHead.jspf" %>
	   	<tr>
		  <td class="formLabelRequired"><fmt:message key="dsEdit.opc.host"/></td>
  		  <td class="formField"><input id="host" type="text" value="${dataSource.host}"/></td>
		</tr>
		<tr>
		  <td class="formLabelRequired"><fmt:message key="dsEdit.opc.domain"/></td>
		  <td class="formField"><input id="domain" type="text" value="${dataSource.domain}"/></td>
		</tr>
		<tr>
		  <td class="formLabelRequired"><fmt:message key="dsEdit.opc.user"/></td>
		  <td class="formField"><input id="user" type="text" value="${dataSource.user}"/></td>
		</tr>
		<tr>
          <td class="formLabelRequired"><fmt:message key="dsEdit.opc.password"/></td>
          <td class="formField"><input id="password" type="password" name="password" value="${dataSource.password}" maxlength="20"/></td>
        </tr>
        <tr>
        <tr>
		  <td class="formLabelRequired"><fmt:message key="dsEdit.opc.server"/></td>
		  <td class="formField">
            <sst:select id="server" value=""></sst:select>
            <div style="height: 2px;"></div>
            <input id="searchBtn" type="button" value="<fmt:message key="dsEdit.opc.refreshServers"/>" onclick="searchServer();"/>
          </td>
		</tr>
        <tr>
          <td class="formLabelRequired"><fmt:message key="dsEdit.updatePeriod"/></td>
          <td class="formField">
            <input type="text" id="updatePeriods" value="${dataSource.updatePeriods}" class="formShort"/>
            <sst:select id="updatePeriodType" value="${dataSource.updatePeriodType}">
              <tag:timePeriodOptions sst="true" ms="true" s="true" min="true" h="true"/>
            </sst:select>
          </td>
        </tr>
      </table>
    </div>
  </td>
  
  <td valign="top">
    <div class="borderDiv marB">
      <table>
        <tr><td colspan="2" class="smallTitle"><fmt:message key="dsEdit.opc.tagList"/></td></tr>
        
        <tr>
          <td colspan="2" align="center">
            <input id="browseTags" type="button" value="<fmt:message key="dsEdit.opc.browseTags"/>" onclick="browseTags();"/>
          	<input id="addBtn" type="button" value="<fmt:message key="dsEdit.opc.addTags"/>" onclick="addTags();"/>
          </td>
        </tr>
        
        <tr><td colspan="2" id="tagsMessage" class="formError"></td></tr>
        <tr>
          <td>
            <table cellspacing="1" cellpadding="0" border="0" >
              <thead class="rowHeader">
                <td><fmt:message key="dsedit.opc.tagName"/></td>
                <td><fmt:message key="dsEdit.pointDataType"/></td>
                <td><fmt:message key="dsEdit.settable"/></td>
                <td><fmt:message key="common.add"/></td>
              </thead>
              
              <!-- TODO why is the height being enforced? -->
              <tbody id="tagsTable" style="height: 160px; overflow: auto;"></tbody>
            </table>
          </td>
        </tr>
        
        <tr><td><div id="console"></div></td></tr>
        
<%@ include file="/WEB-INF/jsp/dataSourceEdit/dsFoot.jspf" %>

<tag:pointList pointHelpId="opcPP"></tag:pointList>