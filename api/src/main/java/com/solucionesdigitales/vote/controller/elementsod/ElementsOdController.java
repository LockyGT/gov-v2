package com.solucionesdigitales.vote.controller.elementsod;

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
import com.solucionesdigitales.vote.service.elementsod.ElementsOdService;


@RestController
@RequestMapping("elementOd")
public class ElementsOdController {

	private static final Logger logger = LoggerFactory.getLogger(ElementsOdController.class);

	@Autowired
	private ElementsOdService service;


	@GetMapping
	public List<ElementOd> get(){
		logger.info("consulta Elementos de la Ordden del Dia:");
		return service.fetch();
	}
	
	@PostMapping
	public ElementOd postElementOD(@RequestBody final ElementOd entity) {
		logger.info("Elementos de la Ordden del Dia a Guardar: ["+entity.toString()+"]");
		return service.post(entity);
	}
	
	@PutMapping
	public ElementOd putElementOD(@RequestBody final ElementOd entity) {
		logger.info("Elementos de la Ordden del Dia a Actualizar: ["+entity.toString()+"]");
		return service.put(entity);
	}
	
	@PutMapping(value="/delete")
	public ElementOd deleteElementOD(@RequestBody final ElementOd entity) {
		logger.info("Elementos de la Ordden del Dia a Eliminar: ["+entity.toString()+"]");
		return service.delete(entity);
	}
}
	