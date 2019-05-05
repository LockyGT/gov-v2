package com.solucionesdigitales.vote.controller.vote;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.vote.Vote;
import com.solucionesdigitales.vote.service.vote.VoteService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("vote")
public class VoteController {
	
	private static final Logger logger = LoggerFactory.getLogger(VoteController.class);
	
	@Autowired
	private VoteService service;
	
	/**
	 * 
	 * @return List<Vote>
	 */
	@GetMapping
	public List<Vote> get(){
		logger.info("consulta iniciativas:");	
		return service.fetch();
	}
	
	/**
	 * 
	 * @param entity
	 * @return Vote
	 */
	@PostMapping
	public Vote postData(@RequestBody Vote entity) {				
		logger.info("Iniciativa a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return Vote
	 */
	@PutMapping
	public Vote putData(@RequestBody Vote entity) {				
		logger.info("Iniciativa a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
	
	/**
	 * 
	 * @param initiativeId
	 * @param partnerId
	 * @return List<Vote>
	 */
	@GetMapping(value="/initiative/{initiativeId}/partner/{partnerId}")
	public List<Vote> fetchByInitiativeAndLegislator(@PathVariable(value="initiativeId") final String initiativeId, @PathVariable(value="partnerId") final String partnerId){
		logger.info("consulta de voto en iniciativa con partnerId que haya votado:");	
		return service.fetchByInitiativeAndLegislator(initiativeId, partnerId);
	}
	
	/**
	 * 
	 * @param initiativeId
	 * @return List<Vote>
	 */
	@GetMapping(value="/initiative" , params ="initiativeId")	
	public List<Vote> fetchByInitiative(@RequestParam(value="initiativeId")  final String initiativeId){
		logger.info("consulta de votos por iniciativa:");
		List<Vote> lista = service.fetchByInitiative(initiativeId);
		return  lista;
	}
	
	/**
	 * 
	 * @param partnerId
	 * @return List<Vote>
	 */
	@GetMapping(value="/partner" , params ="partnerId")	
	public List<Vote> fetchByLegislator(@RequestParam(value="partnerId")  final String partnerId){
		logger.info("consulta de votos por partnerId:");
		List<Vote> lista = service.fetchByLegislator(partnerId);
		return  lista;
	}
}
