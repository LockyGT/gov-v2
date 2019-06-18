package com.solucionesdigitales.vote.controller.orderday;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
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
	
	@GetMapping(value="/fetch/id")
	public OrderDay getOrderDayById(@RequestParam(value="id") final String id){
		logger.info("consulta de Versiones de Orden del dia:");
		return service.fetchById(id);
	}
	

	@GetMapping(value="/odOriginal")
	public List<OrderDay> getOdOriginal(@RequestParam(value="odOriginal") final String odOriginal){
		logger.info("Consulta de versiones");
		return service.getOdOriginal(odOriginal);
	}
	
	@GetMapping(value="/status")
	public List<OrderDay> getByStatus(@RequestParam(value="status")final int status){
		logger.info("Consulta de OD Publicadas");
		return service.getByStatus(status);
	}
	@GetMapping(value="/published")
	public List<OrderDay> getByStatusPublicada(@RequestParam(value="publicada")final boolean status){
		logger.info("Publicar la orden dia en la gaceta");
		return service.getByStatusPublicada(status);
	}
	
	@GetMapping(value="/approved")
	public List<OrderDay> getByStatusAprobada(@RequestParam(value="aprobada")final boolean status){
		logger.info("Aprovar la orden del dia");
		return service.getByStatusAprobada(status);
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
	
	@GetMapping(value="/datesbetween")
	public List<OrderDay> getBetweenDatesPublished(@RequestParam(value="publicada") final boolean status,@RequestParam(value="datestart") @DateTimeFormat(pattern="yyyy/MM/dd") Date dateStart,
			@RequestParam(value="dateend") @DateTimeFormat(pattern="yyyy/MM/dd") Date dateEnd){
		logger.info("Consulta Orden del dia publicadas por fechas "+dateStart+" y "+dateEnd);
		
		return service.fetchByBetweenDates(status, dateStart,dateEnd);
	}

	@PostMapping
	public OrderDay post(@RequestBody final OrderDay entity) {				
		logger.info("Order Day a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}
	
	@PostMapping(value="/newVerssion") 
	public OrderDay postNewVerssion(@RequestBody final OrderDay entity) {
		logger.info("Version de la orden del dia guardado: [" +entity.toString()+"]");
		return service.postNewVerssion(entity);
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
