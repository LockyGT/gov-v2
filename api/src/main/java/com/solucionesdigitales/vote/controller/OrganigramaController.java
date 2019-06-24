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

import com.solucionesdigitales.vote.entity.Organigrama;
import com.solucionesdigitales.vote.entity.user.User;
import com.solucionesdigitales.vote.service.OrganigramaService;
import com.solucionesdigitales.vote.service.user.UserService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("organigrama")
public class OrganigramaController {
	
	private static final Logger logger = LoggerFactory.getLogger(OrganigramaController.class);
	
	@Autowired
	private OrganigramaService service;
	
	/**
	 * 
	 * @return List<PartnerHasFingerPrint>
	 */
	@GetMapping
	public List<Organigrama> get(){
		logger.info("Organigrama get");
		return service.listaOrganigramas();
	}
	
	
	@PostMapping
	public Organigrama postData(@RequestBody final Organigrama entity) {				
		logger.info("Organigrama a guardar: ["+entity.toString()+"]");		
		return service.save(entity);
	}
	
	/**
	 *  
	 * @param entity
	 * @return PartnerHasFingerPrint
	 */
	@PutMapping
	public Organigrama putData(@RequestBody final Organigrama entity) {				
		logger.info("Organigrama a actualizar: ["+entity.toString()+"]");		
		return service.update(entity);
	}
	
}
