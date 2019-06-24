package com.solucionesdigitales.vote.repository.partner;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.partner.DocumentoPartner;

@Repository
public interface DocumentoPartnerRepository extends MongoRepository<DocumentoPartner, String>{

	public DocumentoPartner  findByIdPartnerAndUuidDocumento(String idPartner, String uuid);

}
