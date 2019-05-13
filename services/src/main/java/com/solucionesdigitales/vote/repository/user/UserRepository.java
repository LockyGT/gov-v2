package com.solucionesdigitales.vote.repository.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.user.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
	User findByUsername(String usernString);

	User findByUsernameAndStatus(String username, int status);

	User findByUsernameAndPassword(String username, String password);
}