package com.solucionesdigitales.vote.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.initiative.Formula;

public interface FormulaRepository extends MongoRepository<Formula, String>{

}
