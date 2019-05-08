package com.solucionesdigitales.vote.repository.orderday;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;


public interface  OrderDayRepository extends MongoRepository<OrderDay, String> {

	OrderDay findAllById(OrderDay entity);
	List<OrderDay>findByStatusGreaterThan(int status);

}