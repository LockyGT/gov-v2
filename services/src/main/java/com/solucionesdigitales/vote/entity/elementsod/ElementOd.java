package com.solucionesdigitales.vote.entity.elementsod;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "elementOd")
public class ElementOd {
	
	@Id
	private String id;
	private String nombre;
	private int status;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getNombre() {
		return nombre;
	}
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	@Override
	public String toString() {
		return "ElementOd [id=" + id + ", nombre=" + nombre + ", status=" + status + "]";
	}
	
	
	
	
	
	
	
}
