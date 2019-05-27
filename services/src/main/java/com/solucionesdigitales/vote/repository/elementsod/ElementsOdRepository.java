package com.solucionesdigitales.vote.repository.elementsod;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.elementsod.ElementOd;
import com.solucionesdigitales.vote.entity.orderday.OrderDay;


@Repository
public interface  ElementsOdRepository extends MongoRepository<ElementOd, String> {

	List<ElementOd>findByStatus(int status);

	List<ElementOd> findByStatusOrderByNombreAsc(int status);

}
