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
package com.serotonin.mango.rt.dataSource.modbus;

import gnu.io.NoSuchPortException;

import com.serotonin.io.serial.SerialParameters;
import com.serotonin.mango.rt.dataSource.DataSourceRT;
import com.serotonin.mango.vo.dataSource.modbus.ModbusSerialDataSourceVO;
import com.serotonin.mango.vo.dataSource.modbus.ModbusSerialDataSourceVO.EncodingType;
import com.serotonin.modbus4j.ModbusFactory;
import com.serotonin.modbus4j.ModbusMaster;
import com.serotonin.modbus4j.exception.ModbusInitException;
import com.serotonin.web.i18n.LocalizableMessage;

public class ModbusSerialDataSource extends ModbusDataSource {

    private final ModbusSerialDataSourceVO configuration;

    public ModbusSerialDataSource(ModbusSerialDataSourceVO configuration) {
        super(configuration);
        this.configuration = configuration;
    }

    //
    // /
    // / Lifecycle
    // /
    //
    @Override
    public void initialize() {
        SerialParameters params = new SerialParameters();
        params.setCommPortId(configuration.getCommPortId());
        params.setPortOwnerName("Mango Modbus Serial Data Source");
        params.setBaudRate(configuration.getBaudRate());
        params.setFlowControlIn(configuration.getFlowControlIn());
        params.setFlowControlOut(configuration.getFlowControlOut());
        params.setDataBits(configuration.getDataBits());
        params.setStopBits(configuration.getStopBits());
        params.setParity(configuration.getParity());

        ModbusMaster modbusMaster;
        if (configuration.getEncoding() == EncodingType.ASCII)
            modbusMaster = new ModbusFactory().createAsciiMaster(params, configuration.getConcurrency());
        else
            modbusMaster = new ModbusFactory().createRtuMaster(params, configuration.getConcurrency());

        super.initialize(modbusMaster);
    }

    @Override
    protected LocalizableMessage getLocalExceptionMessage(Exception e) {
        if (e instanceof ModbusInitException) {
            Throwable cause = e.getCause();
            if (cause instanceof NoSuchPortException)
                return new LocalizableMessage("event.serial.portOpenError", configuration.getCommPortId());
        }

        return DataSourceRT.getExceptionMessage(e);
    }
}
