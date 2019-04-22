package com.solucionesdigitales.vote.service;

import java.time.LocalDateTime;
import java.util.List;

import com.solucionesdigitales.vote.entity.QuorumResets;

public interface QuorumResetsService {
	
List<QuorumResets> fetch();
	
	QuorumResets fetchByPartnerIdAndDate(String partnerId,LocalDateTime dt1, LocalDateTime dt2);
	
	QuorumResets post(QuorumResets entity);

	QuorumResets put(QuorumResets entity);
	
	QuorumResets findByDateTimeBetweenAndStatus(LocalDateTime dt1, LocalDateTime dt2,int status);
	
	List<QuorumResets> findAllByDateTimeBetween(LocalDateTime dt1, LocalDateTime dt2);
}
