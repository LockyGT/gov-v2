package com.solucionesdigitales.vote.service.impl.orderday;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.module.ModuloOd;
import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.repository.orderday.OrderDayRepository;
import com.solucionesdigitales.vote.service.impl.module.ModuloOdServiceImpl;
import com.solucionesdigitales.vote.service.orderday.OrderDayService;


@Service("orderDayService")
public class OrderDayServiceImpl implements OrderDayService {
	private static final Logger logger = LoggerFactory.getLogger(OrderDayServiceImpl.class);

	@Autowired
	private OrderDayRepository orderDayRepository;

	@Override
	public List<OrderDay> fetch() {
		List<OrderDay> orderday= orderDayRepository.findByStatusGreaterThan(0);
		return orderday;
	}

	@Override
	public OrderDay post(OrderDay entity) {		
		entity = orderDayRepository.save(entity);	
		return entity;
	}

	
	@Override
	public OrderDay put(OrderDay entity) {
		OrderDay nuevaVersion = new OrderDay();
		nuevaVersion.setFecha(entity.getFecha());
		nuevaVersion.setModuloOd(entity.getModuloOd());
		nuevaVersion.setNombre(entity.getNombre());
		nuevaVersion.setParagraphs(entity.getParagraphs());
		nuevaVersion.setId(null);
		if(entity.getOdOriginal() != null && !entity.getOdOriginal().isEmpty()) {
			nuevaVersion.setOdOriginal(entity.getOdOriginal());
		}else {
			if (entity.getId() != null && !entity.getId().isEmpty()) {
				nuevaVersion.setOdOriginal(entity.getId());
			}else {
				//TODO error
			}
		}		
		nuevaVersion.setStatus(1);
		nuevaVersion = orderDayRepository.save(nuevaVersion);
		Optional<OrderDay> od = orderDayRepository.findById(entity.getId());
		entity = od.get(); 
		entity.setStatus(2);
		orderDayRepository.save(entity);
		return nuevaVersion;
	}
	@Override
	public OrderDay delete(OrderDay entity) {
		OrderDay orderday = new OrderDay();
		entity.setStatus(-1);
		if(entity.getId() != null) {
			orderday = orderDayRepository.save(entity);
			logger.info("Orden del dia eliminado: ["+entity+"]");
		}
		return orderday;
	}
}
