package br.org.scadabr.rt.dataSource.dnp3;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import br.org.scadabr.app.DNP3Master;
import br.org.scadabr.app.DNPElementVO;
import br.org.scadabr.vo.dataSource.dnp3.Dnp3DataSourceVO;
import br.org.scadabr.vo.dataSource.dnp3.Dnp3PointLocatorVO;

import com.serotonin.mango.Common;
import com.serotonin.mango.DataTypes;
import com.serotonin.mango.rt.dataImage.DataPointRT;
import com.serotonin.mango.rt.dataImage.PointValueTime;
import com.serotonin.mango.rt.dataImage.SetPointSource;
import com.serotonin.mango.rt.dataImage.types.MangoValue;
import com.serotonin.mango.rt.dataSource.PollingDataSource;
import com.serotonin.web.i18n.LocalizableMessage;

public class Dnp3DataSource extends PollingDataSource {
    private final Log LOG = LogFactory.getLog(Dnp3DataSource.class);

    public static final int POINT_READ_EXCEPTION_EVENT = 1;
    public static final int DATA_SOURCE_EXCEPTION_EVENT = 2;

    private DNP3Master dnp3Master;
    private final Dnp3DataSourceVO<?> vo;

    public Dnp3DataSource(Dnp3DataSourceVO<?> vo) {
        super(vo);
        this.vo = vo;
        setPollingPeriod(Common.TimePeriods.SECONDS, vo.getRbePollPeriods(), false);
    }

    @Override
    protected void doPoll(long time) {
        for (DataPointRT dataPoint : dataPoints) {
            try {
                if (dnp3Master.getElement(dataPoint.getId()) == null) {
                    Dnp3PointLocatorVO pointLocator = (Dnp3PointLocatorVO) dataPoint.getVO().getPointLocator();
                    try {
                        dnp3Master.addElement(dataPoint.getId(), pointLocator.getDnp3DataType(),
                                ((Dnp3PointLocatorVO) dataPoint.getVO().getPointLocator()).getIndex());
                    }
                    catch (Exception e) {
                        raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, time, true, new LocalizableMessage("event.exception2",
                                vo.getName(), e.getMessage()));
                    }
                }
            }
            catch (Exception e) {
                raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, time, true,
                        new LocalizableMessage("event.exception2", vo.getName(), e.getMessage()));
            }
        }

        try {
            dnp3Master.doPoll();
            returnToNormal(DATA_SOURCE_EXCEPTION_EVENT, time);
        }
        catch (Exception e) {
            raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, time, true, new LocalizableMessage("event.exception2",
                    vo.getName(), e.getMessage()));
        }

        for (DataPointRT dataPoint : dataPoints) {
            DNPElementVO dnpElementScada = new DNPElementVO();
            try {
                dnpElementScada = dnp3Master.getElement((dataPoint.getId()));
            }
            catch (Exception e) {
                raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, time, true,
                        new LocalizableMessage("event.exception2", vo.getName(), e.getMessage()));
            }

            if (dnpElementScada != null) {
                MangoValue value = null;
                if (dataPoint.getDataTypeId() == DataTypes.BINARY) {
                    value = MangoValue.stringToValue(dnpElementScada.getValue().toString(), DataTypes.BINARY);

                }
                else if (dataPoint.getDataTypeId() == DataTypes.ALPHANUMERIC) {
                    value = MangoValue.stringToValue(dnpElementScada.getValue().toString(), DataTypes.ALPHANUMERIC);

                }
                else {
                    value = MangoValue.stringToValue(dnpElementScada.getValue().toString(), DataTypes.NUMERIC);

                }
                dataPoint.updatePointValue(new PointValueTime(value, time));
            }
        }
    }

    protected void initialize(DNP3Master dnp3Master) {
        this.dnp3Master = dnp3Master;
        dnp3Master.setAddress(vo.getSourceAddress());
        dnp3Master.setSlaveAddress(vo.getSlaveAddress());
        dnp3Master.setTimeout(vo.getTimeout());
        dnp3Master.setRetries(vo.getRetries());
        dnp3Master.setStaticPollMultiplier(vo.getStaticPollPeriods());

        try {
            dnp3Master.init();
            returnToNormal(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis());
        }
        catch (Exception e) {
            raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis(), true, new LocalizableMessage(
                    "event.exception2", vo.getName(), e.getMessage()));
            // TODO parar datasource
            LOG.debug("Error while initializing data source", e);
            return;
        }

        super.initialize();
    }

    @Override
    public void terminate() {
        super.terminate();
        try {
            dnp3Master.terminate();
        }
        catch (Exception e) {
            LOG.error("Termination error", e);
        }
    }

    @Override
    public void setPointValue(DataPointRT dataPoint, PointValueTime valueTime, SetPointSource source) {
        Dnp3PointLocatorVO pointLocator = (Dnp3PointLocatorVO) dataPoint.getVO().getPointLocator();

        int dataType = pointLocator.getDnp3DataType();
        int index = pointLocator.getIndex();

        try {
            if (dataType == 0x10) {
                dnp3Master.controlCommand(valueTime.getValue().toString(), dataType, index,
                        pointLocator.getControlCommand(), pointLocator.getTimeOn(), pointLocator.getTimeOff());
            }
            else {

                dnp3Master.sendAnalogCommand(index, valueTime.getIntegerValue());
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}