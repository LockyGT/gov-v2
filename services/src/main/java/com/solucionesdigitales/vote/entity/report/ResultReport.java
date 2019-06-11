package com.solucionesdigitales.vote.entity.report;

import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.entity.vote.VoteSession;

public class ResultReport {
	
	private VoteSession session;
	private Initiative initiative;
	/**
	 * @return the session
	 */
	public VoteSession getSession() {
		return session;
	}
	/**
	 * @param session the session to set
	 */
	public void setSession(VoteSession session) {
		this.session = session;
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
	
	
	
}
