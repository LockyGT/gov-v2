package com.solucionesdigitales.vote.controller.partner;

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
import com.solucionesdigitales.vote.entity.partner.DocumentoPartner;
import com.solucionesdigitales.vote.service.partner.DocumentoPartnerService;


@RestController
@RequestMapping("documentoPartner")
public class DocumentPartnerController {
	
	private static final Logger logger = LoggerFactory.getLogger(DocumentPartnerController.class);
	
	@Autowired
	private DocumentoPartnerService service;
	
	/**
	 * 
	 * @return List<PartnerHasFingerPrint>
	 */
	@GetMapping
	public List<DocumentoPartner> get(@RequestParam(value="idPartner") final String idPartner){
		logger.info("DocumentoPartner get");
		return service.getDocumentos(idPartner);
	}
	
	
	@PostMapping
	public DocumentoPartner postData(@RequestBody final DocumentoPartner entity) {				
		logger.info("Organigrama a guardar: ["+entity.toString()+"]");		
		return service.saveDocumentoPartner(entity);
	}
	
	/**
	 *  
	 * @param entity
	 * @return PartnerHasFingerPrint
	 */
	@PutMapping
	public DocumentoPartner putData(@RequestBody final DocumentoPartner entity) {				
		logger.info("Organigrama a actualizar: ["+entity.toString()+"]");		
		return service.updateDocumentoPartner(entity);
	}
	
}
