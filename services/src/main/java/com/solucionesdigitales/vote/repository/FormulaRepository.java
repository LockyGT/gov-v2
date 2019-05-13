package com.solucionesdigitales.vote.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.initiative.Formula;

@Repository
public interface FormulaRepository extends MongoRepository<Formula, String>{

}
