package com.serotonin.mango.rt.event.handlers;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jfree.util.Log;

import com.serotonin.ShouldNeverHappenException;
import com.serotonin.timer.OneTimeTrigger;
import com.serotonin.timer.TimerTask;
import com.serotonin.timer.TimerTrigger;

import com.serotonin.mango.Common;
import com.serotonin.mango.rt.event.EventInstance;
import com.serotonin.mango.rt.maint.work.ReportWorkItem;
import com.serotonin.mango.rt.maint.work.SMSWorkItem;
import com.serotonin.mango.vo.SmsVO;
import com.serotonin.mango.vo.report.ReportJob;
import com.serotonin.mango.vo.report.ReportVO;

/*
 * modeled on ReportJob.java. Schedules SMS alarms, aggregates multiple events into a single SMS message,
 * only includes active and unacknowledged events in SMS.
 */
public class SmsJob extends TimerTask {

	private static final Map<String, SmsJob> JOB_REGISTRY = new HashMap<String, SmsJob>();
	private static final Map<String, String>  SMS_REGISTRY = new HashMap<String, String>();
	
	public static void scheduleSmsJob(String phoneNumber, String tplFile, EventInstance evt) {
	   	// all sms messages sent with fixed time delay for now.
	   	// feature req: send most critical SMS immediately 
	   	OneTimeTrigger trigger = new OneTimeTrigger(60 * 1000);
	   	SmsVO sms = new SmsVO(phoneNumber, tplFile);
		SmsJob smsJob = new SmsJob(trigger, sms);
	   
		synchronized (JOB_REGISTRY) {
	    	if (JOB_REGISTRY.containsKey(sms.getId())) {	
	    		// job already existed. retrieve old job, smsVO and trigger.
	   		 	SmsJob oldSmsJob = JOB_REGISTRY.get(sms.getId());
	   		 	sms = oldSmsJob.sms;
	   		 	trigger = (OneTimeTrigger)smsJob.trigger;
	   		 	// unschedule the old job.
	   		 	unscheduleSmsJob(sms);
	    	}				   
			   
			   // add event to sms message: problem, evt are acknowledged but when job is processed acknowledge status not reflected in evt object.
			   sms.addEvent(evt);
			   // create new sms job with old trigger (continue count down) and smsVO with old events and new events
			   smsJob = new SmsJob(trigger, sms);
			   
		        try {
		        	// (re-)schedule the event
		            JOB_REGISTRY.put(sms.getId(), smsJob);
		            Common.timer.schedule(smsJob);  
		    	} catch (Exception e) {
		    		Log.error("Error scheduling job: ", e);
		    	}
			}
	   }
	    
	   private SmsVO sms;
	   private TimerTrigger trigger;
	   
	    private SmsJob(TimerTrigger trigger, SmsVO sms) {
	        super(trigger);
	        this.sms = sms;
	        this.trigger = trigger;
	    }

	    public static void unscheduleSmsJob(SmsVO sms) {
	        synchronized (JOB_REGISTRY) {
	            SmsJob smsJob = JOB_REGISTRY.remove(sms.getId());
	            if (smsJob != null)
	                smsJob.cancel();
	        }
	    }	    
	    
	    @Override
	    public void run(long runtime) {	
	    	synchronized (JOB_REGISTRY) {
	    		JOB_REGISTRY.remove(sms.getId());
	    	}
			ArrayList<EventInstance> aggregatedEvents = sms.getEvents();
			ArrayList<EventInstance> activeEvents = new ArrayList<EventInstance>();
			
			// if event has been acknowledged or become inactive then don't include it 
			// in the list of events in the SMS message
			for (EventInstance evt: aggregatedEvents) {
				if (! evt.isAcknowledged() && evt.isActive()) 
					activeEvents.add(evt);
			}
			
			// Are there any events that were still active and unacknowledged?
			if (!activeEvents.isEmpty()) {
				sms.setEvents(activeEvents);
				SMSWorkItem.queueSMS(sms);
			}	    	
	    }
}
	

