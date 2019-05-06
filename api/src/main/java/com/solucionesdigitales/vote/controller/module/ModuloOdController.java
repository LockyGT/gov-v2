package com.solucionesdigitales.vote.controller.module;

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

import com.solucionesdigitales.vote.entity.module.ModuloOd;
import com.solucionesdigitales.vote.service.module.ModuloOdService;

/**
 * 
 * @author israel
 *
 */
@RestController
@RequestMapping("modulood")
public class ModuloOdController {
	
	private static final Logger logger = LoggerFactory.getLogger(ModuloOdController.class);
	
	@Autowired
	private ModuloOdService service;
	
	/**
	 * 
	 * @return List<ModuloOd>
	 */
	@GetMapping
	public List<ModuloOd> get() {
		logger.info("Consulta modulos por dia: ");
		return service.fetch();
	}
	
	@GetMapping(value="/byId")
	public ModuloOd getById(@RequestParam(value="id") final String id) {
		logger.info("Consulta modulos por dia: ");
		return service.findFirstById(id);
	}
	
	@PostMapping
	public ModuloOd postData(@RequestBody final ModuloOd entity) {
		logger.info("Orden del dia a guardar: ["+entity.toString()+"]");
		return service.post(entity);
	}
	
	@PutMapping
	public ModuloOd putData(@RequestBody final ModuloOd entity) {
		logger.info("Orden del dia a actualizar: ["+entity.toString()+"]");
		return service.put(entity);
	}
	@PutMapping(value="/delete")
	public ModuloOd deleteData(@RequestBody final ModuloOd entity) {
		logger.info("Orden del dia a eliminar: ["+entity.toString()+"]");
		return service.delete(entity);
	}
}
