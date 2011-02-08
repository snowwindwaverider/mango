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
package com.serotonin.mango.rt.event.handlers;

import java.util.HashMap;
import java.util.Map;
import java.util.ResourceBundle;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.joda.time.DateTime;

import com.serotonin.mango.Common;
import com.serotonin.mango.db.dao.MailingListDao;
import com.serotonin.mango.db.dao.SystemSettingsDao;
import com.serotonin.mango.rt.event.EventInstance;
import com.serotonin.mango.rt.event.type.SystemEventType;
import com.serotonin.mango.rt.maint.work.EmailWorkItem;
import com.serotonin.mango.util.freemarker.MangoEmailContent;
import com.serotonin.mango.util.freemarker.MessageFormatDirective;
import com.serotonin.mango.util.freemarker.UsedImagesDirective;
import com.serotonin.mango.util.timeout.ModelTimeoutClient;
import com.serotonin.mango.util.timeout.ModelTimeoutTask;
import com.serotonin.mango.vo.event.EventHandlerVO;
import com.serotonin.timer.TimerTask;
import com.serotonin.util.StringUtils;
import com.serotonin.web.email.EmailContent;
import com.serotonin.web.email.EmailInline;
import com.serotonin.web.i18n.LocalizableMessage;

public class EmailHandlerRT extends EventHandlerRT implements ModelTimeoutClient<EventInstance> {
    private static final Log LOG = LogFactory.getLog(EmailHandlerRT.class);

    private TimerTask escalationTask;

    private Set<String> activeRecipients;

    private enum NotificationType {
        ACTIVE("active", "ftl.subject.active"), //
        ESCALATION("escalation", "ftl.subject.escalation"), //
        INACTIVE("inactive", "ftl.subject.inactive");

        String file;
        String key;

        private NotificationType(String file, String key) {
            this.file = file;
            this.key = key;
        }

        public String getFile() {
            return file;
        }

        public String getKey() {
            return key;
        }
    }

    /**
     * The list of all of the recipients - active and escalation - for sending upon inactive if configured to do so.
     */
    private Set<String> inactiveRecipients;
    private Set<String> inactivePhoneNumbers;
    
    public EmailHandlerRT(EventHandlerVO vo) {
        this.vo = vo;
    }

    public Set<String> getActiveRecipients() {
        return activeRecipients;
    }

    @Override
    public void eventRaised(EventInstance evt) {
        // Get the email addresses to send to
        activeRecipients = new MailingListDao().getRecipientAddresses(vo.getActiveRecipients(),
                new DateTime(evt.getActiveTimestamp()));

        // Send an email to the active recipients.
        sendEmail(evt, NotificationType.ACTIVE, activeRecipients);

        Set<String> phoneNumbers = new MailingListDao().getRecipientPhoneNumbers(vo.getActiveRecipients(), 
        		new DateTime(evt.getActiveTimestamp()));
        sendSms("smsActive.ftl", evt, phoneNumbers);
        
        // If an inactive notification is to be sent, save the active recipients.
        if (vo.isSendInactive()) {
            if (vo.isInactiveOverride()) {
                inactiveRecipients = new MailingListDao().getRecipientAddresses(vo.getInactiveRecipients(),
                        new DateTime(evt.getActiveTimestamp()));
            	inactivePhoneNumbers = new MailingListDao().getRecipientPhoneNumbers(vo.getActiveRecipients(), 
            		new DateTime(evt.getActiveTimestamp()));
            } else {
                inactiveRecipients = activeRecipients;
            	inactivePhoneNumbers = phoneNumbers;
            }
        }

        // If an escalation is to be sent, set up timeout to trigger it.
        if (vo.isSendEscalation()) {
            long delayMS = Common.getMillis(vo.getEscalationDelayType(), vo.getEscalationDelay());
            escalationTask = new ModelTimeoutTask<EventInstance>(delayMS, this, evt);
        }
    }

    //
    // TimeoutClient
    //
    synchronized public void scheduleTimeout(EventInstance evt, long fireTime) {
        // Get the email addresses to send to
        Set<String> addresses = new MailingListDao().getRecipientAddresses(vo.getEscalationRecipients(), new DateTime(
                fireTime));

        // Send the escalation.
        sendEmail(evt, NotificationType.ESCALATION, addresses);

        Set<String> phoneNumbers = new MailingListDao().getRecipientPhoneNumbers(vo.getEscalationRecipients(), 
        		new DateTime(fireTime));
        sendSms("SmsEscalation.ftl", evt, phoneNumbers);         
        
        // If an inactive notification is to be sent, save the escalation recipients, but only if inactive recipients
        // have not been overridden.
        if (vo.isSendInactive() && !vo.isInactiveOverride()) {
            inactiveRecipients.addAll(addresses);
            inactivePhoneNumbers.addAll(phoneNumbers);
        }
    }

    @Override
    synchronized public void eventInactive(EventInstance evt) {
        // Cancel the escalation job in case it's there
        if (escalationTask != null)
            escalationTask.cancel();

        if (inactiveRecipients != null && inactiveRecipients.size() > 0) {
            // Send an email to the inactive recipients.
            sendEmail(evt, NotificationType.INACTIVE, inactiveRecipients);
            sendSms("smsInactive.ftl", evt, inactivePhoneNumbers);
        }
        
       
    }

    public static void sendActiveEmail(EventInstance evt, Set<String> addresses) {
        sendEmail(evt, NotificationType.ACTIVE, addresses, null);
    }

    private void sendEmail(EventInstance evt, NotificationType notificationType, Set<String> addresses) {
        sendEmail(evt, notificationType, addresses, vo.getAlias());
    }

    private static void sendEmail(EventInstance evt, NotificationType notificationType, Set<String> addresses,
            String alias) {
        if (evt.getEventType().isSystemMessage()) {
            if (((SystemEventType) evt.getEventType()).getSystemEventTypeId() == SystemEventType.TYPE_EMAIL_SEND_FAILURE) {
                // Don't send email notifications about email send failures.
                LOG.info("Not sending email for event raised due to email failure");
                return;
            }
        }

        ResourceBundle bundle = Common.getBundle();

        // Determine the subject to use.
        LocalizableMessage subjectMsg;
        LocalizableMessage notifTypeMsg = new LocalizableMessage(notificationType.getKey());
        if (StringUtils.isEmpty(alias)) {
            if (evt.getId() == Common.NEW_ID)
                subjectMsg = new LocalizableMessage("ftl.subject.default", notifTypeMsg);
            else
                subjectMsg = new LocalizableMessage("ftl.subject.default.id", notifTypeMsg, evt.getId());
        }
        else {
            if (evt.getId() == Common.NEW_ID)
                subjectMsg = new LocalizableMessage("ftl.subject.alias", alias, notifTypeMsg);
            else
                subjectMsg = new LocalizableMessage("ftl.subject.alias.id", alias, notifTypeMsg, evt.getId());
        }

        String subject = subjectMsg.getLocalizedMessage(bundle);

        try {
            String[] toAddrs = addresses.toArray(new String[0]);
            UsedImagesDirective inlineImages = new UsedImagesDirective();

            // Send the email.
            Map<String, Object> model = new HashMap<String, Object>();
            model.put("evt", evt);
            model.put("fmt", new MessageFormatDirective(bundle));
            model.put("img", inlineImages);
            EmailContent content = new MangoEmailContent(notificationType.getFile(), model, Common.UTF8);

            for (String s : inlineImages.getImageList())
                content.addInline(new EmailInline.FileInline(s, Common.ctx.getServletContext().getRealPath(s)));

            EmailWorkItem.queueEmail(toAddrs, subject, content);
        }
        catch (Exception e) {
            LOG.error("", e);
        }
    }
    
    private void sendSms(String tplFile, EventInstance evt, Set<String> phoneNumbers) {
    	
    	// any sms to send?
    	if (phoneNumbers == null) { return;}
    	
    	SystemSettingsDao systemSettingsDao = new SystemSettingsDao();

    	// don't send SMS for alarms that are not high priority, according to user system preference
    	if (evt.getAlarmLevel() < systemSettingsDao.getIntValue(SystemSettingsDao.SMS_ALARM_LEVEL))
    			return;

    	// don't schedule to send any SMS if Alarms are suppressed
       	if (systemSettingsDao.getBooleanValue(SystemSettingsDao.EMAIL_EVENT_HANDLERS_DISABLED))
    		return;    	

        for (String number : phoneNumbers) {
        	SmsJob.scheduleSmsJob(number, tplFile, evt);
        }
    }     
}
