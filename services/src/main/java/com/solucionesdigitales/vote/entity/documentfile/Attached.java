package com.solucionesdigitales.vote.entity.documentfile;

import java.util.ArrayList;

public class Attached {
	
	private String nombre;
	private int status;
	private ArrayList<File> files;
	
	/**
	 * @return the nombre
	 */
	public String getNombre() {
		return nombre;
	}
	/**
	 * @param nombre the nombre to set
	 */
	public void setNombre(String nombre) {
		this.nombre = nombre;
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
		return "Attached [nombre=" + nombre + ", files=" + files + "]";
	}
}
