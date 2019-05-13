package com.solucionesdigitales.vote.entity;

import java.util.ArrayList;

import org.springframework.web.multipart.MultipartFile;

/**
 * 
 * @author israel
 *
 */
public class GenericFile {
	
	private MultipartFile file;
	private ArrayList<MultipartFile> files;
	private String folder;
	/**
	 * @return the file
	 */
	public MultipartFile getFile() {
		return file;
	}
	/**
	 * @param file the file to set
	 */
	public void setFile(MultipartFile file) {
		this.file = file;
	}
	/**
	 * @return the files
	 */
	public ArrayList<MultipartFile> getFiles() {
		return files;
	}
	/**
	 * @param files the files to set
	 */
	public void setFiles(ArrayList<MultipartFile> files) {
		this.files = files;
	}
	/**
	 * @return the folder
	 */
	public String getFolder() {
		return folder;
	}
	/**
	 * @param folder the folder to set
	 */
	public void setFolder(String folder) {
		this.folder = folder;
	}
}
