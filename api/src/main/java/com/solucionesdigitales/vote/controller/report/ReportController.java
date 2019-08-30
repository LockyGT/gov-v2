package com.solucionesdigitales.vote.controller.report;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.service.report.ReportAdministratorService;
import com.solucionesdigitales.vote.service.report.ReportService;



@RestController
@RequestMapping("report")
public class ReportController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ReportController.class);
	
	@Autowired
	private ReportService reportService;
	
	@Autowired
	private ReportAdministratorService reportAdministratorService;
	
	@GetMapping("/legislator")
	
	public Object getReportLegislator(@RequestParam(value="partnersId") final String[] partnersId, 
			@RequestParam(value="initiativesId") final String[] initiativesId, 
			@RequestParam(value="votesId") final String[] votesId){
		LOGGER.info("---- OBTENIENDO EL REPORTE DEL LEGISLADOR ----");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("data", reportService.generatedReporLegislator(partnersId, initiativesId, votesId).toString());
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
	
	@GetMapping("/initiatives")
	public Object getInitiatives(@RequestParam(value="sessionsId") final String[] sessionsId, 
			@RequestParam(value="initiativesId") final String[] initiativesId) {
			LOGGER.info("---- OBTENIENDO EL REPORTE por INICIATIVAS ----");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("data", reportService.generatedReportInitiatives(sessionsId, initiativesId).toString());
		return map;
	}
	
	@GetMapping("/legislaturas")
	public Object getLegislaturas(@RequestParam(value="sessionsId") final String[] sessionsId, 
			@RequestParam(value="initiativesId") final String[] initiativesId) {
			LOGGER.info("---- OBTENIENDO EL REPORTE por LEGISLATURA ----");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("data", reportService.generatedReportLegislatura(sessionsId, initiativesId).toString());
		return map;
	}
	
	@GetMapping("/report/legislator")
	public ResponseEntity<byte[]> writePdfAdministrator(@RequestParam(value="idPartner") final String idPartner) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType("application/pdf"));
		byte[] content = reportAdministratorService.writePdfAdministrator(idPartner);
		ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(content, headers, HttpStatus.OK);
		return (response);
	}
}
