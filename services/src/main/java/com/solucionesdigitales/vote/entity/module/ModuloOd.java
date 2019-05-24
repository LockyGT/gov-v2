package com.solucionesdigitales.vote.entity.module;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="modulood")
public class ModuloOd {
	
	@Id
	private String id;
	
	private String nombre;
	private String icon;
	private String color;
	private String fieldHelp;
	private int status;
	
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
	 * @return the titulo
	 */
	public String getIcon() {
		return icon;
	}

	/**
	 * 
	 * @param icon the icon to set
	 */
	public void setIcon(String icon) {
		this.icon = icon;
	}

	/**
	 * 
	 * @return the color
	 */
	public String getColor() {
		return color;
	}
	
	/**
	 * 
	 * @param color the color to set
	 */
	public void setColor(String color) {
		this.color = color;
	}

	/**
	 * @return the fieldHelp
	 */
	public String getFieldHelp() {
		return fieldHelp;
	}

	/**
	 * @param fieldHelp the fieldHelp to set
	 */
	public void setFieldHelp(String fieldHelp) {
		this.fieldHelp = fieldHelp;
	}

	/**
	 * 
	 * @return the status
	 */
	public int getStatus() {
		return status;
	}
	
	/**
	 * 
	 * @param status the status to set
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ModuloOd [id=" + id + ", nombre=" + nombre + ", icon=" + icon + ", color=" + color + ", fieldHelp="
				+ fieldHelp + ", status=" + status + "]";
	}
	
}
