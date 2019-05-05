package com.solucionesdigitales.vote.controller.vote;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.vote.VoteSessionType;
import com.solucionesdigitales.vote.service.vote.VoteSessionTypeService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("voteSessionType")
public class VoteSessionTypeController {
	
	private static final Logger logger = LoggerFactory.getLogger(VoteSessionTypeController.class);
	
	@Autowired
	private VoteSessionTypeService service;
	
	/**
	 * 
	 * @return List<VoteSessionType>
	 */
	@GetMapping
	public List<VoteSessionType> get(){
		logger.info("consulta Tipos de Voto:");	
		List<VoteSessionType> list = service.fetch();
		if (list == null || list.size() == 0) { // Solo se mandan a insertar si no existen 
			VoteSessionType tipo1 = new VoteSessionType();
			tipo1.setName("Ordinaria");
			VoteSessionType tipo2 = new VoteSessionType();
			tipo2.setName("Extraordinaria");
			service.post(tipo1);
			service.post(tipo2);
			list = service.fetch();
		}
		return list;
	}
}
