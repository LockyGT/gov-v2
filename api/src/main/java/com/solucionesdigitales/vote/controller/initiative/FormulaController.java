package com.solucionesdigitales.vote.controller.initiative;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.initiative.Formula;
import com.solucionesdigitales.vote.service.initiative.FormulaService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("formula")
public class FormulaController {
	
	private static final Logger logger = LoggerFactory.getLogger(FormulaController.class);
	
	@Autowired
	private FormulaService service;
	
	/**
	 * 
	 * @return List<Formula>
	 */
	@GetMapping
	public List<Formula> get(){
		logger.info("consulta formulas:");	
		return service.fetchFormulas();
	}	
	
}
