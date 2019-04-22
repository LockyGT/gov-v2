package com.solucionesdigitales.vote.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.solucionesdigitales.vote.entity.fingerprint.FingerPrint;

@RepositoryRestResource(collectionResourceRel = "fingerPrint", path = "fingerPrints")
public interface FingerPrintRepository extends MongoRepository<FingerPrint, String>{

}
