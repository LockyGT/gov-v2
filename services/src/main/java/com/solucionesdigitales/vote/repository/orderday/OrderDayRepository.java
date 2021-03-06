package com.solucionesdigitales.vote.repository.orderday;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;

@Repository
public interface  OrderDayRepository extends MongoRepository<OrderDay, String> {

	OrderDay findFirstById(String id);
	List<OrderDay>findByStatusGreaterThan(int status);
	List<OrderDay>findByStatus(int status);
	List<OrderDay>findByStatusAndReferenciaIsNotNullOrderByFechaDesc(int status);
	List<OrderDay> findByFechaBetween(LocalDateTime f1, LocalDateTime f2);
	
	
	List<OrderDay> findByStatusAndReferenciaIsNullOrderByFechaDesc(int status);
	List <OrderDay> findByReferenciaOrderBySkuDesc(String referencia);
	List<OrderDay> findByIsPublished(boolean status);
	List<OrderDay> findByIsApproved(boolean status);
	List<OrderDay> findByFechaBetweenOrderByFechaDesc(Date dateStart, Date dateEnd);
}