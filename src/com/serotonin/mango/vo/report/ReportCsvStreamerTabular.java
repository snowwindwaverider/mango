package com.serotonin.mango.vo.report;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.ResourceBundle;
import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import com.serotonin.mango.Common;
import com.serotonin.mango.rt.dataImage.PointValueTime;
import com.serotonin.mango.view.export.CsvWriter;
import com.serotonin.mango.view.text.TextRenderer;
import com.serotonin.web.i18n.I18NUtils;

/**
 * The default report csv streamer makes files with three columns, one for the
 *  series name, one for timestamp, one for value. this csv streamer makes 
 *  files with one column for timestamp, and one column for each series. 
 *  datapoints with the exact same timestamp are on the same row.  
 *
 */

public class ReportCsvStreamerTabular implements ReportDataStreamHandler {
	private final static String ANNOTATION_KEY = "annotation";
	
	private final PrintWriter out;
	private final DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy/MM/dd HH:mm:ss");
	private final CsvWriter csvWriter = new CsvWriter();
	ResourceBundle bundle;
	
	private HashMap<Long, HashMap<String,Object>> rows = new HashMap<Long, HashMap<String,Object>>();
	private ArrayList<CsvSeries> seriesList = new ArrayList<CsvSeries>();
	
	public ReportCsvStreamerTabular(PrintWriter out, ResourceBundle bundle) {
		this.out = out;
		//data[1] = I18NUtils.getMessage(bundle, "common.time");
		this.bundle = bundle;
		seriesList.add(new CsvSeries("date", I18NUtils.getMessage(bundle, "common.time"), null));
	}

	@Override
	public void done() {

		// first print out column headings.
		ArrayList<String> row = new ArrayList<String>(seriesList.size());
		Iterator<CsvSeries> columnIterator = seriesList.iterator();
		while (columnIterator.hasNext()) {
			row.add(columnIterator.next().getName());
		}
		out.write(csvWriter.encodeRow(row.toArray(new String[0])));
		row.clear();
		
		// retrieve list of timestamps to sort
		Long[] rowSet = rows.keySet().toArray(new Long[0]);
		Arrays.sort(rowSet);
		
		CsvSeries series;
		for (int tsIndex =0; tsIndex < rowSet.length; tsIndex++) {
			// print the time
			columnIterator = seriesList.iterator();
			row.add(dtf.print(new DateTime(rowSet[tsIndex])));
			columnIterator.next(); // just added date
			
			// retrieve the row
			HashMap<String, Object> rowMap  = (HashMap<String, Object>) rows.get(rowSet[tsIndex]);
			while (columnIterator.hasNext()) {
				series = columnIterator.next();
				Object value = rowMap.get(series.getId());
				if (value == null) 
					row.add("");
				else {
					if (series.getTextRenderer() != null && value instanceof PointValueTime)
						row.add(series.getTextRenderer().getText((PointValueTime)value,TextRenderer.HINT_FULL));
					else
						row.add(value.toString());
				}
			}
			out.write(csvWriter.encodeRow(row.toArray(new String[0])));
			row.clear();
			
		}
        out.flush();
        out.close();
	}

	@Override
	public void pointData(ReportDataValue rdv) {

		HashMap<String, Object> rowMap;
		if (rows.containsKey(rdv.getTime())) {
			// we have had previous values for this time/row
			rowMap = (HashMap<String, Object>) rows.get(rdv.getTime());
		} else {
			rowMap = new HashMap<String, Object>();
		}
		rowMap.put(Integer.toString(rdv.getReportPointId()), rdv.getValue());
		rowMap.put(Integer.toString(rdv.getReportPointId()) + ANNOTATION_KEY,
				rdv.getAnnotation());
		rows.put(rdv.getTime(), rowMap);

	}

	@Override
	public void startPoint(ReportPointInfo pointInfo) {
		// create series for values
		seriesList.add(new CsvSeries(Integer.toString(pointInfo.getReportPointId()), 
				pointInfo.getPointName(), pointInfo.getTextRenderer()));
		// create series for annotations
		seriesList.add(new CsvSeries(pointInfo.getReportPointId() + ANNOTATION_KEY,
				pointInfo.getPointName() + " " + I18NUtils.getMessage(bundle, "common.annotation")));
		
	}

	private class CsvSeries {
		String id;
		String name;
		TextRenderer textRenderer;
	
		 CsvSeries(String id, String name, TextRenderer textRenderer) {
			this.id = id;
			this.name = name;
			this.textRenderer = textRenderer;
		}
		 
		 CsvSeries(String id, String name) {
			this.id = id;
			this.name = name;
			this.textRenderer = null;
		 }
		 
		public String getName() {
			return name;
		}
		
		public String getId() {
			return id;
		}
		
		public TextRenderer getTextRenderer() {
			return textRenderer;
		}
		
	}

}
