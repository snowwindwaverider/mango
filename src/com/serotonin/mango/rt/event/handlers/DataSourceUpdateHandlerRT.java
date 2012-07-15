package com.serotonin.mango.rt.event.handlers;


import com.serotonin.mango.Common;
import com.serotonin.mango.rt.dataSource.DataSourceRT;
import com.serotonin.mango.rt.dataSource.PollingDataSource;
import com.serotonin.mango.rt.event.EventInstance;


import com.serotonin.mango.util.timeout.TimeoutTask;
import com.serotonin.mango.vo.event.EventHandlerVO;
import com.serotonin.timer.OneTimeTrigger;

public class DataSourceUpdateHandlerRT extends EventHandlerRT {

	public DataSourceUpdateHandlerRT(EventHandlerVO vo) {
		this.vo = vo;
	}
	
	@Override
	public void eventInactive(EventInstance evt) {
		// no-op

	}
	/**
	 * schedule a poll of the data source to happen immediately, one time
	 */
	@Override
	public void eventRaised(EventInstance evt) {
		// needs to be a polling type.
		DataSourceRT dsrt = Common.ctx.getRuntimeManager().getRunningDataSource(vo.getDataSourceId());
		if (dsrt instanceof PollingDataSource) {
			// polling data source implements interface timeout client. we can make a timeout job with it
			PollingDataSource pds = (PollingDataSource)dsrt;
			
			OneTimeTrigger oneTimeTrigger = new OneTimeTrigger(1000);
			TimeoutTask timeoutTask = new TimeoutTask(oneTimeTrigger, pds);
			
		} 
		else {
			// throw wrong kind of data source exception?
		}

	}

}