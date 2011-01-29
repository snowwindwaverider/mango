package br.org.scadabr.rt.dataSource.dnp3;

import br.org.scadabr.app.DNP3Master;
import br.org.scadabr.protocol.dnp3.common.InitFeatures;
import br.org.scadabr.vo.dataSource.dnp3.Dnp3IpDataSourceVO;

public class Dnp3IpDataSource extends Dnp3DataSource implements InitFeatures {
	private final Dnp3IpDataSourceVO configuration;

	public Dnp3IpDataSource(Dnp3IpDataSourceVO configuration) {
		super(configuration);
		this.configuration = configuration;
	}

	@Override
	public void initialize() {
		// inicializa DnpMaster com os parametros IP.
		DNP3Master dnp3Master = new DNP3Master();
		dnp3Master.setCommType(ETHERNET);
		dnp3Master.setHost(configuration.getHost());
		dnp3Master.setPort(configuration.getPort());
		super.initialize(dnp3Master);
	}
}