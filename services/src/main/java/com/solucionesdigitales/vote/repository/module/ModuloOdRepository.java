package com.solucionesdigitales.vote.repository.module;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.module.ModuloOd;

@Repository
public interface ModuloOdRepository extends MongoRepository<ModuloOd, String>{
	
	List<ModuloOd> findByStatus(int status);
	
	ModuloOd findFirstById(String id);
}
