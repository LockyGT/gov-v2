package com.solucionesdigitales.vote.repository.partner;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.partner.Partner;

public interface PartnerRepository extends MongoRepository<Partner, String> {
	Partner findBySku(int sku);
	
//	List<Partner> findAllByStatusOrderByNameAsc(int status);
	List<Partner> findAllByStatusOrderByApPaternoAsc(int status);
	
//	List<Partner> findAllByStatusAndTipoPartnerOrderByNameAsc(int status, int tipo);
	List<Partner> findAllByStatusAndTipoPartnerOrderByApPaternoAsc(int status, int tipo);
	
	List<Partner> findAllByStatusAndTipoPartnerOrderByApPaternoAscApMaternoAscNameAsc(int status, int tipo);
	
	Partner findByUserId(String user);
	
	Partner findFirstById(String id);
	
	List<Partner> findAllByOrderByNameAsc();

	List<Partner> findByStatus(int status);
}
