package com.solucionesdigitales.vote.service.impl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.fingerprint.FingerPrint;
import com.solucionesdigitales.vote.repository.FingerPrintRepository;
import com.solucionesdigitales.vote.service.FingerPrintService;

@Service("fingerPrintService")
public class FingerPrintServiceImpl implements FingerPrintService {
	
	private static final Logger logger = LoggerFactory.getLogger(FingerPrintServiceImpl.class);
	
	@Autowired
	private FingerPrintRepository repo;

	@Override
	public List<FingerPrint> fetch() {		
		return repo.findAll();
	}	
	
	@Override
	public FingerPrint post(FingerPrint entity) {
		logger.debug("posting finger print");
		return repo.save(entity);
	}

	@Override
	public FingerPrint put(FingerPrint entity) {		
		return repo.save(entity);
	}	

}
