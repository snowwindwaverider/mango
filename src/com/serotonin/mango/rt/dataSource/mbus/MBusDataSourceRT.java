/*
 *   Mango - Open Source M2M - http://mango.serotoninsoftware.com
 *   Copyright (C) 2010 Arne Pl\u00f6se
 *   @author Arne Pl\u00f6se
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.serotonin.mango.rt.dataSource.mbus;

import gnu.io.SerialPort;

import java.io.IOException;

import net.sf.mbus4j.SerialPortTools;
import net.sf.mbus4j.dataframes.datablocks.BigDecimalDataBlock;
import net.sf.mbus4j.dataframes.datablocks.ByteDataBlock;
import net.sf.mbus4j.dataframes.datablocks.IntegerDataBlock;
import net.sf.mbus4j.dataframes.datablocks.LongDataBlock;
import net.sf.mbus4j.dataframes.datablocks.RealDataBlock;
import net.sf.mbus4j.dataframes.datablocks.ShortDataBlock;
import net.sf.mbus4j.dataframes.datablocks.StringDataBlock;
import net.sf.mbus4j.master.MBusMaster;
import net.sf.mbus4j.master.ValueRequest;
import net.sf.mbus4j.master.ValueRequestPointLocator;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.serotonin.ShouldNeverHappenException;
import com.serotonin.mango.rt.dataImage.DataPointRT;
import com.serotonin.mango.rt.dataImage.PointValueTime;
import com.serotonin.mango.rt.dataImage.SetPointSource;
import com.serotonin.mango.rt.dataSource.PollingDataSource;
import com.serotonin.mango.vo.dataSource.mbus.MBusDataSourceVO;
import com.serotonin.web.i18n.LocalizableMessage;

/**
 * TODO datatype NUMERIC_INT is missing TODO Starttime for timpepoints ???
 */
public class MBusDataSourceRT extends PollingDataSource {
    private final static Log LOG = LogFactory.getLog(MBusDataSourceRT.class);
    public static final int DATA_SOURCE_EXCEPTION_EVENT = 1;
    public static final int POINT_READ_EXCEPTION_EVENT = 2;
    public static final int POINT_WRITE_EXCEPTION_EVENT = 3;
    private final MBusDataSourceVO vo;
    // private final long nextRescan = 0;
    private SerialPort sPort;
    private final MBusMaster master = new MBusMaster();

    public MBusDataSourceRT(MBusDataSourceVO vo) {
        super(vo);
        this.vo = vo;
        setPollingPeriod(vo.getUpdatePeriodType(), vo.getUpdatePeriods(), false);
    }

    @Override
    public void initialize() {
        LOG.info("INITIALIZE");
        super.initialize();
    }

    @Override
    public void terminate() {
        LOG.info("TERMINATE");
        super.terminate();
    }

    @Override
    protected synchronized void doPoll(long time) {
        ValueRequest<DataPointRT> request = new ValueRequest<DataPointRT>();
        for (DataPointRT point : dataPoints) {
            final MBusPointLocatorRT locator = point.getPointLocator();
            request.add(locator.createValueRequestPointLocator(point));
        }

        if (openSerialPort()) {
            try {
                master.readValues(request);
                for (ValueRequestPointLocator<DataPointRT> vr : request) {
                    try {
                        if (vr.getDb() == null) {
                            // TODO handle null value properly
                            throw new ShouldNeverHappenException("Got null value ");
                        }
                        else if (vr.getDb() instanceof ByteDataBlock) {
                            vr.getReference().updatePointValue(
                                    new PointValueTime((double) ((ByteDataBlock) vr.getDb()).getValue(), time));
                        }
                        else if (vr.getDb() instanceof ShortDataBlock) {
                            vr.getReference().updatePointValue(
                                    new PointValueTime((double) ((ShortDataBlock) vr.getDb()).getValue(), time));
                        }
                        else if (vr.getDb() instanceof IntegerDataBlock) {
                            vr.getReference().updatePointValue(
                                    new PointValueTime((double) ((IntegerDataBlock) vr.getDb()).getValue(), time));
                        }
                        else if (vr.getDb() instanceof LongDataBlock) {
                            vr.getReference().updatePointValue(
                                    new PointValueTime(((LongDataBlock) vr.getDb()).getValue(), time));
                        }
                        else if (vr.getDb() instanceof RealDataBlock) {
                            vr.getReference().updatePointValue(
                                    new PointValueTime(((RealDataBlock) vr.getDb()).getValue(), time));
                        }
                        else if (vr.getDb() instanceof BigDecimalDataBlock) {
                            vr.getReference().updatePointValue(
                                    new PointValueTime(((BigDecimalDataBlock) vr.getDb()).getValue().doubleValue(),
                                            time));
                        }
                        else if (vr.getDb() instanceof StringDataBlock) {
                            vr.getReference().updatePointValue(
                                    new PointValueTime(((StringDataBlock) vr.getDb()).getValue(), time));
                        }
                        else {
                            LOG.fatal("Dont know how to save : " + vr.getReference());
                            raiseEvent(POINT_READ_EXCEPTION_EVENT, System.currentTimeMillis(), true,
                                    new LocalizableMessage("event.exception2", vo.getName(),
                                            "Dont know how to save : ", "Datapoint"));

                        }
                    }
                    catch (Exception ex) {
                        LOG.fatal("Error during saving: " + vr.getReference(), ex);
                    }

                }
                returnToNormal(POINT_READ_EXCEPTION_EVENT, time);
                returnToNormal(DATA_SOURCE_EXCEPTION_EVENT, time);

            }
            catch (InterruptedException ex) {
                raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis(), true,
                        getSerialExceptionMessage(ex, vo.getCommPortId()));
                LOG.error("cant set value of", ex);
            }
            catch (IOException ex) {
                raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis(), true,
                        getSerialExceptionMessage(ex, vo.getCommPortId()));
                LOG.error("cant set value of", ex);
            }
            finally {
                closePort();
            }
        }
    }

    @Override
    public synchronized void setPointValue(DataPointRT dataPoint, PointValueTime valueTime, SetPointSource source) {
        // no op
    }

    private boolean openSerialPort() {
        try {
            LOG.warn("MBus Try open serial port");
            sPort = SerialPortTools.openPort(vo.getCommPortId(), vo.getBaudRate());
            master.setStreams(sPort.getInputStream(), sPort.getOutputStream(), vo.getBaudRate());
            return true;
        }
        catch (Exception ex) {
            LOG.fatal("MBus Open serial port exception", ex);
            // Raise an event.
            raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis(), true,
                    getSerialExceptionMessage(ex, vo.getCommPortId()));
            return false;
        }
    }

    private void closePort() {
        try {
            master.close();
        }
        catch (InterruptedException ex) {
            LOG.fatal("Close port", ex);
            raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis(), true, new LocalizableMessage(
                    "event.exception2", vo.getName(), ex.getMessage(), "HALLO3"));
        }
        if (sPort != null) {
            sPort.close();
            sPort = null;
        }
    }
}
