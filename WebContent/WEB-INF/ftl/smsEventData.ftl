<#list events as evt>
	<@fmt message=evt.message/>
	<#if evt.eventComments??>
	  <#list evt.eventComments as comment>
	     <@fmt key="notes.by"/> ${comment.username}: ${comment.comment}
	  </#list>
	</#if>
	
</#list>