package com.solucionesdigitales.vote.service.user;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.solucionesdigitales.vote.repository.user.UserRepository;

@Component
public class MongoUserDetailsService implements UserDetailsService {
	private static final Logger LOGGER = LoggerFactory.getLogger(MongoUserDetailsService.class);
	
	@Autowired
	private UserRepository userRepository;
	
	@Value("${authentication.by.password.enabled: false}")
	private boolean passwordEnabled;
	@Override
	public UserDetails loadUserByUsername(String username)
			throws UsernameNotFoundException {
		LOGGER.debug("loadUserByUsername method");
		LOGGER.debug("username: ["+username+"]");
		com.solucionesdigitales.vote.entity.user.User user = userRepository.findByUsername(username);
		LOGGER.debug("user: ["+user+"]");

		if (user == null) {
			throw new UsernameNotFoundException("User not found");
		}
		
		List<SimpleGrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority("user"));
		LOGGER.debug("authorities: ["+authorities+"]");
		LOGGER.debug("username: ["+user.getUsername()+"]");
		if(passwordEnabled) {
			LOGGER.debug("password: ["+user.getPassword()+"]");
			return new User(user.getUsername(), user.getPassword(), authorities);
		} else {
			LOGGER.debug("password: ["+"test"+"]");
			return new User(user.getUsername(), "test", authorities);
		}
	}

}
