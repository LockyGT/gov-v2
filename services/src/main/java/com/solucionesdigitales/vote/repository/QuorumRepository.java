package com.solucionesdigitales.vote.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.Quorum;

@Repository
public interface QuorumRepository extends MongoRepository<Quorum, String>{
	
	Quorum findFirstByPartnerAndDateTimeBetweenAndStatus(String partnerId , LocalDateTime dt1, LocalDateTime dt2,int status);
	
	List<Quorum> findAllByDateTimeBetweenAndStatus(LocalDateTime dt1, LocalDateTime dt2,int status);
}
