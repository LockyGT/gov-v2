package com.solucionesdigitales.vote.service.partner;

import java.util.List;

import com.solucionesdigitales.vote.entity.partner.DocumentoPartner;

public interface DocumentoPartnerService {

	public DocumentoPartner getDocumentoPartner(String idPartner, String uuidDocumentos);
	public List<DocumentoPartner> getDocumentos(String idPartner);
	public DocumentoPartner saveDocumentoPartner(DocumentoPartner documentoPartner);
	public DocumentoPartner updateDocumentoPartner(DocumentoPartner documentoPartner);
}
