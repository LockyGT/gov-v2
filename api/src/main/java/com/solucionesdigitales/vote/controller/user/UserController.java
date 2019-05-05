package com.solucionesdigitales.vote.controller.user;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.user.User;
import com.solucionesdigitales.vote.service.user.UserService;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("user")
public class UserController {
	
	private static final Logger logger = LoggerFactory.getLogger(UserController.class);
	
	@Autowired
	private UserService service;
	
	/**
	 * 
	 * @return List<PartnerHasFingerPrint>
	 */
	@GetMapping
	public List<User> get(){
		logger.info("consulta User:");	
		return service.fetch();
	}
	
	
	@PostMapping
	public User postData(@RequestBody final User entity) {				
		logger.info("User a guardar: ["+entity.toString()+"]");		
		return service.post(entity);
	}
	
	/**
	 * 
	 * @param entity
	 * @return PartnerHasFingerPrint
	 */
	@PutMapping
	public User putData(@RequestBody final User entity) {				
		logger.info("User a actualizar: ["+entity.toString()+"]");		
		return service.put(entity);
	}
	
	@GetMapping(value="/username")
	public User getByUsername(@RequestParam(value="username") final String username){
		logger.info("consulta partner:");	
		return service.getByUsername(username);
	}
	
	@GetMapping(value="/username/status")
	public User getByUsernameAndStatus(@RequestParam(value="username") final String username, @RequestParam(value="status") final int status){
		logger.info("consulta partner:");	
		return service.getByUsernameAndStatus(username, status);
	}
}
