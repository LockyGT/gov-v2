package com.solucionesdigitales.vote.service.impl.report;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.service.report.ReportAdministratorService;

import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRLoader;

@Service("reportAdministratorService")
public class ReportAdministratorServiceImpl implements ReportAdministratorService{
	
//	@Value("${dir.carpeta.multimedia}")
//	private String dirFolder;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ReportAdministratorServiceImpl.class);
	
	@Override
	public byte[] writePdfAdministrator(String idPartner) {
		String path = "/jasperreports/reporte_legislador_pag_1.jrxml";
		byte[] content = null;
		Map<String, Object> params = new HashMap<>();
		try {
			URL report = getClass().getResource(path);
			if(report==null) {
				LOGGER.error("Jasper not found: "+path);
				return (null);
			}
			
			JasperReport jasperReport = (JasperReport) JRLoader.loadObject(new File(report.toURI()));
//			params.put(key, value);
			JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params);
			ByteArrayOutputStream buffer = new ByteArrayOutputStream();
			JasperExportManager.exportReportToPdfStream(jasperPrint, buffer);
			content = buffer.toByteArray();
			buffer.close();
			
		}catch(Exception e) {
			
		}
		return (content);
	}

}
