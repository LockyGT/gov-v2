package com.solucionesdigitales.vote.service.impl.user;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.user.User;
import com.solucionesdigitales.vote.repository.user.UserRepository;
import com.solucionesdigitales.vote.service.user.UserService;

@Service("userService")
public class UserServiceImpl implements UserService {

	private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

	@Autowired
	private UserRepository repo;

	@Override
	public List<User> fetch() {		
		return repo.findAll();
	}

	@Override
	public User post(User entity) {
		return repo.save(entity);
	}

	@Override
	public User put(User entity) {
		return repo.save(entity);
	}

	@Override
	public User getByUsername(String username) {
		logger.debug("buscando usuario inicia ctrl: "+ username );
		return repo.findByUsername(username);
	}

	@Override
	public User getByUsernameAndStatus(String username, int status) {
		return repo.findByUsernameAndStatus(username, status);
	}

}
