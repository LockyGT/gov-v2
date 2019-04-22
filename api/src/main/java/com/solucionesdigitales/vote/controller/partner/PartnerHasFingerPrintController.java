package com.solucionesdigitales.vote.controller.partner;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.partner.PartnerHasFingerPrint;
import com.solucionesdigitales.vote.service.partner.PartnerHasFingerPrintService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("partner/fingerprint")
public class PartnerHasFingerPrintController {
	
	private static final Logger logger = LoggerFactory.getLogger(PartnerHasFingerPrintController.class);
	
	@Autowired
	private PartnerHasFingerPrintService service;
	
	/**
	 * 
	 * @return List<PartnerHasFingerPrint>
	 */
	@GetMapping
	public List<PartnerHasFingerPrint> get(){
		logger.info("consulta huellas:");	
		return service.fetch();
	}
	
	/**
	 * 
	 * @param id
	 * @return List<PartnerHasFingerPrint>
	 */
	@GetMapping(value="/partner/{partnerId}")
	public List<PartnerHasFingerPrint> getByPartnerId(@PathVariable(value="partnerId") final String id){
		logger.info("consulta huellas por partnerId:" + id);	
		return service.fetchByLegislatorId(id);
	}
	
	@GetMapping(value="/partner/{partnerId}/status/{status}")
	public List<PartnerHasFingerPrint> getByPartnerIdAndStatus(@PathVariable(value="partnerId") final String id, @PathVariable(value="status") final int status){
		logger.info("consulta huellas por partnerId and status:" + id);	
		return service.fetchByPartnerIdAndStatus(id, status);
	}
	
	@PostMapping
	public PartnerHasFingerPrint postData(@RequestBody final PartnerHasFingerPrint entity) {				
		logger.info("huella a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return Object
	 */
	@PostMapping(value = "/verify")
	public Object postDataVerifyFingerPrint(@RequestBody PartnerHasFingerPrint entity) {
		logger.info("Huella a validar: [" + entity.toString() + "]");
		String resp = service.identify(entity) ? "valida" : "invalida";
		Map<String, String> resp2 = new HashMap<String, String>();
		resp2.put("mensaje", resp);
		return resp2;
	}
	
	/**
	 * 
	 * @param entity
	 * @return Partner
	 */
	@PostMapping(value = "/sku/verify")
	public Partner postDataVerifyFingerPrintWithSku(@RequestBody PartnerHasFingerPrint entity) {
		logger.info("Huella a validar: [" + entity.toString() + "]");
		return service.identifySkuOnly(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return
	 */
	@PostMapping(value = "/username/verify")
	public Partner postDataVerifyFingerPrintWithUsername(@RequestBody PartnerHasFingerPrint entity) {
		logger.info("Huella a validar: [" + entity.toString() + "]");
		return service.identifyUsernameOnly(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return PartnerHasFingerPrint
	 */
	@PutMapping
	public PartnerHasFingerPrint putData(@RequestBody final PartnerHasFingerPrint entity) {				
		logger.info("huella a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
	
	
	@PutMapping(value="partner/{partnerId}/index/{index}")
	public Object putDataToDelete(@PathVariable(value="partnerId") final String partnerId, @PathVariable(value="index") final int index) {				
		logger.info("huella a actualizar para borrado logico: ["+index+"]");		
		service.putToDelete(partnerId, index);
		Map<String, String> resp = new HashMap<>();
		resp.put("mensaje", "huellaBorrada");
		return resp;
	}
}
