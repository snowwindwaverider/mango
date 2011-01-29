package com.serotonin.mango.rt.maint;

import java.util.concurrent.ThreadPoolExecutor;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.serotonin.mango.Common;
import com.serotonin.timer.FixedRateTrigger;
import com.serotonin.timer.TimerTask;

public class WorkItemMonitor extends TimerTask {
    private static final Log log = LogFactory.getLog(WorkItemMonitor.class);
    private static final long TIMEOUT = 1000 * 10; // Run every ten seconds.

    /**
     * This method will set up the memory checking job. It assumes that the corresponding system setting for running
     * this job is true.
     */
    public static void start() {
        Common.timer.schedule(new WorkItemMonitor());
    }

    private WorkItemMonitor() {
        super(new FixedRateTrigger(TIMEOUT, TIMEOUT));
    }

    @Override
    public void run(long fireTime) {
        check();
    }

    public static void check() {
        BackgroundProcessing bp = Common.ctx.getBackgroundProcessing();

        int med = bp.getMediumPriorityServiceQueueSize();
        if (med > 0)
            log.info("Medium priority service queue has " + med + " queued tasks");

        int scheduled = Common.timer.size();
        if (scheduled > 0)
            log.debug("Scheduled timer tasks: " + scheduled);

        int high = ((ThreadPoolExecutor) Common.timer.getExecutorService()).getActiveCount();
        if (high > 3)
            log.warn("High priority active count: " + high);
    }
}
