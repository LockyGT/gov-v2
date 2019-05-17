package com.solucionesdigitales.vote.repository.elementsod;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.elementsod.ElementOd;


@Repository
public interface  ElementsOdRepository extends MongoRepository<ElementOd, String> {

}
