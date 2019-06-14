package com.solucionesdigitales.vote.controller.report;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.solucionesdigitales.vote.service.report.ReportService;



@RestController
@RequestMapping("report")
public class ReportController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ReportController.class);
	
	@Autowired
	private ReportService reportService;
	
	@GetMapping("/legislator")
	
	public Object getReportLegislator(@RequestParam(value="partnersId") final String[] partnersId, 
			@RequestParam(value="initiativesId") final String[] initiativesId){
		LOGGER.info("---- OBTENIENDO EL REPORTE DEL LEGISLADOR ----");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("data", reportService.generatedReporLegislator(partnersId, initiativesId).toString());
		return map;
	}
	
	@GetMapping("/results-initiatives")
	public Object getReportResults(@RequestParam(value="sessionsId") final String[] sessionsId, 
			@RequestParam(value="initiativesId") final String[] initiativesId) {
			LOGGER.info("---- OBTENIENDO EL REPORTE POR RESULTADOS DE INICIATIVAS ----");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("data", reportService.generatedReportResults(sessionsId, initiativesId).toString());
		return map;
	}
}
