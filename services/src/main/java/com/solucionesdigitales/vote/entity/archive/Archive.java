package com.solucionesdigitales.vote.entity.archive;



import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "archivo")
public class Archive {
	
	@Id
	private String id;
	
	private LocalDate fecha;
	private String nombre;
	private String descripcion;
	private String urlArchivo;
	
	/**
	 * 
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * 
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	/**
	 * 
	 * @return the fecha
	 */
	public LocalDate getFecha() {
		return fecha;
	}
	/**
	 * 
	 * @param fecha the fecha to set
	 */
	public void setFecha(LocalDate fecha) {
		this.fecha = fecha;
	}
	/**
	 * 
	 * @return the nombre
	 */
	public String getNombre() {
		return nombre;
	}
	/**
	 * 
	 * @param nombre the nombre to set
	 */
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	/**
	 * 
	 * @return the descripcion
	 */
	public String getDescripcion() {
		return descripcion;
	}
	/**
	 * 
	 * @param descripcion the descripcion to set
	 */
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}
	/**
	 * 
	 * @return the archivo
	 */
	public String getUrlArchivo() {
		return urlArchivo;
	}
	/**
	 * 
	 * @param urlArchivo to urlArchivo to set
	 */
	public void setUrlArchivo(String urlArchivo) {
		this.urlArchivo = urlArchivo;
	}
	
	
	@Override
	public String toString() {
		return "Archive [id=" + id + ", fecha=" + fecha + ", nombre=" + nombre + ", descripcion=" + descripcion
				+ ", urlArchivo=" + urlArchivo + "]";
	}
}
