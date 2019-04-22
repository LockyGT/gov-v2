package com.solucionesdigitales.vote.controller.user;

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

import com.solucionesdigitales.vote.entity.user.Rol;
import com.solucionesdigitales.vote.service.user.RolService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("rol")
public class RolController {
	
	private static final Logger logger = LoggerFactory.getLogger(RolController.class);
	
	@Autowired
	private RolService service;
	
	/**
	 * 
	 * @return List<Partner>
	 */
	@GetMapping
	public List<Rol> get(){
		logger.info("consulta Rol:");
		List<Rol> rols = service.fetch();		
		return rols;
	}
	
	/**
	 * 
	 * @param entity
	 * @return Partner
	 */
	@PostMapping
	public Rol postData(@RequestBody final Rol entity) {				
		logger.info("Rol a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return Partner
	 */
	@PutMapping
	public Rol putData(@RequestBody final Rol entity) {				
		logger.info("Rol a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
}
