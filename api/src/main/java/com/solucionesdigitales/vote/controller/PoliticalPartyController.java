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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.PoliticalParty;
import com.solucionesdigitales.vote.service.PoliticalPartyService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("politicalparty")
public class PoliticalPartyController {
	
	private static final Logger logger = LoggerFactory.getLogger(PoliticalPartyController.class);
	
	@Autowired
	private PoliticalPartyService service;
	
	/**
	 * 
	 * @return List<PoliticalParty>
	 */
	@GetMapping
	public List<PoliticalParty> get(){
		logger.info("consulta de partidos politicos:");	
		return service.fetch();
	}
	
	/**
	 * 
	 * @param entity
	 * @return PoliticalParty
	 */
	@PostMapping
	public PoliticalParty postData(@RequestBody final PoliticalParty entity) {				
		logger.info("Partido Politico a guardar: ["+entity.toString()+"]");	
		logger.info("String logo: ["+entity.getLogo()+"]");
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return PoliticalParty
	 */
	@PutMapping
	public PoliticalParty putData(@RequestBody final PoliticalParty entity) {				
		logger.info("Partido Politico a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
	
	/**
	 * 
	 * @return List<PoliticalParty>
	 */
	@GetMapping (value="/acronym")
	public PoliticalParty getByAcronym(@RequestParam(value="acronym") final String acronym){
		logger.info("Partido Politico a por Siglas: ["+acronym+"]");
		return service.fetchByAcronymAndStatus(acronym, 1);
	}
	
}
