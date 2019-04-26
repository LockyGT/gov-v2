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

import com.solucionesdigitales.vote.entity.Attendance;
import com.solucionesdigitales.vote.service.AttendanceService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("attendance")
public class AttendanceController {
	private static final Logger logger = LoggerFactory.getLogger(AttendanceController.class);	
	
	@Autowired
	private AttendanceService service;
	
	/**
	 * 
	 * @return List<Attendance>
	 */
	@GetMapping
	public List<Attendance> get() {
		logger.info("consulta attendance:");
		return service.fetch();
	}	
	
	/**
	 * INICIATIVAS
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="/initiative" , params ="initiativeId")	
	public List<Attendance> fetchByInitiative(@RequestParam(value="initiativeId")  final String initiativeId){
		logger.info("consulta de Attendance por iniciativaId");
		List<Attendance> lista = service.fetchByInitiativeId(initiativeId);
		return  lista;
	}
	
	/**
	 * 
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="/voteSession" , params ="voteSessionId")	
	public List<Attendance> fetchByVoteSessionId(@RequestParam(value="voteSessionId")  final String voteSessionId){
		logger.info("consulta de Attendance por voteSessionId");
		List<Attendance> lista = service.fetchByVoteSessionId(voteSessionId);
		return  lista;
	}
	
	/**
	 * 
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="/initiative/partner" , params = {"initiativeId", "partnerId"})	
	public List<Attendance> fetchByInitiativeIdAndPartnerId(@RequestParam(value="initiativeId")  final String initiativeId, @RequestParam(value="partnerId")  final String partnerId){
		logger.info("consulta de Attendance por iniciativaID and partnerId");
		List<Attendance> lista = service.fetchByInitiativeIdAndPartnerId(initiativeId, partnerId);
		return  lista;
	}
	
	/**
	 * 
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="/voteSession/partner" , params = {"voteSessionId", "partnerId", "attendanceNumber"})	
	public List<Attendance> fetchByVoteSessionIdAndPartnerId(@RequestParam(value="voteSessionId")  final String voteSessionId
			, @RequestParam(value="partnerId")  final String partnerId
			, @RequestParam(value="attendanceNumber")  final int attendanceNumber){
		logger.info("consulta de Attendance por voteSessionId and partnerId" + voteSessionId );
		logger.info("consulta de Attendance por voteSessionId and partnerId" + partnerId );
		logger.info("consulta de Attendance por voteSessionId and partnerId" + attendanceNumber );
//		List<Attendance> lista = service.fetchByVoteSessionIdAndPartnerId(voteSessionId, partnerId);
		List<Attendance> lista = service.fetchByVoteSessionIdAndVoteSessionNumberAttendanceAndPartnerId(voteSessionId,attendanceNumber, partnerId);
		return  lista;
	}
	
	/**
	 * 
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="/voteSession/isnotnull/partner" , params = {"partnerId"})	
	public List<Attendance> findByVoteSessionIsNotNullAndPartnerId( @RequestParam(value="partnerId")  final String partnerId){
		logger.info("consulta de Attendance por voteSessionId and partnerId");
		List<Attendance> lista = service.findByVoteSessionIsNotNullAndPartnerId(partnerId);
		return  lista;
	}
	
	/**
	 * 
	 * @param entity
	 * @return Attendance
	 */
	@PostMapping
	public Attendance postData(@RequestBody Attendance entity) {
		logger.info("attendance a guardar: [" + entity.toString() + "]");
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return Attendance
	 */
	@PutMapping
	public Attendance putData(@RequestBody Attendance entity) {
		logger.info("attendance a actualizar: [" + entity.toString() + "]");
		return service.put(entity);
	}
	
	
	
	/**
	 * 
	 * @param entity
	 * @return Attendance
	 */
	@PostMapping(value="/day")
	public Attendance postAttendanceDay(@RequestBody Attendance entity) {
		logger.info("attendance a guardar del dia: [" + entity.toString() + "]");
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

		Attendance att = service.fetchByPartnerIdAndDate(entity.getPartner().getId(), ldt1, ldt1.plusDays(1));
		if (att != null && att.getId().trim().length() > 0) {
			logger.info("YA SE INSERTO POR PRIMERA VEZ LA ASISTENCIA ......................... ");
		
		}else {
			logger.info("SE INSERTA POR PRIMERA VEZ LA ASISTENCIA ......................... ");
			att = service.post(entity);
		}
			
		return  att;
	}

	/**e
	 * 
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="/betweendates" , params = {"date1" ,"date2"} )	
	public List<Attendance> fetchByDates(@RequestParam(value="date1")  @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date1 
										, @RequestParam(value="date2") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date2){
		logger.info("consulta de Attendance porDATES ");
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
		List<Attendance> lista = service.findAllByDateTimeBetween(ldt1,ldt2.plusDays(1));
		logger.info("Lista Attendance: " + lista.size());
		return  lista;
	}
	
	/**e
	 * 
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="/betweendatesandsesion" , params = {"date1" ,"date2"} )	
	public List<Attendance> fetchByDatesAndSesion(@RequestParam(value="date1")  @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date1 
										, @RequestParam(value="date2") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date2){
		logger.info("consulta de Attendance porDATES ");
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
		List<Attendance> lista = service.findAllByDateTimeBetweenWithSesion(ldt1,ldt2.plusDays(1));
		logger.info("Lista Attendance: " + lista.size());
		return  lista;
	}
	
	
	

	/**e
	 * 
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="/sesionbetweendates" , params = {"date1" ,"date2"} )	
	public List<Attendance> findAttendanceSesionByDateTimeBetween(@RequestParam(value="date1")  @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date1 
										, @RequestParam(value="date2") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date2){
		logger.info("consulta de Attendance porDATES ");
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
		List<Attendance> lista = service.findAttendanceSesionByDateTimeBetween(ldt1,ldt2.plusDays(1));
		logger.info("Lista Attendance: " + lista.size());
		return  lista;
	}
	
	/**e
	 * 
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="dates/status/byPartnerid/sessionNotNull" , params = {"date1" ,"date2"} )	
	public List<Attendance> findAllByDateTimeBetweenAndStatusAndPartnerIdAndVoteSessionIsNotNull(@RequestParam(value="date1")  @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date1 
										, @RequestParam(value="date2") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date2, @RequestParam(value="partnerId")  final String partnerId, @RequestParam(value="status")  final int status ){
		logger.info("consulta de Attendance porDATES ");
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
		List<Attendance> lista = service.findAllByDateTimeBetweenAndStatusAndPartnerIdAndVoteSessionIsNotNull(ldt1,ldt2.plusDays(1), status, partnerId);
		logger.info("Lista Attendance: " + lista.size());
		return  lista;
	}
	
	/**e
	 * 
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="/sessionsbydatetime" , params = {"date1" ,"date2"} )	
	public List<Attendance> findAttendancesSessionsByDateTime(@RequestParam(value="date1")  @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date1 
										, @RequestParam(value="date2") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime date2){
		logger.info("findAttendancesSessionsByDateTime");
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
		List<Attendance> lista = service.findAttendancesSessionsByDateTime(ldt1,ldt2.plusDays(1));
		logger.info("Lista Attendance: " + lista.size());
		return  lista;
	}
	
	
	/**
	 * 
	 * @param initiativeId
	 * @return List<Attendance>
	 */
	@GetMapping(value="/voteSession/attendanceNumber" , params = {"voteSessionId", "attendanceNumber"})	
	public List<Attendance> fetchByVoteSessionIdAndAttendanceNumber(@RequestParam(value="voteSessionId")  final String voteSessionId, @RequestParam(value="attendanceNumber")  final int attendanceNumber){
		logger.info("consulta de Quorum fetchByVoteSessionIdAndAttendanceNumber ");
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
		List<Attendance> lista = service.findAttendanceListBySession(voteSessionId, attendanceNumber);
		logger.info("Lista Attendance: " + lista.size());
		return  lista;
	}
	
	
}
