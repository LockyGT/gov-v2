
package com.solucionesdigitales.vote.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("config")
public class ConfigController {
	private static final Logger logger = LoggerFactory.getLogger(ConfigController.class);	
	
	@Value("${authentication.by.finger.enabled: false}")
	private boolean fingerPrintEnabled;	
	
	@Value("${authentication.by.password.enabled: false}")
	private boolean passwordEnabled;
	
	/**
	 * 
	 * @return Object
	 */
	@GetMapping(value = "/auth")
	public Object get() {
		logger.info("consulta de auth:");
		String resp = fingerPrintEnabled ? "habilitado" : "deshabilitado";
		Map<String, String> resp2 = new HashMap<String, String>();
		resp2.put("fingerPrintEnabled", resp);	
		return resp2;
	}
	
	/**
	 * 
	 * @return Object
	 */
	@GetMapping(value = "/auth-password")
	public Object getAuthPassword() {
		logger.info("consulta de auth:");
		String resp = passwordEnabled ? "habilitado" : "deshabilitado";
		Map<String, String> resp2 = new HashMap<String, String>();
		resp2.put("passwordEnabled", resp);	
		return resp2;
	}


}
