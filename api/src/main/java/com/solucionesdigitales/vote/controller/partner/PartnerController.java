package com.solucionesdigitales.vote.controller.partner;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.service.partner.PartnerService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("partner")
public class PartnerController {
	
	private static final Logger logger = LoggerFactory.getLogger(PartnerController.class);
	
	@Autowired
	private PartnerService service;
	
	/**
	 * 
	 * @return List<Partner>
	 */
	@GetMapping
	public List<Partner> get(){
		logger.info("consulta partner:");
		return service.fetch();
	}
	
	/**
	 * 
	 * @return List<Partner>
	 */
	@GetMapping(value="/byStatus")
	public List<Partner> getByStatus(@RequestParam(value="status") final int status){
		logger.info("consulta partner:");
		return service.fetchByStatus(status);
	}
	
	/**
	 * 
	 * @return List<Partner>
	 */
	@GetMapping(value="/byStatus/init")
	public Object getByStatusDataInitialize(@RequestParam(value="status") final int status){
		logger.info("consulta partner:");
		Partner p = service.fetchOneByStatus(status);
		Map<String, String> mapa = new HashMap<>();
		if(p != null && p.getId() != null && !p.getId().isEmpty()) {
			mapa.put("mensaje", "forbidden");
		}else {
			mapa.put("mensaje", "allowed");
		}		
		return  mapa;
	}
	
	/**
	 * 
	 * @param sku
	 * @return Partner
	 */
	@GetMapping(value="/bySku")
	public Partner getBySku(@RequestParam(value="sku") final int sku){
		logger.info("consulta partner:");	
		return service.fetchBySku(sku);
	}
	
	@GetMapping(value="/byUsername")
	public Partner getByUsername(@RequestParam(value="username") final String username){
		logger.info("consulta partner por username:");	
		return service.findByUserUsername(username);
	}
	
	@GetMapping(value="/byUsername/init")
	public Object getByUsernameInit(@RequestParam(value="username") final String username){
		logger.info("consulta partner por username:");	
		Partner p = service.findByUserUsername(username);
		Map<String, String> resp = new HashMap<String, String>();
		if(p != null && p.getId() != null && !p.getId().isEmpty()) {
			resp.put("mensaje", "valid");
		}else {
			resp.put("mensaje", "invalid");
		}
		return resp;
	}
	
	/**
	 * 
	 * @param entity
	 * @return Partner
	 */
	@PostMapping
	public Partner postData(@RequestBody final Partner entity) {				
		logger.info("partner a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return Partner
	 */
	@PutMapping
	public Partner putData(@RequestBody final Partner entity) {				
		logger.info("partner a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
}
