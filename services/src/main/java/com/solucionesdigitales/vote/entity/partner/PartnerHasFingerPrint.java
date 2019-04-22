package com.solucionesdigitales.vote.entity.partner;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.fingerprint.FingerPrint;

@Document(collection = "partner_has_finger_print")
public class PartnerHasFingerPrint {
	
	@Id
	private String id;
	@DBRef
	private Partner partner;
	@DBRef
	private FingerPrint fingerPrint;
	
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
	 * @return the fingerPrint
	 */
	public FingerPrint getFingerPrint() {
		return fingerPrint;
	}

	/**
	 * @param fingerPrint the fingerPrint to set
	 */
	public void setFingerPrint(FingerPrint fingerPrint) {
		this.fingerPrint = fingerPrint;
	}
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "PartnerHasFingerPrint [partner=" + partner + ", fingerPrint=" + fingerPrint + "]";
	}
	
}
