package com.solucionesdigitales.vote.service.orderday;

import java.util.List;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;



public interface OrderDayService {

	List<OrderDay> fetch();

	OrderDay post(OrderDay entity);

	OrderDay put(OrderDay entity);

	OrderDay delete(OrderDay entity);

	

}
