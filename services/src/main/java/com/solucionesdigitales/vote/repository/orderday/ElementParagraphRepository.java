package com.solucionesdigitales.vote.repository.orderday;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.orderday.ElementParagraph;

@Repository
public interface  ElementParagraphRepository extends MongoRepository<ElementParagraph, String> {
	
}
