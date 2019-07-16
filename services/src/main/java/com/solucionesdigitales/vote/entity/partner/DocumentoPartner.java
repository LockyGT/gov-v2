package com.solucionesdigitales.vote.entity.partner;

import java.util.ArrayList;

import javax.persistence.Id;
import javax.persistence.Transient;

import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.Documento;

@Document(collection = "documento_partner")
public class DocumentoPartner {
	
	@Id
	private String id;
	private String idPartner;
	private String uuidDocumento;
	private ArrayList<String> archivos;
	@Transient
	private Documento documento;
	public String getIdPartner() {
		return idPartner;
	}
	public void setIdPartner(String idPartner) {
		this.idPartner = idPartner;
	}
	
	public String getUuidDocumento() {
		return uuidDocumento;
	}
	public void setUuidDocumento(String uuidDocumento) {
		this.uuidDocumento = uuidDocumento;
	}
	public ArrayList<String> getArchivos() {
		return archivos;
	}
	public void setArchivo(ArrayList<String> archivos) {
		this.archivos = archivos;
	}
	public Documento getDocumento() {
		return documento;
	}
	public void setDocumento(Documento documento) {
		this.documento = documento;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
}