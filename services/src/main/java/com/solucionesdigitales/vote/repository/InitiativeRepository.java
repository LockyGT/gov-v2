package com.solucionesdigitales.vote.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.initiative.Initiative;

@Repository
public interface InitiativeRepository extends MongoRepository<Initiative, String>{
	Initiative findFirstByIdAndStatus(String id, int status);
	List<Initiative> findAllByStatus(Integer status);
	List<Initiative> findByIsClosedAndStatus(boolean closed, int status);
	List<Initiative> findAllByIsClosedAndStatusAndFechaHoraFinBetween(boolean isClosed, int status, LocalDateTime dt1 ,LocalDateTime dt2);
}
