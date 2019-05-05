package com.solucionesdigitales.vote.controller;

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

import com.solucionesdigitales.vote.entity.Quorum;
import com.solucionesdigitales.vote.entity.QuorumResets;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.service.QuorumResetsService;
import com.solucionesdigitales.vote.service.QuorumService;
import com.solucionesdigitales.vote.service.partner.PartnerService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("quorum")
public class QuorumController {
	private static final Logger logger = LoggerFactory.getLogger(QuorumController.class);	
	
	@Autowired
	private QuorumService service;
	@Autowired
	private QuorumResetsService serviceResets;
	@Autowired
	private PartnerService servicePartner;
	/**
	 * 
	 * @return List<Quorum>
	 */
	@GetMapping
	public List<Quorum> get() {
		logger.info("consulta attendance:");
		return service.fetch();
	}	
	
	/**
	 * 
	 * @param entity
	 * @return Attendance
	 */
	@PostMapping
	public Quorum postData(@RequestBody Quorum entity) {
		logger.info("Quorum a guardar: [" + entity.toString() + "]");
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return Attendance
	 */
	@PutMapping
	public Quorum putData(@RequestBody Quorum entity) {
		logger.info("Quorum a actualizar: [" + entity.toString() + "]");
		return service.put(entity);
	}
	
	
	
	/**
	 * 
	 * @param entity
	 * @return Quorum
	 */
	@PostMapping(value="/day")
	public Quorum postQuorumDay(@RequestBody Quorum entity) {
		logger.info("Quorum a guardar del dia: [" + entity.toString() + "]");
	    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	    int dia= 0 , mes= 0 ,anio = 0 ;
	    dia = entity.getDateTime().getDayOfMonth();
	    mes = entity.getDateTime().getMonthValue();
	    anio = entity.getDateTime().getYear();
	    LocalDateTime ldt1 = LocalDateTime.parse(
	    		""+anio
	    		+"-"+(mes < 10 ? "0" + mes : mes)
	    		+"-"+(dia < 10 ? "0" + dia : dia)
	    		+ " 00:00:00", formatter);
//	    LocalDateTime ldt2 = LocalDateTime.parse(
//	    		""+anio
//	    		+"-"+(mes < 10 ? "0" + mes : mes)
//	    		+"-"+(dia < 10 ? "0" + dia : dia)
//	    		+ " 00:00:00", formatter);
	    logger.info("T1 " + ldt1);
	    logger.info("T2 "+ldt1.plusDays(1));

	    Quorum att = service.fetchByPartnerIdAndDate(entity.getPartner().getId(), ldt1, ldt1.plusDays(1));
		if (att != null && att.getId().trim().length() > 0) {
			logger.info("YA SE INSERTO POR PRIMERA VEZ LA ASISTENCIA Quorum......................... ");
		}else {
			QuorumResets qr = new QuorumResets();
			QuorumResets qrs = serviceResets.findByDateTimeBetweenAndStatus(ldt1, ldt1.plusDays(1), 1);
			if (qrs != null && qrs.getId() != null && qrs.getId().trim().length() > 0) {
				entity.setNumeroIntento(qrs.getNumeroReinicio());
			}else {
				entity.setNumeroIntento(1);
				qr.setStatus(1);
				qr.setDateTime(LocalDateTime.now());
				qr.setNumeroReinicio(1);
				serviceResets.post(qr);
			}
			logger.info("SE INSERTA POR PRIMERA VEZ LA ASISTENCIA Quorum......................... ");
			att = service.post(entity);
		}
			
		return  att;
	}

	/**e
	 * 
	 * @param initiativeId
	 * @return List<Quorum>
	 */
	@GetMapping(value="/betweendates" , params = {"date1" ,"date2"} )	
	public List<Quorum> fetchByDates(@RequestParam(value="date1")  @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date1 
										, @RequestParam(value="date2") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date2){
		logger.info("consulta de Quorum porDATES ");
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
		List<Quorum> lista = service.findAllByDateTimeBetween(ldt1,ldt2.plusDays(1));
		logger.info("Lista Attendance: " + lista.size());
		return  lista;
	}
	
	/**e
	 * 
	 * @param initiativeId
	 * @return List<Quorum>
	 */
	@GetMapping(value="/today")	
	public List<Quorum> fetchQuorumToday(){
		logger.info("consulta de Quorum fetchQuorumToday ");
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime date1 = LocalDateTime.now(); 
	    int dia= 0 , mes= 0 ,anio = 0;
	    
	    dia = date1.getDayOfMonth();
	    mes = date1.getMonthValue();
	    anio = date1.getYear();
	    LocalDateTime ldt1 = LocalDateTime.parse(
	    		""+anio
	    		+"-"+(mes < 10 ? "0" + mes : mes)
	    		+"-"+(dia < 10 ? "0" + dia : dia)
	    		+ " 00:00:00", formatter);
	    logger.info("T1 " + ldt1);
	    logger.info("T2 "+ldt1.plusDays(1));
		List<Quorum> lista = service.findQuorumToday(ldt1,ldt1.plusDays(1));
		logger.info("Lista Attendance: " + lista.size());
		return  lista;
	}
	
	/**e
	 * 
	 * @param initiativeId
	 * @return List<Quorum> 
	 */
	@GetMapping(value="/reiniciar" , params= {"partnerId"})	
	public List<Quorum>  reiniciarQuourum(@RequestParam(value="partnerId") final String partnerId){
		logger.info("Reinicia el Quorum del dia---->" + partnerId);
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		LocalDateTime date1 = LocalDateTime.now(); 
	    int dia= 0 , mes= 0 ,anio = 0;
	    
	    dia = date1.getDayOfMonth();
	    mes = date1.getMonthValue();
	    anio = date1.getYear();
	    LocalDateTime ldt1 = LocalDateTime.parse(
	    		""+anio
	    		+"-"+(mes < 10 ? "0" + mes : mes)
	    		+"-"+(dia < 10 ? "0" + dia : dia)
	    		+ " 00:00:00", formatter);
	    logger.info("T1 " + ldt1);
	    logger.info("T2 "+ldt1.plusDays(1));
		Partner p= servicePartner.fetchById(partnerId);
		return  service.reiniciarQuorum(ldt1,ldt1.plusDays(1),p);
	}
}
