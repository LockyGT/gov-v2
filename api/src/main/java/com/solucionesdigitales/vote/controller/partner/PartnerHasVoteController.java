package com.solucionesdigitales.vote.controller.partner;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.partner.PartnerHasVote;
import com.solucionesdigitales.vote.service.partner.PartnerHasVoteService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("partnerhasvote")
public class PartnerHasVoteController {
	
	private static final Logger logger = LoggerFactory.getLogger(PartnerHasVoteController.class);
	
	@Autowired
	private PartnerHasVoteService service;
	
	/**
	 * 
	 * @return List<PartnerHasVote>
	 */
	@GetMapping
	public List<PartnerHasVote> get(){
		logger.info("consulta partnerhasvote:");
		return service.get();
	}
	
	/**
	 * 
	 * @return List<PartnerHasVote>
	 */
	@GetMapping(value="/voteSession" , params ="voteSessionId")
	public List<PartnerHasVote> getByVoteSessionId(@RequestParam(value="voteSessionId") final String voteSessionId){
		logger.info("consulta partnerhasvote:");
		return service.fetchByVoteSessionId(voteSessionId);
	}
	
}
