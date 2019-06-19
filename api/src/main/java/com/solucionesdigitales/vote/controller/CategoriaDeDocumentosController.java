package com.solucionesdigitales.vote.controller;



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

import com.solucionesdigitales.vote.entity.CategoriaDeDocumentos;
import com.solucionesdigitales.vote.service.CategoriaDeDocumentosService;



@RestController
@RequestMapping("CategoriaDeDocumentos")
public class CategoriaDeDocumentosController {
	
	private static final Logger logger = LoggerFactory.getLogger(CategoriaDeDocumentosController.class);
	
	@Autowired
	private CategoriaDeDocumentosService service;
	
	/**
	 * 
	 * @return List<PartnerHasFingerPrint>
	 */
	@GetMapping
	public CategoriaDeDocumentos get(@RequestParam(value="tipoPartner") final int tipoPartner){
		return service.findByTipoPatner(tipoPartner);
	}
	
	
	@PostMapping
	public CategoriaDeDocumentos postData(@RequestBody final CategoriaDeDocumentos entity) {				
		logger.info("CategoriaDeDocumentos a guardar: ["+entity.toString()+"]");		
		return service.saveCategoriaDeDocumentos(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return PartnerHasFingerPrint
	 */
	@PutMapping
	public CategoriaDeDocumentos putData(@RequestBody final CategoriaDeDocumentos entity) {				
		logger.info("CategoriaDeDocumentos a actualizar: ["+entity.toString()+"]");		
		return service.updateCategoriaDeDocumentos(entity);
	}
	
	
}
