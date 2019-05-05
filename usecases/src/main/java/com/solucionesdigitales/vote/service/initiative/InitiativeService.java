package com.solucionesdigitales.vote.service.initiative;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.solucionesdigitales.vote.entity.initiative.Initiative;

public interface InitiativeService {
	
	List<Initiative> fetchInitiatives();
	
	Optional<Initiative> fetchById(String id);

	Initiative post(Initiative entity);

	Initiative put(Initiative entity);	
	
	Initiative putIniciarVotacion(Initiative entity);	

	List<Initiative> postArray(List<Initiative> entities);

	List<Initiative> findByIsClosedAndStatus(boolean closed, int status);

	List<Initiative> fetchByIsClosedAndStatusAndDates(boolean closed, int status, LocalDateTime dt1, LocalDateTime dt2);
}
