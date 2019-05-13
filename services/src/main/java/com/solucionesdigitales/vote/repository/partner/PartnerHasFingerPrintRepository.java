package com.solucionesdigitales.vote.repository.partner;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.partner.PartnerHasFingerPrint;

@Repository
public interface PartnerHasFingerPrintRepository extends MongoRepository<PartnerHasFingerPrint, String>{
	
	List<PartnerHasFingerPrint> findByPartner(Partner partner);

	List<PartnerHasFingerPrint> findByPartnerId(String id);
	
	List<PartnerHasFingerPrint> findByPartnerIdAndFingerPrintFingerIndex(String id, int index);

	List<PartnerHasFingerPrint> findByPartnerIdAndStatus(String id, int status);

}
