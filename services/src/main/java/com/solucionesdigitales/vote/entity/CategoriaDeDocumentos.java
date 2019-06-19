package com.solucionesdigitales.vote.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categoria_documentos")
public class CategoriaDeDocumentos {
	
	@Id 
	private String id;
	
	private int tipoPartner;
	private String nombreCategoria;
	private List<Documento> documentos;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getTipoPartner() {
		return tipoPartner;
	}
	public void setTipoPartner(int tipoPartner) {
		this.tipoPartner = tipoPartner;
	}
	public String getNombreCategoria() {
		return nombreCategoria;
	}
	public void setNombreCategoria(String nombreCategoria) {
		this.nombreCategoria = nombreCategoria;
	}
	public List<Documento> getDocumentos() {
		return documentos;
	}
	public void setDocumentos(List<Documento> documentos) {
		this.documentos = documentos;
	}
	@Override
	public String toString() {
		return "CategoriaDeDocumentos [id=" + id + ", tipoPartner=" + tipoPartner + ", nombreCategoria="
				+ nombreCategoria + ", documentos=" + documentos + "]";
	}
	
	

}
