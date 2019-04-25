package com.solucionesdigitales.vote.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.fingerprint.FingerPrint;

public interface FingerPrintRepository extends MongoRepository<FingerPrint, String>{
	//templateSt
	FingerPrint findByTemplateSt(String templateSt); 
}
