package com.solucionesdigitales.vote.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.QuorumResets;

@Repository
public interface QuorumResetsRepository extends MongoRepository<QuorumResets, String>{
	
	QuorumResets findFirstByPartnerAndDateTimeBetweenAndStatus(String partnerId , LocalDateTime dt1, LocalDateTime dt2,int status);
	
	QuorumResets findFirstByDateTimeBetweenAndStatus( LocalDateTime dt1, LocalDateTime dt2,int status);

	List<QuorumResets> findAllByDateTimeBetween( LocalDateTime dt1, LocalDateTime dt2);
}
