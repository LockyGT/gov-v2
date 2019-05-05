package com.solucionesdigitales.vote.controller.vote;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.vote.VoteSession;
import com.solucionesdigitales.vote.service.vote.VoteSessionService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("votesession")
public class VoteSessionController {

	private static final Logger logger = LoggerFactory.getLogger(VoteSessionController.class);

	@Autowired
	private VoteSessionService service;

	/**
	 * 
	 * @return List<VoteSession>
	 */
	@GetMapping
	public List<VoteSession> get(){
		logger.info("consulta VOTE SESSION:");
		return service.fetchByDateAndStatus(LocalDateTime.now());
	}

	/**
	 * 
	 * @param id
	 * @return VoteSession
	 */
	@GetMapping(value="/{id}")
	public VoteSession getById(@PathVariable(value="id") final String id){
		return service.findById(id);
	}

	/**
	 * 
	 * @param status
	 * @return List<VoteSession>
	 */
	@GetMapping(value="/status")
	public List<VoteSession> getByStatus(@RequestParam(value="status") final int status){
		logger.info("consulta VOTE SESSION:");
		return service.fetchByStatus(status);
	}

	/**
	 * 
	 * @param fecha
	 * @return List<VoteSession>
	 */
	@GetMapping(value="/date" , params ="fecha")	
	public List<VoteSession> getByDate(@RequestParam(value="fecha") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime fecha){
		logger.info("consulta VOTE SESSION POR FECHA:" + fecha);		
		return service.fetchByDateAndStatus(fecha);
	}

	/**
	 * 
	 * @param fecha
	 * @return List<VoteSession>
	 */
	@GetMapping(value="/date/between" , params ="fecha")	
	public List<VoteSession> getByDateBetwen(@RequestParam(value="fecha") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime fecha){
		logger.info("consulta VOTE SESSION POR FECHA:" + fecha);	

		ZonedDateTime here = fecha.atZone(ZoneId.systemDefault());		
		logger.info("ZONEDDATE : " + here);
		int year  = here.getYear();
		int month = here.getMonthValue();
		int day   = here.getDayOfMonth();
		logger.info("day of the month : " + day);

		LocalDateTime t1 = LocalDateTime.of(year, month, day, 0, 0, 0, 0);
		LocalDateTime t2 = LocalDateTime.of(year, month, day, 23, 59, 59);
		logger.info("consulta VOTE SESSION POR FECHA1 ------> :" + t1);	
		logger.info("consulta VOTE SESSION POR FECHA2 ------> :" + t2);
		return service.findVoteSessionByFechaHoraBetwen(t1, t2);
	}

	/**
	 * 
	 * @param fecha
	 * @return List<VoteSession>
	 */
	@GetMapping(value="/date/between/end/between" , params ="fecha")	
	public List<VoteSession> getByDateBetwenEndBetween(@RequestParam(value="fecha") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime fecha, 
														@RequestParam(value="fechaFin") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime fechaFin){
		logger.info("consulta VOTE SESSION POR FECHA INICIO:" + fecha);	
		logger.info("consulta VOTE SESSION POR FECHA FIN:" + fechaFin);
		ZonedDateTime inicio = fecha.atZone(ZoneId.systemDefault());		
		logger.info("ZONEDDATE : " + inicio);
		int year  = inicio.getYear();
		int month = inicio.getMonthValue();
		int day   = inicio.getDayOfMonth();
		
		ZonedDateTime fin = fechaFin.atZone(ZoneId.systemDefault());		
		logger.info("ZONEDDATE : " + inicio);
		int yearEnd  = fin.getYear();
		int monthEnd = fin.getMonthValue();
		int dayEnd   = fin.getDayOfMonth();

		LocalDateTime t1 = LocalDateTime.of(year, month, day, 0, 0, 0, 0);
		LocalDateTime t2 = LocalDateTime.of(yearEnd, monthEnd, dayEnd, 23, 59, 59);
		logger.info("consulta VOTE SESSION POR FECHA1 ------> :" + t1);	
		logger.info("consulta VOTE SESSION POR FECHA2 ------> :" + t2);
		return service.findVoteSessionByFechaHoraBetwen(t1, t2);
	}
	
	/**
	 * 
	 * @param status
	 * @return List<VoteSession>
	 */
	@GetMapping(value="/attendance/status")
	public List<VoteSession> getByOnAttendanceStatus(@RequestParam(value="status") final boolean status){
		logger.info("consulta VOTE SESSION:");
		return service.fetchByIsAttendanceOpen(status);
	}

	/**
	 * 
	 * @param entity
	 * @return VoteSession
	 */
	@PostMapping
	public VoteSession postData(@RequestBody VoteSession entity) {				
		logger.info("VOTE SESSION a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}

	/**
	 * 
	 * @param entity
	 * @return VoteSession
	 */
	@PutMapping
	public VoteSession putData(@RequestBody VoteSession entity) {				
		logger.info("VOTE SESSION a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
}
