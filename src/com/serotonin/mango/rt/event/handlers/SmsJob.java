package com.serotonin.mango.rt.event.handlers;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jfree.util.Log;

import com.serotonin.ShouldNeverHappenException;
import com.serotonin.timer.FixedDelayTrigger;
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
	
	   public static void scheduleSmsJob(String phoneNumber, String tplFile, EventInstance evt) {
		   // all sms messages sent with fixed time delay for now.
		   // feature req: send most critical SMS immediately 
		   FixedDelayTrigger trigger = new FixedDelayTrigger(new Date(),120 * 1000);
		   
	        synchronized (JOB_REGISTRY) {
	        	// if there is an existing job then add this alarm to the job.
	        	SmsVO sms = new SmsVO(phoneNumber, tplFile);
	        	SmsJob smsJob = new SmsJob(trigger, sms);
        	
	        	if (JOB_REGISTRY.containsKey(sms.getId())) {	
	        		// job already existed. retrieve old job, smsVO and trigger.
	       		 	smsJob = JOB_REGISTRY.get(sms.getId());
	       		 	sms = smsJob.sms;
	       		 	trigger = (FixedDelayTrigger)smsJob.trigger;
	        	}
	        	
	        	// add the event to the SMS object
	        	sms.addEvent(evt);
	        	
	        	// re-schedule the event
                JOB_REGISTRY.put(sms.getId(), smsJob);
                Common.timer.schedule(smsJob);
	        }
	    }
	    
	   
	   private SmsVO sms;
	   private TimerTrigger trigger;
	   
	    private SmsJob(TimerTrigger trigger, SmsVO sms) {
	        super(trigger);
	        this.sms = sms;
	        this.trigger = trigger;
	    }
	   
	    @Override
	    public void run(long runtime) {	
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
	

		public static boolean exists(String phoneNumber, String tplFile) {
			SmsVO exists_sms = new SmsVO(phoneNumber, tplFile);
			synchronized (JOB_REGISTRY) {
				if (JOB_REGISTRY.containsKey(exists_sms.getId())) {
					return true;
				}
			}
			return false;
		}
	    
}
	/*
	private final static String SMS_GROUP = "SMS";
	private final static String SMS_VO_KEY = "SMS_VO_KEY";


	
	@SuppressWarnings("unchecked")
	public static boolean addEvent(String phoneNumber, String tplFile, EventInstance evt) {
		String jobName = getJobName(phoneNumber, tplFile);
		Scheduler scheduler = Common.ctx.getScheduler();
		
		try {
   		 	JobDetail jobDetail = scheduler.getJobDetail(jobName, SMS_GROUP);
   		 	
   		 	if (jobDetail == null)
   		 		return false;
   		 	
   		 	Trigger trigger = scheduler.getTrigger(jobName, SMS_GROUP);
        	scheduler.deleteJob(jobName, SMS_GROUP);
   		 	
   		 	SmsVO smsVO = getSmsVO(jobDetail);
   		 	smsVO.addEvent(evt);
   		 	setSmsVO(jobDetail, smsVO);

   		 	return scheduleJob(jobDetail, trigger);
   		 	
		} catch (SchedulerException e) {
			return false;
		}
		
	}
	
	public static boolean create(String phoneNumber, String tplFile, EventInstance evt) {
		String jobName = getJobName(phoneNumber, tplFile);
		JobDetail jobDetail = new JobDetail(jobName,SMS_GROUP,SmsJob.class);
		
		SmsVO smsVO = new SmsVO(phoneNumber, tplFile);
		smsVO.addEvent(evt);
		setSmsVO(jobDetail, smsVO);

		Date timeout = new Date(System.currentTimeMillis() + 120 * 1000);
		Trigger trigger = new SimpleTrigger(jobName, SMS_GROUP, timeout);
		
		return scheduleJob(jobDetail, trigger);
	}
	
	public static void setSmsVO(JobDetail jobDetail, SmsVO smsVO) {
		jobDetail.getJobDataMap().put(SMS_VO_KEY, smsVO);
	}

	public static SmsVO getSmsVO(JobDetail jobDetail) {
		return (SmsVO)jobDetail.getJobDataMap().get(SMS_VO_KEY);
	}


	
	private static boolean scheduleJob(JobDetail jobDetail, Trigger trigger) {
		Scheduler sched = Common.ctx.getScheduler();
		try {
			sched.scheduleJob(jobDetail, trigger);
			return true;
		} catch (SchedulerException e) {
			Log.error("Error Scheduling SMS job: " + e.getMessage());
			return false;
		}
	}
	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
			SmsVO smsVO = getSmsVO(context.getJobDetail());
			
			ArrayList<EventInstance> aggregatedEvents = smsVO.getEvents();
			ArrayList<EventInstance> activeEvents = new ArrayList<EventInstance>();
			
			// if event has been acknowledged or become inactive then don't include it 
			// in the list of events in the SMS message
			for (EventInstance evt: aggregatedEvents) {
				if (! evt.isAcknowledged() && evt.isActive()) 
					activeEvents.add(evt);
			}
			
			// Are there any events that were still active and unacknowledged?
			if (!activeEvents.isEmpty()) {
				smsVO.setEvents(activeEvents);
				SMSWorkItem.queueSMS(smsVO);
			}
	}
*/

