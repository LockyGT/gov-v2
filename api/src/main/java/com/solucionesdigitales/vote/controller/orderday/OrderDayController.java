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

import com.solucionesdigitales.vote.entity.module.ModuloOd;
import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.entity.orderday.OrderDayParagraph;
import com.solucionesdigitales.vote.service.orderday.OrderDayService;



@RestController
@RequestMapping("orderday")
public class OrderDayController {
	
	private static final Logger logger = LoggerFactory.getLogger(OrderDayController.class);

	@Autowired
	private OrderDayService service;
	
	
	@GetMapping
	public List<OrderDay> get(){
		logger.info("consulta Order Day:");
		return service.fetch();
	}
	
	
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
