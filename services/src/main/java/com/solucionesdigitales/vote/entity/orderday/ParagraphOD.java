package com.solucionesdigitales.vote.entity.orderday;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "paragraphod")
public class ParagraphOD {

	@Id
	private String id;
	
	//private ElementOd elemento;
	private String contenidotxt;
	private boolean isIniciativa;
	private int nivel=1;
	public ArrayList<ParagraphOD> subParagraphs;
	
	@DBRef
	private OrderDay orderday;
	/*
	 * Gettters & Setters
	 */
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
	public int getNivel() {
		return nivel;
	}
	public void setNivel(int nivel) {
		this.nivel = nivel;
	}
	public OrderDay getOrderday() {
		return orderday;
	}
	public void setOrderday(OrderDay orderday) {
		this.orderday = orderday;
	}
	public boolean isIniciativa() {
		return isIniciativa;
	}
	public void setIniciativa(boolean isIniciativa) {
		this.isIniciativa = isIniciativa;
	}
	
	public ArrayList<ParagraphOD> getSubParagraphs() {
		return subParagraphs;
	}
	public void setSubParagraphs(ArrayList<ParagraphOD> subParagraphs) {
		this.subParagraphs = subParagraphs;
	}
	@Override
	public String toString() {
		return "ParagraphOD [id=" + id + ", contenidotxt=" + contenidotxt + ", isIniciativa=" + isIniciativa
				+ ", nivel=" + nivel + ", subParagraphs=" + subParagraphs + ", orderday=" + orderday + "]";
	}
	
//	public ElementOd getElemento() {
//		return elemento;
//	}
//	public void setElemento(ElementOd elemento) {
//		this.elemento = elemento;
//	}
}
