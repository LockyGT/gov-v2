package com.solucionesdigitales.vote.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.QuorumResets;
import com.solucionesdigitales.vote.repository.QuorumResetsRepository;
import com.solucionesdigitales.vote.service.QuorumResetsService;

/**
 * 
 * @author javier
 *
 */
@Service("quorumResetsService")
public class QuorumResetsServiceImpl implements QuorumResetsService {
	
	private static final Logger logger = LoggerFactory.getLogger(QuorumResetsServiceImpl.class);
	
	@Autowired
	private QuorumResetsRepository repo;

	@Override
	public List<QuorumResets> fetch() {
		return repo.findAll();
	}

	@Override
	public QuorumResets fetchByPartnerIdAndDate(String partnerId, LocalDateTime dt1, LocalDateTime dt2) {
		logger.debug("buscando partners");
		return repo.findFirstByPartnerAndDateTimeBetweenAndStatus(partnerId, dt1, dt2, 1);
	}

	@Override
	public QuorumResets post(QuorumResets entity) {
		return repo.save(entity);
	}

	@Override
	public QuorumResets put(QuorumResets entity) {
		return repo.save(entity);
	}

	@Override
	public QuorumResets findByDateTimeBetweenAndStatus(LocalDateTime dt1, LocalDateTime dt2,int status) {
		return repo.findFirstByDateTimeBetweenAndStatus( dt1, dt2, status);
	}

	@Override
	public List<QuorumResets> findAllByDateTimeBetween(LocalDateTime dt1, LocalDateTime dt2) {
		return repo.findAllByDateTimeBetween( dt1, dt2);
	}

}
