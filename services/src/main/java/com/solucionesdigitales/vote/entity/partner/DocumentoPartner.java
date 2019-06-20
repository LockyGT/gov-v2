package com.solucionesdigitales.vote.entity.partner;

import javax.persistence.Transient;

import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.Documento;

@Document(collection = "documento_partner")
public class DocumentoPartner {
	
	private String idPartner;
	private String uuidDocumento;
	private String acrhivo;
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
	public String getAcrhivo() {
		return acrhivo;
	}
	public void setAcrhivo(String acrhivo) {
		this.acrhivo = acrhivo;
	}
	public Documento getDocumento() {
		return documento;
	}
	public void setDocumento(Documento documento) {
		this.documento = documento;
	}
	
	
	
	

}
