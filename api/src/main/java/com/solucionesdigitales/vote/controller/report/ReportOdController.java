package com.solucionesdigitales.vote.controller.report;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.Document;
import com.solucionesdigitales.vote.service.report.ReportOdService;


@RestController
@RequestMapping("reportOd")
public class ReportOdController {
	
private static final Logger LOGGER = LoggerFactory.getLogger(ReportOdController.class);
	
	@Autowired
	private ReportOdService reportOdService;
	
	@GetMapping("/getPdf")
	@ResponseBody
	public ResponseEntity<byte[]> getPdf(@RequestParam("orderdayId") final String orderdayId){
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType("application/pdf"));
		byte[] content = reportOdService.writePdf(orderdayId);
		ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(content, headers,HttpStatus.OK);
		return (response);
	}
	

}
