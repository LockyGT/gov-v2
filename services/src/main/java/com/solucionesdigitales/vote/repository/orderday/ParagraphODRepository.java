package com.solucionesdigitales.vote.repository.orderday;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.orderday.ParagraphOD;


@Repository
public interface  ParagraphODRepository extends MongoRepository<ParagraphOD, String> {

	List<ParagraphOD>findByStatus(int status);


}
