package com.solucionesdigitales.vote.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.solucionesdigitales.vote.entity.Photo;

@RepositoryRestResource(collectionResourceRel = "photo", path = "photos")
public interface PhotoRepository extends MongoRepository<Photo, String>{

}
