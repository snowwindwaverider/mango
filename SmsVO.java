package com.serotonin.mango.vo;

import java.util.ArrayList;


import com.serotonin.mango.rt.event.EventInstance;



public class SmsVO {

	private String phoneNumber;
	private ArrayList<EventInstance> events = new ArrayList<EventInstance>();
	private String message = "";
	private String tplFile;
	
	public SmsVO(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}
	
	public SmsVO(String phoneNumber, String templateFile) {
		this.phoneNumber = phoneNumber;
		this.tplFile = templateFile;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}
	public ArrayList<EventInstance> getEvents() {
		return events;
	}

	public void setEvents(ArrayList<EventInstance> events) {
		this.events = events;
	}

	public void addEvent(EventInstance evt) {
		events.add(evt);
	}
	
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	public String getTemplateFile() {
		return tplFile;
	}
	
	public void setTemplateFile(String tplFile) {
		this.tplFile = tplFile;
	}
}
