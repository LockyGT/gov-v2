package com.solucionesdigitales.vote.service.impl.orderday;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.repository.orderday.OrderDayRepository;
import com.solucionesdigitales.vote.service.orderday.OrderDayService;


@Service("orderDayService")
public class OrderDayServiceImpl implements OrderDayService {

	@Autowired
	private OrderDayRepository repository;
	
	@Override
	public List<OrderDay> fetch() {
		List<OrderDay> orderday= repository.findAll();
		return orderday;

	}

	@Override
	public OrderDay post(OrderDay entity) {
		OrderDay orderday = new OrderDay();
		if (entity.getSku() != null) {
			orderday = repository.save(entity);
		}
		return orderday;
	}
	@Override
	public OrderDay put(OrderDay entity) {
		OrderDay orderday = new OrderDay();
		if (entity.getSku() != null) {
			orderday = repository.save(entity);
		}
		return orderday;
	}
	
	

	

}
