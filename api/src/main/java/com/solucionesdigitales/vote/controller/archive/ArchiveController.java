package com.solucionesdigitales.vote.controller.archive;

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

import com.solucionesdigitales.vote.entity.archive.Archive;
import com.solucionesdigitales.vote.service.module.archive.ArchiveService;

/**
 * 
 * @author israel
 *
 */

@RestController
@RequestMapping("archivo")
public class ArchiveController {
	
	private static final Logger logger = LoggerFactory.getLogger(ArchiveController.class);
	
	@Autowired
	private ArchiveService service;
	
	@GetMapping
	public List<Archive> get(){
		logger.info("Consulta de archivos");
		return service.fetch();
	}
	
	@PostMapping
	public Archive postData(@RequestBody final Archive entity) {
		logger.info("Archivo a guardar ["+entity.toString()+"]");
		
		return service.post(entity);
	}
	
	@PutMapping
	public Archive putData(@RequestBody final Archive entity) {
		logger.info("Archivo a actualizar: ["+entity.toString()+"]");
		return service.put(entity);
	}
	
	@PutMapping(value="/delete")
	public Archive deleteData(@RequestBody final Archive entity) {
		logger.info("Archivo a eliminar: ["+entity.toString()+"]");
		return service.delete(entity);
	}
}
