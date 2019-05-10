package com.solucionesdigitales.vote.service.orderday;

import java.time.LocalDateTime;
import java.util.List;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;



public interface OrderDayService {

	List<OrderDay> fetch();

	OrderDay post(OrderDay entity);

	OrderDay put(OrderDay entity);

	OrderDay delete(OrderDay entity);

	List<OrderDay> getActiveWithAndWithoutReference();

	List<OrderDay> getSustituidaWithAndWithoutReference();

	//List<OrderDay> findOrderDayByFechaBetwen(LocalDateTime t1, LocalDateTime t2);

}
