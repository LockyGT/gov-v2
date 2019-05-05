package com.solucionesdigitales.vote.entity.vote;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.entity.partner.Partner;

@Document(collection = "votes")
public class Vote {
	
	@Id 
	private  String id;
	private LocalDateTime fechaHora;
	@DBRef
	private Partner partner;
	@DBRef
	private VoteOption option;
	@DBRef
	private Initiative initiative;
	
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
	 * @return the fechaHora
	 */
	public LocalDateTime getFechaHora() {
		return fechaHora;
	}
	/**
	 * @param fechaHora the fechaHora to set
	 */
	public void setFechaHora(LocalDateTime fechaHora) {
		this.fechaHora = fechaHora;
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
	 * @return the option
	 */
	public VoteOption getOption() {
		return option;
	}
	/**
	 * @param option the option to set
	 */
	public void setOption(VoteOption option) {
		this.option = option;
	}
	public Initiative getInitiative() {
		return initiative;
	}
	public void setInitiative(Initiative initiative) {
		this.initiative = initiative;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Vote [id=" + id + ", fechaHora=" + fechaHora + ", partner=" + partner + ", option=" + option
				+ ", initiative=" + initiative + "]";
	}
	
}
