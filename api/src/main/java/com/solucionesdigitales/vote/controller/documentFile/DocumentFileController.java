package com.solucionesdigitales.vote.controller.documentFile;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.documentfile.DocumentFile;
import com.solucionesdigitales.vote.service.module.documentfile.DocumentFileService;

/**
 * 
 * @author israel
 *
 */

@RestController
@RequestMapping("documentFile")
public class DocumentFileController {
	
	private static final Logger logger = LoggerFactory.getLogger(DocumentFileController.class);
	
	@Autowired
	private DocumentFileService service;
	
	@GetMapping
	public List<DocumentFile> get(@RequestParam(value="status") final int status,
			@RequestParam(value="moduloodid") final String moduloodId,
			@RequestParam(value="moduloodstatus") final int moduloodStatus){
		logger.info("Consulta de archivos");
		return service.fetch(status,moduloodId,moduloodStatus);
	}
	
	@GetMapping(value="/between-dates")
	public List<DocumentFile> getBetweenDates(@RequestParam(value="status") final int status,
			@RequestParam(value="moduloodid") final String moduloodId,
			@RequestParam(value="moduloodstatus") final int moduloodStatus,
			@RequestParam(value="datestart") @DateTimeFormat(pattern="yyyy/MM/dd") Date dateStart,
			@RequestParam(value="dateend") @DateTimeFormat(pattern="yyyy/MM/dd") Date dateEnd){
		logger.info("Consulta de archivos por fechas "+dateStart+" y "+dateEnd);
		
		return service.fetchByBetweenDates(status,moduloodId,moduloodStatus, dateStart,dateEnd);
	}
	
	@PostMapping
	public DocumentFile postData(@RequestBody final DocumentFile entity) {
		logger.info("Archivo a guardar ["+entity.toString()+"]");
		
		return service.post(entity);
	}
	
	@PutMapping
	public DocumentFile putData(@RequestBody final DocumentFile entity) {
		logger.info("Archivo a actualizar: ["+entity.toString()+"]");
		return service.put(entity);
	}
	
	@PutMapping(value="/delete")
	public DocumentFile deleteData(@RequestBody final DocumentFile entity) {
		logger.info("Archivo a eliminar: ["+entity.toString()+"]");
		return service.delete(entity);
	}
}
