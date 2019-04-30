package com.solucionesdigitales.vote.entity.orderday;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.module.ModuloOd;

@Document(collection = "orderday")
public class OrderDay {
	
	@Id
	private String id;
	//version
	private String sku;
	private int status;
	/*
	 * Modulo de la gaceta 
	 */
	@DBRef
	private ModuloOd moduloOd;
	/*
	 * Contenido de OD
	 */
	@DBRef
	private ParagraphOD parrafo;
	
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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
	public ParagraphOD getParrafo() {
		return parrafo;
	}

	public void setParrafo(ParagraphOD subparrafo) {
		this.parrafo = subparrafo;
	}
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	
	
	@Override
	public String toString() {
		return "OrderDay [id=" + id + ", sku" + sku + ", moduloOd" + moduloOd + ",parrafo" + parrafo + ",status" + status +"]";
		
		
	}

	

	

	

	
	

}
 