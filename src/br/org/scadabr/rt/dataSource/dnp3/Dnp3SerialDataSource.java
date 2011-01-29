package br.org.scadabr.rt.dataSource.dnp3;

import br.org.scadabr.app.DNP3Master;
import br.org.scadabr.protocol.dnp3.common.InitFeatures;
import br.org.scadabr.vo.dataSource.dnp3.Dnp3SerialDataSourceVO;

public class Dnp3SerialDataSource extends Dnp3DataSource implements InitFeatures {
    private final Dnp3SerialDataSourceVO configuration;

    public Dnp3SerialDataSource(Dnp3SerialDataSourceVO configuration) {
        super(configuration);
        this.configuration = configuration;
    }

    @Override
    public void initialize() {
        // inicializa DnpMaster com os parametros seriais.
        DNP3Master dnp3Master = new DNP3Master();

        dnp3Master.setCommType(SERIAL);
        dnp3Master.setBaudrate(configuration.getBaudRate());
        dnp3Master.setSerialPort(configuration.getCommPortId());
        super.initialize(dnp3Master);
    }
}