package com.solucionesdigitales.vote.repository.user;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.user.Rol;

public interface RolRepository extends MongoRepository<Rol, String> {
	
}
