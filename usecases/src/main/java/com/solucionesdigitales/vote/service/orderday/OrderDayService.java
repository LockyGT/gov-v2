package com.solucionesdigitales.vote.service.orderday;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;



public interface OrderDayService {

	List<OrderDay> fetch();

	OrderDay fetchById(String id);

	OrderDay post(OrderDay entity);
	OrderDay put(OrderDay entity);
	OrderDay delete(OrderDay entity);

	List<OrderDay> getActiveWithAndWithoutReference();
	List<OrderDay> getByDateBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);

	List<OrderDay> getSustituidaWithReference();
	List<OrderDay> getOdOriginal(String odOriginal);
	List<OrderDay> getByStatus(int status);
	OrderDay postNewVerssion(OrderDay entity);
	List<OrderDay> getByStatusPublicada(boolean status);
	List<OrderDay> getByStatusAprobada(boolean status);

	List<OrderDay> fetchByBetweenDates(boolean status, Date dateStart, Date dateEnd);
}
