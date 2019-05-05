package com.solucionesdigitales.vote.service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * 
 * @author javier
 *
 */
@ConfigurationProperties("storage")
public class StorageConfig {

	/**
	 * Folder location for storing files
	 */
	@Value("${dir.carpeta.multimedia: /temp}")
	private String location ;
	
	/**
	 * location of media dir in server
	 * @return String
	 */
	public String getLocation() {
		return location;
	}
	
	/**
	 * location of media dir in server
	 * @param location
	 */
	public void setLocation(String location) {
		this.location = location;
	}

}
