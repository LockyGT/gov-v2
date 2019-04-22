package com.solucionesdigitales.vote.service.impl.initiative;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.repository.InitiativeRepository;
import com.solucionesdigitales.vote.service.initiative.InitiativeService;
import com.solucionesdigitales.vote.service.utils.Constants;

@Service("initiativeService")
public class InitiativeServiceImpl implements InitiativeService {	
	@Autowired
	private InitiativeRepository repo;

	@Override
	public List<Initiative> findByIsClosedAndStatus(boolean closed, int status) {
		
		return repo.findByIsClosedAndStatus(closed, status);
	}

	@Override
	public List<Initiative> fetchInitiatives() {		
		return repo.findAllByStatus(Constants._ACTIVE);
	}

	@Override
	public Initiative post(Initiative entity) {		
		return repo.save(entity);
	}

	@Override
	public Initiative put(Initiative entity) {		
		return repo.save(entity);
	}

	@Override
	public Initiative putIniciarVotacion(Initiative entity) {
		Initiative in = null;
		return in; 
	}

	@Override
	public List<Initiative> postArray(List<Initiative> entities) {		
		return (List<Initiative>) repo.saveAll(entities);
	}

	@Override
	public Optional<Initiative> fetchById(String id) {
		return repo.findById(id);
	}

	@Override
	public List<Initiative> fetchByIsClosedAndStatusAndDates(boolean closed, int status, LocalDateTime dt1, LocalDateTime dt2) {
		return repo.findAllByIsClosedAndStatusAndFechaHoraFinBetween(closed, status, dt1, dt2);
	}



}
