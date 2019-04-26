package com.solucionesdigitales.vote.entity.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.user.User;
import com.solucionesdigitales.vote.repository.user.UserRepository;

@RestController
public class UsuarioController {

	@Autowired
	private UserRepository usuarioRepository;
	
	/*
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
*/
	
	@PostMapping("/users/")
	public void saveUsuario(@RequestBody User user) {
		//user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
		user.setPassword(user.getPassword());
		usuarioRepository.save(user);
	}

	@GetMapping("/users/")
	public List<User> getAllUsuarios() {
		return null;
	}

	@GetMapping("/users/{username}")
	public User getUsuario(@PathVariable String username) {
		return usuarioRepository.findByUsername(username);
	}
}
