package com.solucionesdigitales.vote.service.user;

import java.util.List;

import com.solucionesdigitales.vote.entity.user.User;

public interface UserService {
	
	List<User> fetch();
	
	User getByUsername(String username);

	User post(User entity);
	
	User put(User entity);

	User getByUsernameAndStatus(String username, int status);

}
