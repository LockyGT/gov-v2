package com.solucionesdigitales.vote.entity;

import org.springframework.web.multipart.MultipartFile;

/**
 * 
 * @author israel
 *
 */
public class GenericFile {
	private MultipartFile file;
	private String name;
	private String folder;
	
	public MultipartFile getFile() {
		return file;
	}
	public void setFile(MultipartFile file) {
		this.file = file;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getFolder() {
		return folder;
	}
	public void setFolder(String folder) {
		this.folder = folder;
	}
	
}
