package br.org.scadabr.vo.dataSource.dnp3;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.util.List;
import java.util.Map;

import br.org.scadabr.rt.dataSource.dnp3.Dnp3SerialDataSource;

import com.serotonin.json.JsonException;
import com.serotonin.json.JsonObject;
import com.serotonin.json.JsonReader;
import com.serotonin.json.JsonRemoteEntity;
import com.serotonin.json.JsonRemoteProperty;
import com.serotonin.mango.rt.dataSource.DataSourceRT;
import com.serotonin.util.SerializationHelper;
import com.serotonin.util.StringUtils;
import com.serotonin.web.dwr.DwrResponseI18n;
import com.serotonin.web.i18n.LocalizableMessage;

@JsonRemoteEntity
public class Dnp3SerialDataSourceVO extends Dnp3DataSourceVO<Dnp3SerialDataSourceVO> {
    public static final Type TYPE = Type.DNP3_SERIAL;

    @Override
    public LocalizableMessage getConnectionDescription() {
        return new LocalizableMessage("common.default", commPortId);
    }

    @Override
    public Type getType() {
        return TYPE;
    }

    @Override
    public DataSourceRT createDataSourceRT() {
        return new Dnp3SerialDataSource(this);
    }

    @JsonRemoteProperty
    private String commPortId;
    @JsonRemoteProperty
    private int baudRate = 9600;

    public int getBaudRate() {
        return baudRate;
    }

    public void setBaudRate(int baudRate) {
        this.baudRate = baudRate;
    }

    public String getCommPortId() {
        return commPortId;
    }

    public void setCommPortId(String commPortId) {
        this.commPortId = commPortId;
    }

    @Override
    public void validate(DwrResponseI18n response) {
        super.validate(response);
        if (StringUtils.isEmpty(commPortId))
            response.addContextualMessage("commPortId", "validate.required");
        if (baudRate <= 0)
            response.addContextualMessage("baudRate", "validate.invalidValue");
    }

    @Override
    protected void addPropertyChangesImpl(List<LocalizableMessage> list, Dnp3SerialDataSourceVO from) {
        // TODO Auto-generated method stub

    }

    private static final long serialVersionUID = -1;
    private static final int version = 1;

    private void writeObject(ObjectOutputStream out) throws IOException {
        out.writeInt(version);
        SerializationHelper.writeSafeUTF(out, commPortId);
        out.writeInt(baudRate);
    }

    private void readObject(ObjectInputStream in) throws IOException {
        int ver = in.readInt();
        // Switch on the version of the class so that version changes can be
        // elegantly handled.
        if (ver == 1) {
            commPortId = SerializationHelper.readSafeUTF(in);
            baudRate = in.readInt();
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
}
