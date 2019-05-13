package com.solucionesdigitales.vote.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.Photo;

@Repository
public interface PhotoRepository extends MongoRepository<Photo, String>{

}
