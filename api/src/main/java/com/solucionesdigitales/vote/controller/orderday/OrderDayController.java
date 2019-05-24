package com.solucionesdigitales.vote.controller.orderday;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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

import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.service.orderday.OrderDayService;

@RestController
@RequestMapping("orderday")
public class OrderDayController {

	private static final Logger logger = LoggerFactory.getLogger(OrderDayController.class);

	@Autowired
	private OrderDayService service;


	@GetMapping
	public List<OrderDay> get(){
		logger.info("consulta Orden del dia:");
		return service.fetch();
	}

	@GetMapping(value="active/reference/with/without")
	public List<OrderDay> getActiveWithAndWithoutReference(){
		logger.info("consulta Order Day:");
		return service.getActiveWithAndWithoutReference();
	}

	@GetMapping(value="/status/reference/with/without")
	public List<OrderDay> getSustituidaWithReference(){
		logger.info("consulta de Versiones de Orden del dia:");
		return service.getSustituidaWithReference();
	}

	@GetMapping(value="/odOriginal")
	public List<OrderDay> getOdOriginal(@RequestParam(value="odOriginal") final String odOriginal){
		logger.info("Consulta de versiones");
		return service.getOdOriginal(odOriginal);
	}

	@GetMapping(value="/date/between" )	
	public List<OrderDay> getByDateBetween(@RequestParam(value="fecha") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime fecha, 
			@RequestParam(value="fechaFin") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime fechaFin){
		logger.info("consulta ORDEN DEL DIA POR FECHA INICIO:" + fecha);	
		logger.info("consulta ORDENDEL DIA POR FECHA FIN:" + fechaFin);

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

		LocalDateTime l1 = LocalDateTime.of(year, month, day, 0, 0, 0, 0);
		LocalDateTime l2 = LocalDateTime.of(yearEnd, monthEnd, dayEnd, 23, 59, 59);
		logger.info("consulta OD POR FECHA1 ------> :" + l1);	
		logger.info("consulta OD POR FECHA2 ------> :" + l2);
		return service.getByDateBetween(l1,l2);
	}



	//	public List<OrderDay> getByDateBetween(@RequestParam(value="fechainicio" ) final LocalDate fechaInicio,
	//			@RequestParam(value="fechafin" ) final LocalDate fechaFin) {
	//		//logger.info("consulta ORDEN DEL DIA POR FECHA");	
	//		//LocalDate date = LocalDate.now();
	//		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("d/MM/uuuu");
	//	    //String text = date.format(dtf);
	//		
	////		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd", Locale.US);
	//		
	//	    LocalDate l1 = LocalDate.of(fechaInicio, dtf);
	//		LocalDate l2 = LocalDate.of(fechaFin, dtf);
	//		
	//		return service.getByDateBetween(l1,l2);
	//	}



	@PostMapping
	public OrderDay post(@RequestBody final OrderDay entity) {				
		logger.info("Order Day a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}

	@PutMapping
	public OrderDay put(@RequestBody final OrderDay entity) {				
		logger.info("Order Day a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
	@PutMapping(value="/delete")
	public OrderDay deleteData(@RequestBody final OrderDay entity) {
		logger.info("Orden del dia a eliminar: ["+entity.toString()+"]");
		return service.delete(entity);
	}





}
