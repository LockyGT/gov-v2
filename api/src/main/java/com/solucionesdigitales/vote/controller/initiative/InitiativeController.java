package com.solucionesdigitales.vote.controller.initiative;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.service.initiative.InitiativeService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("iniciativa")
public class InitiativeController {
	
	private static final Logger logger = LoggerFactory.getLogger(InitiativeController.class);
	
	@Autowired
	private InitiativeService service;
	
	/**
	 * 
	 * @return List<Initiative>
	 */
	@GetMapping
	public List<Initiative> get(){
		logger.info("consulta iniciativas:");	
		return service.fetchInitiatives();
	}
	
	/**
	 * 
	 * @param closed
	 * @param status
	 * @return List<Initiative>
	 */
	@GetMapping(value="/isclosed/status")
	public List<Initiative> findByIsClosedAndStatus(@RequestParam(value="closed") final boolean closed, @RequestParam(value="status") final int status){
		logger.info("consulta iniciativas abiertas en votacion:");	
		return service.findByIsClosedAndStatus(closed, status);
	}
	
	/**
	 * 
	 * @param entity
	 * @return Initiative
	 */
	@PostMapping
	public Initiative postData(@RequestBody Initiative entity) {				
		logger.info("Iniciativa a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entities
	 * @return List<Initiative>
	 */
	@PostMapping(value="/all")
	public List<Initiative> postArrayData(@RequestBody List<Initiative> entities) {				
		logger.info("Iniciativa a guardar: ["+entities.toString()+"]");		
		return service.postArray(entities);
	}
	
	/**
	 * 
	 * @param entity
	 * @return Initiative
	 */
	@PutMapping
	public Initiative putData(@RequestBody Initiative entity) {				
		logger.info("Iniciativa a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
	
	/**
	 * 
	 * @param closed
	 * @param status
	 * @param date1
	 * @param date2
	 * @return
	 */
	@GetMapping(value="/isclosed/status/datebetween" , params = {"closed","status","date1" ,"date2"} )	
	public List<Initiative> fetchByIsClosedAndStatusAndDates(@RequestParam(value="closed") final boolean closed
									,@RequestParam(value="status") final int status
									,@RequestParam(value="date1")  @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date1 
									, @RequestParam(value="date2") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date2){
		logger.info("Consulta fetchByIsClosedAndStatusAndDates ");
		logger.info("T1 " + date1);
		logger.info("T2 "+date2);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	    int dia= 0 , mes= 0 ,anio = 0,dia2= 0 , mes2= 0 ,anio2 = 0 ;
	    dia = date1.getDayOfMonth();
	    mes = date1.getMonthValue();
	    anio = date1.getYear();
	    LocalDateTime ldt1 = LocalDateTime.parse(
	    		""+anio
	    		+"-"+(mes < 10 ? "0" + mes : mes)
	    		+"-"+(dia < 10 ? "0" + dia : dia)
	    		+ " 00:00:00", formatter);
	    
	    dia2 = date2.getDayOfMonth();
	    mes2 = date2.getMonthValue();
	    anio2 = date2.getYear();
	    LocalDateTime ldt2 = LocalDateTime.parse(
	    		""+anio2
	    		+"-"+(mes2 < 10 ? "0" + mes2 : mes2)
	    		+"-"+(dia2 < 10 ? "0" + dia2 : dia2)
	    		+ " 00:00:00", formatter);
	    logger.info("T1 " + ldt1);
	    logger.info("T2 "+ldt2.plusDays(1));
		List<Initiative> lista = service.fetchByIsClosedAndStatusAndDates(closed, status,ldt1,ldt2.plusDays(1));
		logger.info("Lista Attendance: " + lista.size());
		return  lista;
	}
}
