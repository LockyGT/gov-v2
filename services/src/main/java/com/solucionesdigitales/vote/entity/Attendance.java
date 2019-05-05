package com.solucionesdigitales.vote.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.vote.VoteSession;

@Document(collection = "attendances")
public class Attendance {
	
	@Id 
	private String id;
	@DBRef
	private Partner partner;
	@DBRef
	private Initiative initiative;
	
	private LocalDateTime dateTime;
	
	private String registrationMethod;
//	@DBRef
	private VoteSession voteSession;
	
	private int voteSessionNumberAttendance;
	
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
	 * @return the initiative
	 */
	public Initiative getInitiative() {
		return initiative;
	}

	/**
	 * @param initiative the initiative to set
	 */
	public void setInitiative(Initiative initiative) {
		this.initiative = initiative;
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
	 * @return the registrationMethod
	 */
	public String getRegistrationMethod() {
		return registrationMethod;
	}

	/**
	 * @param registrationMethod the registrationMethod to set
	 */
	public void setRegistrationMethod(String registrationMethod) {
		this.registrationMethod = registrationMethod;
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
	
	

	public VoteSession getVoteSession() {
		return voteSession;
	}

	public void setVoteSession(VoteSession voteSession) {
		this.voteSession = voteSession;
	}

	
	
	public int getVoteSessionNumberAttendance() {
		return voteSessionNumberAttendance;
	}

	public void setVoteSessionNumberAttendance(int voteSessionNumberAttendance) {
		this.voteSessionNumberAttendance = voteSessionNumberAttendance;
	}

	@Override
	public String toString() {
		return "Attendance [id=" + id + ", partner=" + partner + ", initiative=" + initiative + ", dateTime=" + dateTime
				+ ", registrationMethod=" + registrationMethod + ", voteSession=" + voteSession + ", status=" + status
				+ "]";
	}

	
}
