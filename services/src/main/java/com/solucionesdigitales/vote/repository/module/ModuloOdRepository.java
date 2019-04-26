package com.solucionesdigitales.vote.repository.module;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.module.ModuloOd;

public interface ModuloOdRepository extends MongoRepository<ModuloOd, String>{
	
	List<ModuloOd> findByStatus(int status);
}
