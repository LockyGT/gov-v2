package com.solucionesdigitales.vote.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.Organigrama;

@Repository
public interface OrganigramaRepository extends MongoRepository<Organigrama, String>{

	public List<Organigrama> findByOrderByCreado();
}
