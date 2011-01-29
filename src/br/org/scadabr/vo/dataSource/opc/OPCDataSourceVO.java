package br.org.scadabr.vo.dataSource.opc;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.List;
import java.util.Map;

import br.org.scadabr.rt.dataSource.opc.OPCDataSourceRT;

import com.serotonin.json.JsonException;
import com.serotonin.json.JsonObject;
import com.serotonin.json.JsonReader;
import com.serotonin.json.JsonRemoteEntity;
import com.serotonin.json.JsonRemoteProperty;
import com.serotonin.mango.Common;
import com.serotonin.mango.rt.dataSource.DataSourceRT;
import com.serotonin.mango.rt.event.type.AuditEventType;
import com.serotonin.mango.util.ExportCodes;
import com.serotonin.mango.vo.dataSource.DataSourceVO;
import com.serotonin.mango.vo.dataSource.PointLocatorVO;
import com.serotonin.mango.vo.event.EventTypeVO;
import com.serotonin.util.SerializationHelper;
import com.serotonin.util.StringUtils;
import com.serotonin.web.dwr.DwrResponseI18n;
import com.serotonin.web.i18n.LocalizableMessage;

@JsonRemoteEntity
public class OPCDataSourceVO extends DataSourceVO<OPCDataSourceVO> {
    public static final Type TYPE = Type.OPC;

    @Override
    protected void addEventTypes(List<EventTypeVO> eventTypes) {
        eventTypes.add(createEventType(OPCDataSourceRT.POINT_READ_EXCEPTION_EVENT, new LocalizableMessage(
                "event.ds.pointRead")));
        eventTypes.add(createEventType(OPCDataSourceRT.DATA_SOURCE_EXCEPTION_EVENT, new LocalizableMessage(
                "event.ds.dataSource")));
        eventTypes.add(createEventType(OPCDataSourceRT.POINT_WRITE_EXCEPTION_EVENT, new LocalizableMessage(
                "event.ds.dataSource")));
    }

    private static final ExportCodes EVENT_CODES = new ExportCodes();
    static {
        EVENT_CODES.addElement(OPCDataSourceRT.DATA_SOURCE_EXCEPTION_EVENT, "DATA_SOURCE_EXCEPTION");
        EVENT_CODES.addElement(OPCDataSourceRT.POINT_READ_EXCEPTION_EVENT, "POINT_READ_EXCEPTION");
        EVENT_CODES.addElement(OPCDataSourceRT.POINT_WRITE_EXCEPTION_EVENT, "POINT_WRITE_EXCEPTION");
    }

    @Override
    public DataSourceRT createDataSourceRT() {
        return new OPCDataSourceRT(this);
    }

    @Override
    public PointLocatorVO createPointLocator() {
        return new OPCPointLocatorVO();
    }

    @Override
    public LocalizableMessage getConnectionDescription() {
        return new LocalizableMessage("common.noMessage");
    }

    @Override
    public ExportCodes getEventCodes() {
        return EVENT_CODES;
    }

    @Override
    public DataSourceVO.Type getType() {
        return TYPE;
    }

    private int updatePeriodType = Common.TimePeriods.SECONDS;
    @JsonRemoteProperty
    private int updatePeriods = 1;
    @JsonRemoteProperty
    private String host = "localhost";
    @JsonRemoteProperty
    private String domain = "localhost";
    @JsonRemoteProperty
    private String user = "";
    @JsonRemoteProperty
    private String password = "";
    @JsonRemoteProperty
    private String server = "";

    @Override
    public void validate(DwrResponseI18n response) {
        super.validate(response);
        if (StringUtils.isEmpty(host))
            response.addContextualMessage("host", "validate.required");
        // if (StringUtils.isEmpty(domain))
        // response.addContextualMessage("domain", "validate.required");
        if (StringUtils.isEmpty(user))
            response.addContextualMessage("user", "validate.required");
        if (StringUtils.isEmpty(password))
            response.addContextualMessage("password", "validate.required");
        if (StringUtils.isEmpty(server))
            response.addContextualMessage("server", "validate.required");
        if (updatePeriods <= 0)
            response.addContextualMessage("updatePeriods", "validate.greaterThanZero");
    }

    @Override
    protected void addPropertiesImpl(List<LocalizableMessage> list) {
        AuditEventType.addPeriodMessage(list, "dsEdit.updatePeriod", updatePeriodType, updatePeriods);
        AuditEventType.addPropertyMessage(list, "dsEdit.opc.host", host);
        AuditEventType.addPropertyMessage(list, "dsEdit.opc.domain", domain);
        AuditEventType.addPropertyMessage(list, "dsEdit.opc.user", user);
        AuditEventType.addPropertyMessage(list, "dsEdit.opc.password", password);
        AuditEventType.addPropertyMessage(list, "dsEdit.opc.server", server);
    }

    @Override
    protected void addPropertyChangesImpl(List<LocalizableMessage> list, OPCDataSourceVO from) {
        AuditEventType.maybeAddPeriodChangeMessage(list, "dsEdit.updatePeriod", from.updatePeriodType,
                from.updatePeriods, updatePeriodType, updatePeriods);
        AuditEventType.maybeAddPropertyChangeMessage(list, "dsEdit.opc.host", from.host, host);
        AuditEventType.maybeAddPropertyChangeMessage(list, "dsEdit.opc.domain", from.domain, domain);
        AuditEventType.maybeAddPropertyChangeMessage(list, "dsEdit.opc.user", from.user, user);
        AuditEventType.maybeAddPropertyChangeMessage(list, "dsEdit.opc.password", from.password, password);
        AuditEventType.maybeAddPropertyChangeMessage(list, "dsEdit.opc.server", from.server, server);
    }

    public int getUpdatePeriodType() {
        return updatePeriodType;
    }

    public void setUpdatePeriodType(int updatePeriodType) {
        this.updatePeriodType = updatePeriodType;
    }

    public int getUpdatePeriods() {
        return updatePeriods;
    }

    public void setUpdatePeriods(int updatePeriods) {
        this.updatePeriods = updatePeriods;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getServer() {
        return server;
    }

    public void setServer(String server) {
        this.server = server;
    }

    //
    // /
    // / Serialization
    // /
    //
    private static final long serialVersionUID = -1;
    private static final int version = 1;

    private void writeObject(ObjectOutputStream out) throws IOException {
        out.writeInt(version);
        SerializationHelper.writeSafeUTF(out, host);
        SerializationHelper.writeSafeUTF(out, domain);
        SerializationHelper.writeSafeUTF(out, user);
        SerializationHelper.writeSafeUTF(out, password);
        SerializationHelper.writeSafeUTF(out, server);
        out.writeInt(updatePeriodType);
        out.writeInt(updatePeriods);

    }

    private void readObject(ObjectInputStream in) throws IOException {
        int ver = in.readInt();
        if (ver == 1) {
            host = SerializationHelper.readSafeUTF(in);
            domain = SerializationHelper.readSafeUTF(in);
            user = SerializationHelper.readSafeUTF(in);
            password = SerializationHelper.readSafeUTF(in);
            server = SerializationHelper.readSafeUTF(in);
            updatePeriodType = in.readInt();
            updatePeriods = in.readInt();
        }
    }

    @Override
    public void jsonDeserialize(JsonReader reader, JsonObject json) throws JsonException {
        super.jsonDeserialize(reader, json);
        Integer value = deserializeUpdatePeriodType(json);
        if (value != null)
            updatePeriodType = value;
    }

    @Override
    public void jsonSerialize(Map<String, Object> map) {
        super.jsonSerialize(map);
        serializeUpdatePeriodType(map, updatePeriodType);
    }
}
