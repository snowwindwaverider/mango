package br.org.scadabr.rt.dataSource.opc;

import java.util.ArrayList;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openscada.opc.lib.da.AddFailedException;

import br.org.scadabr.OPCMaster;
import br.org.scadabr.RealOPCMaster;
import br.org.scadabr.vo.dataSource.opc.OPCDataSourceVO;
import br.org.scadabr.vo.dataSource.opc.OPCPointLocatorVO;

import com.serotonin.mango.rt.dataImage.DataPointRT;
import com.serotonin.mango.rt.dataImage.PointValueTime;
import com.serotonin.mango.rt.dataImage.SetPointSource;
import com.serotonin.mango.rt.dataImage.types.MangoValue;
import com.serotonin.mango.rt.dataSource.PollingDataSource;
import com.serotonin.web.i18n.LocalizableMessage;

public class OPCDataSourceRT extends PollingDataSource {
    private final Log LOG = LogFactory.getLog(OPCDataSourceRT.class);
    public static final int POINT_READ_EXCEPTION_EVENT = 1;
    public static final int DATA_SOURCE_EXCEPTION_EVENT = 2;
    public static final int POINT_WRITE_EXCEPTION_EVENT = 3;
    private OPCMaster opcMaster;
    private final OPCDataSourceVO vo;
    private Boolean initiate = false;

    public OPCDataSourceRT(OPCDataSourceVO vo) {
        super(vo);
        this.vo = vo;
        setPollingPeriod(vo.getUpdatePeriodType(), vo.getUpdatePeriods(), false);
    }

    @Override
    protected void doPoll(long time) {
        ArrayList<String> enabledTags = new ArrayList<String>();
        for (DataPointRT dataPoint : dataPoints) {
            OPCPointLocatorVO dataPointVO = dataPoint.getVO().getPointLocator();
            enabledTags.add(dataPointVO.getTag());
        }
        try {
            opcMaster.configureGroup(enabledTags);
        }
        catch (Exception e) {
            LocalizableMessage lm;
            if (e instanceof AddFailedException)
                lm = new LocalizableMessage("dsedit.opc.rt.addFailed", ((AddFailedException) e).getErrors().keySet());
            else
                lm = new LocalizableMessage("common.default", e.getMessage());

            raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, time, true, lm);
        }

        try {
            if (!initiate) {
                opcMaster.do2Poll(vo.getUpdatePeriods());
                returnToNormal(DATA_SOURCE_EXCEPTION_EVENT, time);
                initiate = true;
            }
        }
        catch (Exception e) {
            raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, time, true, new LocalizableMessage("event.exception2",
                    vo.getName(), e.getMessage()));
        }

        for (DataPointRT dataPoint : dataPoints) {
            OPCPointLocatorVO dataPointVO = dataPoint.getVO().getPointLocator();
            MangoValue mangoValue = null;
            String value = "0";
            try {
                value = opcMaster.getValue2(dataPointVO.getTag());

                mangoValue = MangoValue.stringToValue(value, dataPointVO.getDataTypeId());
                dataPoint.updatePointValue(new PointValueTime(mangoValue, time));
            }
            catch (Exception e) {
                raiseEvent(POINT_READ_EXCEPTION_EVENT, time, true,
                        new LocalizableMessage("event.exception2", vo.getName(), e.getMessage()));
            }
        }
    }

    @Override
    public void setPointValue(DataPointRT dataPoint, PointValueTime valueTime, SetPointSource source) {
        String tag = ((OPCPointLocatorVO) dataPoint.getVO().getPointLocator()).getTag();
        Object value = valueTime.getValue().getObjectValue();

        try {
            opcMaster.write(tag, value);
        }
        catch (Exception e) {
            raiseEvent(POINT_WRITE_EXCEPTION_EVENT, System.currentTimeMillis(), true, new LocalizableMessage(
                    "event.exception2", vo.getName(), e.getMessage()));
            e.printStackTrace();
        }
    }

    @Override
    public void initialize() {
        this.opcMaster = new RealOPCMaster();
        opcMaster.setHost(vo.getHost());
        opcMaster.setDomain(vo.getDomain());
        opcMaster.setUser(vo.getUser());
        opcMaster.setPassword(vo.getPassword());
        opcMaster.setServer(vo.getServer());
        opcMaster.setDataSourceXid(vo.getXid());

        try {
            opcMaster.init();
            returnToNormal(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis());
        }
        catch (Exception e) {
            raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis(), true, new LocalizableMessage(
                    "event.exception2", vo.getName(), e.getMessage()));
            LOG.debug("Error while initializing data source", e);
            return;
        }
        super.initialize();
    }

    @Override
    public void terminate() {
        initiate = false;
        super.terminate();
        try {
            opcMaster.terminate();
        }
        catch (Exception e) {
            raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis(), true, new LocalizableMessage(
                    "event.exception2", vo.getName(), e.getMessage()));
        }
    }
}
