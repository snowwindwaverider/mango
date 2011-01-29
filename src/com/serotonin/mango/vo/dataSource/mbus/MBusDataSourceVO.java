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
package com.serotonin.mango.vo.dataSource.mbus;

import gnu.io.SerialPort;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.List;
import java.util.Map;

import com.serotonin.json.JsonException;
import com.serotonin.json.JsonObject;
import com.serotonin.json.JsonReader;
import com.serotonin.json.JsonRemoteEntity;
import com.serotonin.json.JsonRemoteProperty;
import com.serotonin.mango.Common;
import com.serotonin.mango.rt.dataSource.DataSourceRT;
import com.serotonin.mango.rt.dataSource.mbus.MBusConnectionType;
import com.serotonin.mango.rt.dataSource.mbus.MBusDataSourceRT;
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
public class MBusDataSourceVO extends DataSourceVO<MBusDataSourceVO> {
    private static final ExportCodes EVENT_CODES = new ExportCodes();

    static {
        EVENT_CODES.addElement(MBusDataSourceRT.DATA_SOURCE_EXCEPTION_EVENT, "DATA_SOURCE_EXCEPTION");
        EVENT_CODES.addElement(MBusDataSourceRT.POINT_READ_EXCEPTION_EVENT, "POINT_READ_EXCEPTION");
        EVENT_CODES.addElement(MBusDataSourceRT.POINT_WRITE_EXCEPTION_EVENT, "POINT_WRITE_EXCEPTION");
    }

    @JsonRemoteProperty
    private String commPortId;
    @JsonRemoteProperty
    private int updatePeriodType = Common.TimePeriods.DAYS;
    @JsonRemoteProperty
    private int updatePeriods = 1;
    @JsonRemoteProperty
    private MBusConnectionType connectionType = MBusConnectionType.SERIAL_DIRECT;
    @JsonRemoteProperty
    private int baudRate = 2400;
    @JsonRemoteProperty
    private int flowControlIn = SerialPort.FLOWCONTROL_RTSCTS_IN;
    @JsonRemoteProperty
    private int flowControlOut = SerialPort.FLOWCONTROL_RTSCTS_OUT;
    @JsonRemoteProperty
    private int dataBits = SerialPort.DATABITS_8;
    @JsonRemoteProperty
    private int stopBits = SerialPort.STOPBITS_1;
    @JsonRemoteProperty
    private int parity = SerialPort.PARITY_EVEN;
    // TODO implement
    @JsonRemoteProperty
    private String phonenumber = "";

    @Override
    public Type getType() {
        return Type.M_BUS;
    }

    @Override
    protected void addEventTypes(List<EventTypeVO> eventTypes) {
        eventTypes.add(createEventType(MBusDataSourceRT.DATA_SOURCE_EXCEPTION_EVENT, new LocalizableMessage(
                "event.ds.dataSource")));
        eventTypes.add(createEventType(MBusDataSourceRT.POINT_READ_EXCEPTION_EVENT, new LocalizableMessage(
                "event.ds.pointRead")));
        eventTypes.add(createEventType(MBusDataSourceRT.POINT_WRITE_EXCEPTION_EVENT, new LocalizableMessage(
                "event.ds.pointWrite")));
    }

    @Override
    public LocalizableMessage getConnectionDescription() {
        return new LocalizableMessage("common.default", commPortId);
    }

    @Override
    public PointLocatorVO createPointLocator() {
        return new MBusPointLocatorVO();
    }

    @Override
    public DataSourceRT createDataSourceRT() {
        return new MBusDataSourceRT(this);
    }

    @Override
    public ExportCodes getEventCodes() {
        return EVENT_CODES;
    }

    @Override
    protected void addPropertiesImpl(List<LocalizableMessage> list) {
        AuditEventType.addPropertyMessage(list, "dsEdit.mbus.port", commPortId);
        AuditEventType.addPeriodMessage(list, "dsEdit.updatePeriod", updatePeriodType, updatePeriods);
    }

    @Override
    protected void addPropertyChangesImpl(List<LocalizableMessage> list, MBusDataSourceVO from) {
        AuditEventType.maybeAddPropertyChangeMessage(list, "dsEdit.mbus.port", from.commPortId, commPortId);
        AuditEventType.maybeAddPeriodChangeMessage(list, "dsEdit.updatePeriod", from.updatePeriodType,
                from.updatePeriods, updatePeriodType, updatePeriods);
    }

    public String getCommPortId() {
        return commPortId;
    }

    public void setCommPortId(String commPortId) {
        this.commPortId = commPortId;
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

    @Override
    public void validate(DwrResponseI18n response) {
        super.validate(response);

        if (StringUtils.isEmpty(commPortId)) {
            response.addContextualMessage("commPortId", "validate.required");
        }
        if (!Common.TIME_PERIOD_CODES.isValidId(updatePeriodType)) {
            response.addContextualMessage("updatePeriodType", "validate.invalidValue");
        }
        if (updatePeriods <= 0) {
            response.addContextualMessage("updatePeriods", "validate.greaterThanZero");
        }
    }

    //
    // /
    // / Serialization
    // /
    //
    private static final long serialVersionUID = -1;
    private static final int version = 2;

    // Serialization for saveDataSource
    private void writeObject(ObjectOutputStream out) throws IOException {
        out.writeInt(version);
        out.writeUTF(connectionType.name());
        switch (connectionType) {
        case SERIAL_DIRECT:
            SerializationHelper.writeSafeUTF(out, commPortId);
            break;
        case SERIAL_AT_MODEM:
            // TODO Modem stuff goes here
            break;
        }

        out.writeInt(updatePeriodType);
        out.writeInt(updatePeriods);
        out.writeInt(baudRate);
        out.writeInt(flowControlIn);
        out.writeInt(flowControlOut);
        out.writeInt(dataBits);
        out.writeInt(stopBits);
        out.writeInt(parity);
    }

    private void readObject(ObjectInputStream in) throws IOException {
        int ver = in.readInt();

        // Switch on the version of the class so that version changes can be elegantly handled.
        switch (ver) {
        case 2:
            connectionType = MBusConnectionType.valueOf(in.readUTF());
            switch (connectionType) {
            case SERIAL_DIRECT:
                commPortId = SerializationHelper.readSafeUTF(in);
                break;
            case SERIAL_AT_MODEM:
                // TODO modem stuff goes here
                break;
            }
            updatePeriodType = in.readInt();
            updatePeriods = in.readInt();
            baudRate = in.readInt();
            flowControlIn = in.readInt();
            flowControlOut = in.readInt();
            dataBits = in.readInt();
            stopBits = in.readInt();
            parity = in.readInt();
            break;
        }
    }

    @Override
    public void jsonDeserialize(JsonReader reader, JsonObject json) throws JsonException {
        super.jsonDeserialize(reader, json);
    }

    @Override
    public void jsonSerialize(Map<String, Object> map) {
        super.jsonSerialize(map);
    }

    public void setConnectionType(MBusConnectionType connectionType) {
        this.connectionType = connectionType;
    }

    /**
     * @return the connectionType
     */
    public MBusConnectionType getConnectionType() {
        return connectionType;
    }

    /**
     * Helper for JSP
     * 
     * @return
     */
    public boolean isSerialDirect() {
        return MBusConnectionType.SERIAL_DIRECT.equals(connectionType);
    }

    /**
     * Helper for JSP
     * 
     * @return
     */
    public boolean isSerialAtModem() {
        return MBusConnectionType.SERIAL_AT_MODEM.equals(connectionType);
    }

    /**
     * @return the flowControlIn
     */
    public int getFlowControlIn() {
        return flowControlIn;
    }

    /**
     * @param flowControlIn
     *            the flowControlIn to set
     */
    public void setFlowControlIn(int flowControlIn) {
        this.flowControlIn = flowControlIn;
    }

    /**
     * @return the baudRate
     */
    public int getBaudRate() {
        return baudRate;
    }

    /**
     * @param baudRate
     *            the baudRate to set
     */
    public void setBaudRate(int baudRate) {
        this.baudRate = baudRate;
    }

    /**
     * @return the flowControlOut
     */
    public int getFlowControlOut() {
        return flowControlOut;
    }

    /**
     * @param flowControlOut
     *            the flowControlOut to set
     */
    public void setFlowControlOut(int flowControlOut) {
        this.flowControlOut = flowControlOut;
    }

    /**
     * @return the dataBits
     */
    public int getDataBits() {
        return dataBits;
    }

    /**
     * @param dataBits
     *            the dataBits to set
     */
    public void setDataBits(int dataBits) {
        this.dataBits = dataBits;
    }

    /**
     * @return the stopBits
     */
    public int getStopBits() {
        return stopBits;
    }

    /**
     * @param stopBits
     *            the stopBits to set
     */
    public void setStopBits(int stopBits) {
        this.stopBits = stopBits;
    }

    /**
     * @return the parity
     */
    public int getParity() {
        return parity;
    }

    /**
     * @param parity
     *            the parity to set
     */
    public void setParity(int parity) {
        this.parity = parity;
    }

    /**
     * @return the phonenumber
     */
    public String getPhonenumber() {
        return phonenumber;
    }

    /**
     * @param phonenumber
     *            the phonenumber to set
     */
    public void setPhonenumber(String phonenumber) {
        this.phonenumber = phonenumber;
    }
}
