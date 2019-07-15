package com.solucionesdigitales.vote.service.partner;

import java.util.List;

import com.solucionesdigitales.vote.entity.partner.Partner;

public interface PartnerService {

	List<Partner> fetch();
	
	List<Partner> fetchByStatusAndTipoAndAreaId(int status, int tipo, String id);
	
	Partner fetchBySku(int sku);
	
	Partner post(Partner entity);

	Partner put(Partner entity);

	Partner findByUserUsername(String username);

	List<Partner> fetchByStatus(int status);

	Partner fetchOneByStatus(int status);
	
	Partner fetchById(String id);

	Partner findByUsernameAndPassword(String username, String password);
	
	List<Partner> fetchByStatusAndTipoAndPartidoName(int status, int tipo);
}
