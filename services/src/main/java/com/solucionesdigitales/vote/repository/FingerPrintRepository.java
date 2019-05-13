package com.solucionesdigitales.vote.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.fingerprint.FingerPrint;

@Repository
public interface FingerPrintRepository extends MongoRepository<FingerPrint, String>{
	//templateSt
	FingerPrint findByTemplateSt(String templateSt); 
}
