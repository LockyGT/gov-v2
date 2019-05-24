package com.solucionesdigitales.vote.entity.documentfile;

import java.util.ArrayList;

import javax.persistence.Id;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "attached")
public class Attached {
	
	@Id
	private String id;
	private String name;
	private int status;
	private ArrayList<File> files;
	
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * @return the nombre
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param nombre the nombre to set
	 */
	public void setName(String nombre) {
		this.name = nombre;
	}
	/**
	 * @return the status
	 */
	public int getStatus() {
		return status;
	}
	/**
	 * @param status the status to set
	 */
	public void setStatus(int status) {
		this.status = status;
	}
	/**
	 * @return the files
	 */
	public ArrayList<File> getFiles() {
		return files;
	}
	/**
	 * @param files the files to set
	 */
	public void setFiles(ArrayList<File> files) {
		this.files = files;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Attached [nombre=" + name + ", files=" + files + "]";
	}
}
