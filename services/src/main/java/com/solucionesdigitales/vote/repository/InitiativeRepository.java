package com.solucionesdigitales.vote.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.initiative.Initiative;

public interface InitiativeRepository extends MongoRepository<Initiative, String>{
	List<Initiative> findAllByStatus(Integer status);
	List<Initiative> findByIsClosedAndStatus(boolean closed, int status);
	List<Initiative> findAllByIsClosedAndStatusAndFechaHoraFinBetween(boolean isClosed, int status, LocalDateTime dt1 ,LocalDateTime dt2);
}
