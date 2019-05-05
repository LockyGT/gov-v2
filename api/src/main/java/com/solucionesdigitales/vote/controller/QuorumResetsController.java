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

import com.solucionesdigitales.vote.entity.QuorumResets;
import com.solucionesdigitales.vote.service.QuorumResetsService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("quorumResets")
public class QuorumResetsController {
	private static final Logger logger = LoggerFactory.getLogger(QuorumResetsController.class);	
	
	@Autowired
	private QuorumResetsService service;
	
	/**
	 * 
	 * @return List<Quorum>
	 */
	@GetMapping
	public List<QuorumResets> get() {
		logger.info("consulta QuorumResets:");
		return service.fetch();
	}	
	
	/**
	 * 
	 * @param entity
	 * @return Attendance
	 */
	@PostMapping
	public QuorumResets postData(@RequestBody QuorumResets entity) {
		logger.info("QuorumResets a guardar: [" + entity.toString() + "]");
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return Attendance
	 */
	@PutMapping
	public QuorumResets putData(@RequestBody QuorumResets entity) {
		logger.info("QuorumResets a actualizar: [" + entity.toString() + "]");
		return service.put(entity);
	}
}
