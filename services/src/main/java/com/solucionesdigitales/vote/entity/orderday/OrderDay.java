package com.solucionesdigitales.vote.entity.orderday;

import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.module.ModuloOd;

@Document(collection = "orderday")
public class OrderDay {
	
	@Id
	private String id;
	private String nombre;
	//version
	private String sku;
	private int status;
	private LocalDate fecha;
	private String odOriginal;
	private ArrayList<ParagraphOD> paragraphs;
	/*
	 * Modulo de la gaceta 
	 */
	@DBRef
	private ModuloOd moduloOd;
	/*
	 * Contenido de OD
	 */
	
	
	
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

	public String getSku() {
		return sku;
	}

	public void setSku(String sku) {
		this.sku = sku;
	}
	public ModuloOd getModuloOd() {
		return moduloOd;
	}

	public void setModuloOd(ModuloOd moduloOd) {
		this.moduloOd = moduloOd;
	}
	
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}
	
	public ArrayList<ParagraphOD> getParagraphs() {
		return paragraphs;
	}

	public void setParagraphs(ArrayList<ParagraphOD> paragraphs) {
		this.paragraphs = paragraphs;
	}
	public LocalDate getFecha() {
		return fecha;
	}

	public void setFecha(LocalDate fecha) {
		this.fecha = fecha;
	}
	public String getOdOriginal() {
		return odOriginal;
	}

	public void setOdOriginal(String odOriginal) {
		this.odOriginal = odOriginal;
	}

	@Override
	public String toString() {
		return "OrderDay [id=" + id + ", nombre=" + nombre + ", sku=" + sku + ", status=" + status + ", fecha=" + fecha
				+ ", paragraphs=" + paragraphs + ", moduloOd=" + moduloOd + "]";
	}

	

	

	

	
	
}
 