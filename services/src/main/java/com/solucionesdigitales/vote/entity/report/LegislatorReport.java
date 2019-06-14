package com.solucionesdigitales.vote.entity.report;

import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.vote.Vote;
import com.solucionesdigitales.vote.entity.vote.VoteSession;

public class LegislatorReport {
	
	private Partner partner;
	private VoteSession voteSession;
	private Initiative initiative;
	private Vote vote;
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
	 * @return the voteSession
	 */
	public VoteSession getVoteSession() {
		return voteSession;
	}
	/**
	 * @param voteSession the voteSession to set
	 */
	public void setVoteSession(VoteSession voteSession) {
		this.voteSession = voteSession;
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
	
	
}
