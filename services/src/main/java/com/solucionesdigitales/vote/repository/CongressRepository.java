package com.solucionesdigitales.vote.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.solucionesdigitales.vote.entity.Congress;

@RepositoryRestResource(collectionResourceRel = "congress", path = "congresos")
public interface CongressRepository extends MongoRepository<Congress, String>{

}
