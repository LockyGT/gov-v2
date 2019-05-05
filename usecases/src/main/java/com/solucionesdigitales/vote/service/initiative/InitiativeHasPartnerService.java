package com.solucionesdigitales.vote.service.initiative;

import com.solucionesdigitales.vote.entity.initiative.InitiativeHasPartner;

public interface InitiativeHasPartnerService {
	
	InitiativeHasPartner fetchInitiativePartnerByInitiativeId(String id);
}
