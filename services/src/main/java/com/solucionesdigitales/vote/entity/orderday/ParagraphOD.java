package com.solucionesdigitales.vote.entity.orderday;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "paragraphod")
public class ParagraphOD {

	@Id
	private String id;
	private String contenidotxt;
	private String activo;

	@DBRef
	private OrderDay orderday;
	private String subparrafos;


	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getContenidotxt() {
		return contenidotxt;
	}
	public void setContenidotxt(String contenidotxt) {
		this.contenidotxt = contenidotxt;
	}
	public String getActivo() {
		return activo;
	}
	public void setActivo(String activo) {
		this.activo = activo;
	}
	public OrderDay getOrderday() {
		return orderday;
	}
	public void setOrderday(OrderDay orderday) {
		this.orderday = orderday;
	}
	public String getSubparrafos() {
		return subparrafos;
	}
	public void setSubparrafos(String subparrafos) {
		this.subparrafos = subparrafos;
	}

	@Override
	public String toString() {
		return "ParagraphOD [id=" + id + ", contenidotxt=" + contenidotxt + ", activo=" + activo + ", orderday=" + orderday + ",subparrafos=" + subparrafos +  "]";

	}	

}
