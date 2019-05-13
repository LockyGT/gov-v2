package com.solucionesdigitales.vote.entity.archive;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.module.ModuloOd;

@Document(collection = "document_file")
public class DocumentFile {
	
	@Id
	private String id;
	
	private LocalDate fecha;
	private String nombre;
	private String descripcion;
	private int status;
	private Date deleteDate;
	private ModuloOd modulood;
	
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
	 * @return the fecha
	 */
	public LocalDate getFecha() {
		return fecha;
	}
	/**
	 * @param fecha the fecha to set
	 */
	public void setFecha(LocalDate fecha) {
		this.fecha = fecha;
	}
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
	 * @return the descripcion
	 */
	public String getDescripcion() {
		return descripcion;
	}
	/**
	 * @param descripcion the descripcion to set
	 */
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
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
	 * @return the deleteDate
	 */
	public Date getDeleteDate() {
		return deleteDate;
	}
	/**
	 * @param deleteDate the deleteDate to set
	 */
	public void setDeleteDate(Date deleteDate) {
		this.deleteDate = deleteDate;
	}
	/**
	 * @return the modulood
	 */
	public ModuloOd getModulood() {
		return modulood;
	}
	/**
	 * @param modulood the modulood to set
	 */
	public void setModulood(ModuloOd modulood) {
		this.modulood = modulood;
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
		return "DocumentFile [id=" + id + ", fecha=" + fecha + ", nombre=" + nombre + ", descripcion=" + descripcion
				+ ", status=" + status + ", deleteDate=" + deleteDate + ", modulood=" + modulood + ", files=" + files
				+ "]";
	}
}
