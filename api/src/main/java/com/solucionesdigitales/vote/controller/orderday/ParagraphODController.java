package com.solucionesdigitales.vote.controller.orderday;

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

import com.solucionesdigitales.vote.entity.elementsod.ElementOd;
import com.solucionesdigitales.vote.entity.orderday.ParagraphOD;
import com.solucionesdigitales.vote.service.orderday.ParagraphODService;

@RestController
@RequestMapping("paragraph")
public class ParagraphODController {

private static final Logger logger = LoggerFactory.getLogger(ParagraphODController.class);
	
	@Autowired
	private ParagraphODService service;
	
	
	@GetMapping
	public List<ParagraphOD> get(){
		logger.info("consulta Paragraph:");
		return service.fetch();
	}
	@GetMapping(value="/status")
	public List<ParagraphOD> getByStatus(){
		logger.info("consulta Elementos de la Ordden del Dia:");
		return service.getByStatus();
	}
	
	@PostMapping
	public ParagraphOD postData(@RequestBody final ParagraphOD entity) {				
		logger.info("Paragraph a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}
	
	@PutMapping
	public ParagraphOD putData(@RequestBody final ParagraphOD entity) {				
		logger.info("Paragraph a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
	
	@PutMapping(value="/delete/")
	public ParagraphOD deleteParagraphtOd(@RequestBody final ParagraphOD entity) {
		logger.info("Los parrafos de la Ordden del Dia a Eliminar: ["+entity.toString()+"]");
		return service.delete(entity);
	}
}
