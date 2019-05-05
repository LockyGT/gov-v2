package com.solucionesdigitales.vote.service;

import java.util.List;

import com.solucionesdigitales.vote.entity.fingerprint.FingerPrint;

public interface FingerPrintService {
	
	List<FingerPrint> fetch();

	FingerPrint post(FingerPrint entity);

	FingerPrint put(FingerPrint entity);	
}
