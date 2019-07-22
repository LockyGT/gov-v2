package com.solucionesdigitales.vote.controller.orderday;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.orderday.ElementParagraph;
import com.solucionesdigitales.vote.service.orderday.ElementParagraphService;


@RestController
@RequestMapping("elementParagraph")
public class ElementParagraphController {

	private static final Logger logger = LoggerFactory.getLogger(ElementParagraphController.class);

	@Autowired
	private ElementParagraphService service;


	@GetMapping
	public List<ElementParagraph> get(){
		logger.info("consulta Elementos de la Ordden del Dia:");
		return service.fetch();
	}
	
	
	
	@PostMapping
	public ElementParagraph postElementPargraph(@RequestBody final ElementParagraph entity) {
		logger.info("Elementos de la Ordden del Dia a Guardar: ["+entity.toString()+"]");
		return service.post(entity);
	}
	
	@PutMapping
	public ElementParagraph putElementParagraph(@RequestBody final ElementParagraph entity) {
		logger.info("Elementos de la Ordden del Dia a Actualizar: ["+entity.toString()+"]");
		return service.put(entity);
	}
	
//	@PutMapping(value="/delete")
//	public ElementParagraph deleteElementOd(@RequestBody final ElementOd entity) {
//		logger.info("Elementos de la Ordden del Dia a Eliminar: ["+entity.toString()+"]");
//		return service.delete(entity);
//	}
	
}
	
