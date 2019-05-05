package com.solucionesdigitales.vote.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.partner.Partner;

@Document(collection = "quorum_resets")
public class QuorumResets {
	
	@Id 
	private String id;
	@DBRef
	private Partner partner;
	
	private LocalDateTime dateTime;

	private int numeroReinicio;
	
	private int status;
	
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}	

	/**
	 * @return the partner
	 */
	public Partner getPartner() {
		return partner;
	}

	/**
	 * @param partner the partner to set
	 */
	public void setPartner(Partner partner) {
		this.partner = partner;
	}
	/**
	 * @return the dateTime
	 */
	public LocalDateTime getDateTime() {
		return dateTime;
	}

	/**
	 * @param dateTime the dateTime to set
	 */
	public void setDateTime(LocalDateTime dateTime) {
		this.dateTime = dateTime;
	}

	/**
	 * @return the status
	 */
	public int getStatus() {
		return status;
	}

	/**
	 * @param status the status to set
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	public int getNumeroReinicio() {
		return numeroReinicio;
	}

	public void setNumeroReinicio(int numeroReinicio) {
		this.numeroReinicio = numeroReinicio;
	}

	@Override
	public String toString() {
		return "QuorumResets [id=" + id + ", partner=" + partner + ", dateTime=" + dateTime + ", numeroReinicio="
				+ numeroReinicio + ", status=" + status + "]";
	}

	
}
