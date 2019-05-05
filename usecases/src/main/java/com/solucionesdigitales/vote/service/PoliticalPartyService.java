package com.solucionesdigitales.vote.service;

import java.util.List;

import com.solucionesdigitales.vote.entity.PoliticalParty;

public interface PoliticalPartyService {

	List<PoliticalParty> fetch();
	
	PoliticalParty fetchByAcronymAndStatus(String acronym, int status);

	PoliticalParty post(PoliticalParty entity);

	PoliticalParty put(PoliticalParty entity);
}
