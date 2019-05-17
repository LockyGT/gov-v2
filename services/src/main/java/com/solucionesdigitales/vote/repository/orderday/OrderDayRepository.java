package com.solucionesdigitales.vote.repository.orderday;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;

@Repository
public interface  OrderDayRepository extends MongoRepository<OrderDay, String> {

	OrderDay findAllById(OrderDay entity);
	List<OrderDay>findByStatusGreaterThan(int status);
	List<OrderDay>findByStatus(int status);
	List<OrderDay>findByStatusAndReferenciaIsNotNullOrderByFechaAsc(int status);
	List<OrderDay> findByStatusAndReferenciaIsNullOrderByFechaAsc(int status);
	List<OrderDay> findByFechaBetween(LocalDateTime f1, LocalDateTime f2);
	
	
	
//	OrderDay findByReferenciaSustituidaAndId(String id, String referencia);
//	List <OrderDay> findByReferenciaSustituidaAndIdOdOriginal(String id, String referencia);
//	
//	
//	List<OrderDay> findByStatusAndReferenciaOrderByFechaAsc(int status, String odOriginal);
//	
}