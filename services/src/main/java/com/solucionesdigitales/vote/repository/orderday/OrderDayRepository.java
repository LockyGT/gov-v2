package com.solucionesdigitales.vote.repository.orderday;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;


public interface  OrderDayRepository extends MongoRepository<OrderDay, String> {


}