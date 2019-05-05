package com.solucionesdigitales.vote.entity.partner;

import com.solucionesdigitales.vote.entity.Attendance;
import com.solucionesdigitales.vote.entity.vote.Vote;

public class PartnerHasVote {
	
	private Partner partner;	
	private Vote vote;
	private Attendance asistencia;
	
	public PartnerHasVote() {
		setVote(new Vote());
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
	 * @return the vote
	 */
	public Vote getVote() {
		return vote;
	}

	/**
	 * @param vote the vote to set
	 */
	public void setVote(Vote vote) {
		this.vote = vote;
	}

	public Attendance getAsistencia() {
		return asistencia;
	}

	public void setAsistencia(Attendance asistencia) {
		this.asistencia = asistencia;
	}

	@Override
	public String toString() {
		return "PartnerHasVote [partner=" + partner + ", vote=" + vote + ", asistencia=" + asistencia + "]";
	}
}
