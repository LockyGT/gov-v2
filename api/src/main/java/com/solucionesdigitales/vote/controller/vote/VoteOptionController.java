package com.solucionesdigitales.vote.controller.vote;

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

import com.solucionesdigitales.vote.entity.vote.VoteOption;
import com.solucionesdigitales.vote.service.vote.VoteOptionService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("voteoption")
public class VoteOptionController {
	
	private static final Logger logger = LoggerFactory.getLogger(VoteOptionController.class);
	
	@Autowired
	private VoteOptionService service;
	
	/**
	 * 
	 * @return List<VoteOption>
	 */
	@GetMapping
	public List<VoteOption> get(){
		logger.info("consulta iniciativas:");	
		List<VoteOption> lista  = service.fetch();
		return lista;
	}
	
	/**
	 * 
	 * @param entity
	 * @return VoteOption
	 */
	@PostMapping
	public VoteOption postData(@RequestBody VoteOption entity) {				
		logger.info("Iniciativa a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return VoteOption
	 */
	@PutMapping
	public VoteOption putData(@RequestBody VoteOption entity) {				
		logger.info("Iniciativa a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
}
