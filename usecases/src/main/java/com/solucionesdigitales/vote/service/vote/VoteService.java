package com.solucionesdigitales.vote.service.vote;

import java.util.List;

import com.solucionesdigitales.vote.entity.vote.Vote;

public interface VoteService {

	List<Vote> fetch();

	Vote post(Vote entity);

	Vote put(Vote entity);

	List<Vote> fetchByInitiativeAndLegislator(String initiativeId, String legislatorId);
	
	List<Vote> fetchByInitiative(String initiativeId);
	
	List<Vote> fetchByLegislator(String legislatorId);
}
