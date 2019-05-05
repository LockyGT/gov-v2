package com.solucionesdigitales.vote.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.fingerprint.FingerPrint;
import com.solucionesdigitales.vote.service.FingerPrintService;
/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("fingerprint")
public class FingerPrintController {

	private static final Logger logger = LoggerFactory.getLogger(FingerPrintController.class);	
	
	@Autowired
	private FingerPrintService service;
	
	/**
	 * 
	 * @return List<FingerPrint>
	 */
	@GetMapping
	public List<FingerPrint> get() {
		logger.info("consulta Huellas:");
		return service.fetch();
	}	
	
	/**
	 * 
	 * @param entity
	 * @return FingerPrint
	 */
	@PostMapping
	public FingerPrint postData(@RequestBody FingerPrint entity) {
		logger.info("Huella a guardar: [" + entity.toString() + "]");
		return service.post(entity);
	}	
	
	/**
	 * 
	 * @param entity
	 * @return FingerPrint
	 */
	@PutMapping
	public FingerPrint putData(@RequestBody FingerPrint entity) {
		logger.info("Huella a actualizar: [" + entity.toString() + "]");
		return service.put(entity);
	}
}
