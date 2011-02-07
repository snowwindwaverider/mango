package com.serotonin.mango.rt.maint.work;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;
import org.jfree.util.Log;
import com.serotonin.mango.Common;
import com.serotonin.mango.db.dao.SystemSettingsDao;
import com.serotonin.mango.rt.event.EventInstance;
import com.serotonin.mango.rt.event.type.SystemEventType;
import com.serotonin.mango.util.freemarker.MessageFormatDirective;
import com.serotonin.mango.vo.SmsVO;
import com.serotonin.web.email.EmailContent;
import com.serotonin.web.i18n.LocalizableMessage;

import freemarker.template.Template;
import freemarker.template.TemplateException;

import au.com.m4u.smsapi.SmsMessage;
import au.com.m4u.smsapi.SmsInterface;
import au.com.m4u.smsapi.ValidityPeriod;

public class SMSWorkItem implements WorkItem {



	private Runnable[] postSendExecution;	
	
	public int getPriority() {
	   return WorkItem.PRIORITY_HIGH;
	}


	public static void queueSMS(String phoneNumber, String content)
	{
		SmsVO smsVO = new SmsVO(phoneNumber);
		smsVO.setMessage(content);
		queueSMS(smsVO);
	}
	
	public static void queueSMS(SmsVO smsVO) {
		SMSWorkItem item = new SMSWorkItem();
		item.smsVO = smsVO;
		Common.ctx.getBackgroundProcessing().addWorkItem(item);
	}

	private SmsVO smsVO;
	private String messageContent;	

	public void execute() {

		SystemSettingsDao systemSettingsDao = new SystemSettingsDao();

		// don't schedule to send any SMS if Alarms are suppressed. Could have become suppressed since initially scheduled
	  	if (systemSettingsDao.getBooleanValue(SystemSettingsDao.EMAIL_EVENT_HANDLERS_DISABLED))
			return;    	
	    
	    String mangoInstanceName = systemSettingsDao.getValue(SystemSettingsDao.INSTANCE_NAME);		
	    String username = systemSettingsDao.getValue(SystemSettingsDao.SMS_USERNAME);
	    String password = systemSettingsDao.getValue(SystemSettingsDao.SMS_PASSWORD);
	   
	    ResourceBundle bundle = Common.getBundle();        
	    if (! ( smsVO.getMessage().length()>0)) {
		    try {
		       Template tpl = Common.ctx.getFreemarkerConfig().getTemplate(smsVO.getTemplateFile());
		       Map<String, Object> model = new HashMap<String, Object>();
		       model.put("instance", mangoInstanceName);

		       model.put("events", smsVO.getEvents());
		       model.put("fmt", new MessageFormatDirective(bundle));
		       EmailContent content = new EmailContent(tpl, model);
		       messageContent = content.getHtmlContent();            
		      
		    } catch (IOException e) {
			   Log.error("IOException sending SMS", e);
			   return;
		    } catch (TemplateException e) {
			   Log.error("Template exception sending SMS", e);
			   return;
		    }	   
	    } else {
	    	// a string was passed (from user page?) instead of a list of events. make this the content.
	    	messageContent = smsVO.getMessage();
	    }
	    
	    // remove line breaks ASCII 0A which are causing messages to be truncated. 
	    // and replace with literal \n 56 CE
	    String escapedMessage = messageContent.replaceAll("\r\n", "\n");
	    escapedMessage = escapedMessage.replaceAll("\n", "\\\\n");
	    
	    
	    SmsInterface smsInterface = new SmsInterface(1);
	    
	   short validityPeriod = ValidityPeriod.DEFAULT;
	   boolean deliveryReport = false;
	   int delay = 0;
	   String resultMessage = "";
	   
	   SmsMessage smsMessage = new SmsMessage(smsVO.getPhoneNumber(), escapedMessage, System.currentTimeMillis(), delay, validityPeriod, deliveryReport);
	   smsInterface.addMessage(smsMessage);

       if (smsInterface.connect(username, password, false)) {
    	   if (smsInterface.sendMessages()) {
    		   resultMessage = "SMS sent to " + smsVO.getPhoneNumber() + ": " + messageContent;
    	   } else {
    		   resultMessage  = "Sending SMS to " + smsVO.getPhoneNumber() + " failed. " + smsInterface.getResponseCode() +":"+ smsInterface.getResponseMessage();
    	   }   
       } else {
    	   resultMessage = "Failed to connect to SMS service. " + smsInterface.getResponseCode() +":"+ smsInterface.getResponseMessage();
       }
       SystemEventType.raiseEvent(new SystemEventType(SystemEventType.TYPE_SMS),
               System.currentTimeMillis(), false, new LocalizableMessage("event.system.sms.send", resultMessage));
	    
       if (postSendExecution != null) {
           for (Runnable runnable : postSendExecution)
               runnable.run();
       }

	}	
	
}
