package com.solucionesdigitales.vote.entity.initiative;

import java.util.List;

import com.solucionesdigitales.vote.entity.partner.PartnerHasVote;

public class InitiativeHasPartner {
	
	private Initiative initiative;
	private List<PartnerHasVote> partnerHasVote;
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
	 * @return the partnerHasVote
	 */
	public List<PartnerHasVote> getPartnerHasVote() {
		return partnerHasVote;
	}
	/**
	 * @param partnerHasVote the partnerHasVote to set
	 */
	public void setPartnerHasVote(List<PartnerHasVote> partnerHasVote) {
		this.partnerHasVote = partnerHasVote;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "InitiativeHasPartner [initiative=" + initiative + ", partnerHasVote=" + partnerHasVote + "]";
	}
	
}
