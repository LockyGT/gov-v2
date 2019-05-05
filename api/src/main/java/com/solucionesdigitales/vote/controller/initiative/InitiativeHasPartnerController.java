package com.solucionesdigitales.vote.controller.initiative;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.initiative.InitiativeHasPartner;
import com.solucionesdigitales.vote.service.initiative.InitiativeHasPartnerService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("iniciativahaspartner")
public class InitiativeHasPartnerController {
	
	private static final Logger logger = LoggerFactory.getLogger(InitiativeHasPartnerController.class);
	
	@Autowired
	private InitiativeHasPartnerService service;
	
	/**
	 * 
	 * @param id
	 * @return InitiativeHasPartner
	 */
	@GetMapping
	public InitiativeHasPartner getByInitiativeId(@RequestParam(value="id") final String id){
		logger.info("consulta iniciativas con partners para el panel:");	
		return service.fetchInitiativePartnerByInitiativeId(id);
	}
}
