package com.solucionesdigitales.vote.service.partner;

import java.util.List;

import com.solucionesdigitales.vote.entity.partner.PartnerHasVote;

public interface PartnerHasVoteService {
	List<PartnerHasVote> get();

	List<PartnerHasVote> fetchByVoteSessionId(String voteSessionId);
}
