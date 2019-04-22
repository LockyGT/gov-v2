package com.solucionesdigitales.vote.repository.user;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.user.User;

public interface UserRepository extends MongoRepository<User, String> {
	User findByUsername(String usernString);

	User findByUsernameAndStatus(String username, int status);
}