package com.solucionesdigitales.vote.entity.orderday;


import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.elementsod.ElementOd;

@Document(collection = "elementParagraph")
public class ElementParagraph {
	
	@Id
	private String id;
	private int status;
	@DBRef
	private ElementOd elementOd;
	private ArrayList<ParagraphOD> paragraph;
	
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public ElementOd getElementOd() {
		return elementOd;
	}
	public void setElementOd(ElementOd elementOd) {
		this.elementOd = elementOd;
	}
	public ArrayList<ParagraphOD> getParagraph() {
		return paragraph;
	}
	public void setParagraph(ArrayList<ParagraphOD> paragraph) {
		this.paragraph = paragraph;
	}
	
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	@Override
	public String toString() {
		return "ElementParagraph [id=" + id + ", status=" + status + ", elementOd=" + elementOd + ", paragraph="
				+ paragraph + "]";
	}

	
	
	
	
}
