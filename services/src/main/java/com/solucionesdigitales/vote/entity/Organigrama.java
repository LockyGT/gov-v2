package com.solucionesdigitales.vote.entity;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

@Document(collection = "organigrama")
public class Organigrama {
	
	@Id 
	private String id;
	@JsonProperty
	private String jsonObjeto;
	private LocalDate creado;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getJsonObjeto() {
		return jsonObjeto;
	}
	public void setJsonObjeto(String jsonObjeto) {
		this.jsonObjeto = jsonObjeto;
	}
	public LocalDate getCreado() {
		return creado;
	}
	public void setCreado(LocalDate creado) {
		this.creado = creado;
	}
	@Override
	public String toString() {
		return "Organigrama [id=" + id + ", jsonObjeto=" + jsonObjeto + ", creado=" + creado + "]";
	}
	
	

}
