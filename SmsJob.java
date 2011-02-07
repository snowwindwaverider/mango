package com.serotonin.mango.rt.event.handlers;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.jfree.util.Log;
import org.quartz.Job;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleTrigger;
import org.quartz.Trigger;

import com.serotonin.mango.Common;
import com.serotonin.mango.rt.event.EventInstance;
import com.serotonin.mango.rt.maint.work.SMSWorkItem;
import com.serotonin.mango.vo.SmsVO;

/*
 * modeled on ReportJob.java. Schedules SMS alarms, aggregates multiple events into a single SMS message,
 * only includes active and unacknowledged events in SMS
 */
public class SmsJob implements Job {

	private final static String SMS_GROUP = "SMS";
	private final static String SMS_VO_KEY = "SMS_VO_KEY";

	public static boolean exists(String phoneNumber, String tplFile) {
		String jobName = getJobName(phoneNumber, tplFile);
		
		try {
			JobDetail jobDetail = Common.ctx.getScheduler().getJobDetail(jobName, SMS_GROUP);
			if (jobDetail != null) 
				return true;
		} catch (SchedulerException e) {
			return false;
		}
		return false;
	}
	
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

	private static String getJobName(String phoneNumber, String tplFile) {
		return "SmsJob-" + phoneNumber + "-" + tplFile;
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

}
