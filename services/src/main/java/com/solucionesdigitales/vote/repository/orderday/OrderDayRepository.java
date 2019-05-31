package com.solucionesdigitales.vote.repository.orderday;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;

@Repository
public interface  OrderDayRepository extends MongoRepository<OrderDay, String> {

	OrderDay findFirstById(String id);
	List<OrderDay>findByStatusGreaterThan(int status);
	List<OrderDay>findByStatus(int status);
	List<OrderDay>findByStatusAndReferenciaIsNotNullOrderByFechaAsc(int status);
	List<OrderDay> findByFechaBetween(LocalDateTime f1, LocalDateTime f2);
	
	
	List<OrderDay> findByStatusAndReferenciaIsNull(int status);
	List <OrderDay> findByReferenciaOrderBySkuDesc(String referencia);
	List<OrderDay> findByIsPublished(boolean status);
}