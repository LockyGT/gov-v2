package com.solucionesdigitales.vote.service.partner;

import java.util.List;

import com.solucionesdigitales.vote.entity.partner.PartnerHasFingerPrint;
import com.solucionesdigitales.vote.entity.partner.Partner;

public interface PartnerHasFingerPrintService {
	
	List<PartnerHasFingerPrint> fetch();

	PartnerHasFingerPrint post(PartnerHasFingerPrint entity);
	
	boolean identify(PartnerHasFingerPrint lfp);

	PartnerHasFingerPrint put(PartnerHasFingerPrint entity);

	List<PartnerHasFingerPrint> fetchByLegislatorId(String id);

	Partner identifySkuOnly(PartnerHasFingerPrint lfp);

	Partner identifyUsernameOnly(PartnerHasFingerPrint entity);

	List<PartnerHasFingerPrint> fetchByPartnerIdAndStatus(String id, int status);

	boolean putToDelete(String partnerId, int index);
}
