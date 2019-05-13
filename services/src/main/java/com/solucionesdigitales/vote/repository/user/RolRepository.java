package com.solucionesdigitales.vote.repository.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.user.Rol;

@Repository
public interface RolRepository extends MongoRepository<Rol, String> {
	
}
