package com.solucionesdigitales.vote.entity.elementsod;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.orderday.ParagraphOD;

@Document(collection = "elementsOd")
public class ElementOd {
	
	@Id
	private String id;
	private String nombre;
	private ArrayList<ParagraphOD> paragraphs;
	
	
	
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
	public ArrayList<ParagraphOD> getParagraphs() {
		return paragraphs;
	}
	public void setParagraphs(ArrayList<ParagraphOD> paragraphs) {
		this.paragraphs = paragraphs;
	}
	@Override
	public String toString() {
		return "ElementOd [id=" + id + ", nombre=" + nombre + ", paragraphs=" + paragraphs + "]";
	}
	
	
	
}
