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
package com.serotonin.mango.rt.event.detectors;

import com.serotonin.mango.Common;
import com.serotonin.mango.rt.dataImage.PointValueTime;

/**
 * This is a base class for all subclasses that need to schedule timeouts for them to become active.
 * 
 * @author Matthew Lohbihler
 */
abstract public class TimeDelayedEventDetectorRT extends TimeoutDetectorRT {
    @Override
    synchronized protected void scheduleJob(long fromTime) {
        if (getDurationMS() > 0)
            super.scheduleJob(fromTime + getDurationMS());
        else
            // Otherwise call the event active immediately.
            setEventActive(true);
    }

    @Override
    synchronized protected void unscheduleJob() {
        // Check whether there is a tolerance duration.
        if (getDurationMS() > 0)
            super.unscheduleJob();

        // Reset the eventActive if it is on
        if (isEventActive())
            setEventActive(false);
    }

    abstract void setEventActive(boolean b);

    @Override
    public void initialize() {
        super.initialize();

        int pointId = vo.njbGetDataPoint().getId();
        PointValueTime latest = Common.ctx.getRuntimeManager().getDataPoint(pointId).getPointValue();

        if (latest != null)
            pointChanged(null, latest);
    }

    //
    //
    // /
    // / TimeoutClient interface
    // /
    //
    //
    public void scheduleTimeout(long fireTime) {
        setEventActive(true);
    }
}
