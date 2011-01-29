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
<div id="staticEditorPopup" style="display:none;left:0px;top:0px;" class="windowDiv">
  <table cellpadding="0" cellspacing="0"><tr><td>
    <table width="100%">
      <tr>
        <td>
          <tag:img png="html" title="viewEdit.static.editor" style="display:inline;"/>
        </td>
        <td align="right">
          <tag:img png="save" onclick="staticEditor.save()" title="common.save" style="display:inline;"/>&nbsp;
          <tag:img png="cross" onclick="staticEditor.close()" title="common.close" style="display:inline;"/>
        </td>
      </tr>
    </table>
    <table>
      <tr>
        <td class="formField"><textarea id="staticPointContent" rows="10" cols="50"></textarea></td>
      </tr>
    </table>
  </td></tr></table>
  
  <script type="text/javascript">
    function StaticEditor() {
        this.componentId = null;
        
        this.open = function(compId) {
            staticEditor.componentId = compId;
            
            ViewDwr.getViewComponent(compId, function(comp) {
                // Update the data in the form.
                $set("staticPointContent", comp.content);
                show("staticEditorPopup");
            });
            
            positionEditor(compId, "staticEditorPopup");
        };
        
        this.close = function() {
            hide("staticEditorPopup");
        };
        
        this.save = function() {
            ViewDwr.saveHtmlComponent(staticEditor.componentId, $get("staticPointContent"), function() {
                staticEditor.close();
                updateHtmlComponentContent("c"+ staticEditor.componentId, $get("staticPointContent"));
            });
        };
    }
    var staticEditor = new StaticEditor();
  </script>
</div>