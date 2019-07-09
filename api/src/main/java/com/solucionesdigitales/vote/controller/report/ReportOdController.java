package com.solucionesdigitales.vote.controller.report;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.service.report.ReportOdService;


@RestController
@RequestMapping("reportOd")
public class ReportOdController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ReportOdController.class);

	@Autowired
	private ReportOdService reportOdService;

	@GetMapping("/getPdf")
	@ResponseBody
	public ResponseEntity<Resource> getPdf(@RequestParam("orderdayId") final String orderdayId){
		Resource file = reportOdService.writePdf(orderdayId);
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename=\"" + file.getFilename() + "\"").body(file);
	}
}
