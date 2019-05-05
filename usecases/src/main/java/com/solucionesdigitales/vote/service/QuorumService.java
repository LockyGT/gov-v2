package com.solucionesdigitales.vote.service;

import java.time.LocalDateTime;
import java.util.List;

import com.solucionesdigitales.vote.entity.Quorum;
import com.solucionesdigitales.vote.entity.partner.Partner;

public interface QuorumService {
	
	List<Quorum> fetch();
	
	Quorum fetchByPartnerIdAndDate(String partnerId,LocalDateTime dt1, LocalDateTime dt2);
	
	Quorum post(Quorum entity);

	Quorum put(Quorum entity);

	List<Quorum> putAll(List<Quorum> entity);
	
	List<Quorum> findAllByDateTimeBetween(LocalDateTime dt1, LocalDateTime dt2);
	
	List<Quorum> findQuorumToday(LocalDateTime dt1, LocalDateTime dt2) ;
	 
	List<Quorum>  reiniciarQuorum(LocalDateTime dt1, LocalDateTime dt2,Partner partner) ;
}
