package com.solucionesdigitales.vote.repository.orderday;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;


public interface  OrderDayRepository extends MongoRepository<OrderDay, String> {

	OrderDay findAllById(OrderDay entity);
	List<OrderDay>findByStatusGreaterThan(int status);
	List<OrderDay>findByStatus(int status);
	List<OrderDay>findByStatusAndReferenciaIsNotNull(int status);
	List<OrderDay> findByStatusAndReferenciaIsNull(int status);
	//List<OrderDay> findByStatusAndReferenciaIsSustituida(int status);
	//List<OrderDay> findOrderDayByFechaHora(LocalDateTime fecha);
	
	
}