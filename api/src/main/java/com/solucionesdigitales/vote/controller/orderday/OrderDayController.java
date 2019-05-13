package com.solucionesdigitales.vote.controller.orderday;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
	
	@GetMapping(value="sustituida/reference/with/without")
	public List<OrderDay> getSustituidaWithAndWithoutReference(){
		logger.info("consulta de Versiones de Orden del dia:");
		return service.getSustituidaWithAndWithoutReference();
	}
	
	
	
//	@GetMapping(value="/date/between" , params ="fecha")	
//	public List<OrderDay> getByDateBetwen(@RequestParam(value="fecha") @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) final LocalDateTime fecha){
//		logger.info("consulta ORDEN DEL DIA POR FECHA:" + fecha);	
//
//		ZonedDateTime here = fecha.atZone(ZoneId.systemDefault());		
//		logger.info("ZONEDDATE : " + here);
//		int year  = here.getYear();
//		int month = here.getMonthValue();
//		int day   = here.getDayOfMonth();
//		logger.info("day of the month : " + day);
//
//		LocalDateTime t1 = LocalDateTime.of(year, month, day, 0, 0, 0, 0);
//		LocalDateTime t2 = LocalDateTime.of(year, month, day, 23, 59, 59);
//		logger.info("consulta ORDEN DEL DIA POR FECHA1 ------> :" + t1);	
//		logger.info("consulta ORDEN DEL DIA POR FECHA2 ------> :" + t2);
//		return service.findOrderDayByFechaBetwen(t1, t2);
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
