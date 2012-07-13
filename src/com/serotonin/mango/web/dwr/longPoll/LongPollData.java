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
package com.serotonin.mango.web.dwr.longPoll;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Set;

import javax.servlet.http.HttpSessionBindingEvent;
import javax.servlet.http.HttpSessionBindingListener;

import com.serotonin.mango.web.dwr.MiscDwr;

/**
 * @author Matthew Lohbihler
 */
public class LongPollData implements HttpSessionBindingListener, Serializable {
    private static final long serialVersionUID = 1L;

    private final int pollSessionId;
    private long timestamp;
    private HashMap<Integer,LongPollRequest> requests = new HashMap<Integer,LongPollRequest>();
    private HashMap<Integer,LongPollState> states = new HashMap<Integer,LongPollState>();

    public LongPollData(int pollSessionId) {
        this.pollSessionId = pollSessionId;
        updateTimestamp();
        setRequest(null);
    }

    public int getPollSessionId() {
        return pollSessionId;
    }

    public LongPollRequest getRequest() {
        return (LongPollRequest)requests.get(pollSessionId);
    }

    public void updateTimestamp() {
        timestamp = System.currentTimeMillis();
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setRequest(LongPollRequest request) {
        if (request == null) {
            request = new LongPollRequest();
            request.setTerminated(true);
        }
        requests.put(pollSessionId, request);
    }

    public LongPollState getState() {
        return states.get(pollSessionId);
    }

    public void setState(LongPollState state) {
        states.put(pollSessionId, state);
    }
    
    public Set<Integer> getRequestsKeySet() {
    	return requests.keySet();
    }
    

    //
    // /
    // / HttpSessionBindingListener implementation
    // /
    //
    public void valueBound(HttpSessionBindingEvent evt) {
        // no op
    }

    public void valueUnbound(HttpSessionBindingEvent evt) {
        // Terminate any long poll request.
        MiscDwr.terminateLongPollImpl(this);
    }
}
