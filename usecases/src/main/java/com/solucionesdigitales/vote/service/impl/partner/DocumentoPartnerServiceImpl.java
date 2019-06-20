package com.solucionesdigitales.vote.service.impl.partner;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.CategoriaDeDocumentos;
import com.solucionesdigitales.vote.entity.Documento;
import com.solucionesdigitales.vote.entity.partner.DocumentoPartner;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.repository.CategoriaDeDocumentosRepository;
import com.solucionesdigitales.vote.repository.partner.DocumentoPartnerRepository;
import com.solucionesdigitales.vote.repository.partner.PartnerRepository;
import com.solucionesdigitales.vote.service.partner.DocumentoPartnerService;

@Service("documentoPartnerService")
public class DocumentoPartnerServiceImpl implements DocumentoPartnerService {
	
	@Autowired
	PartnerRepository partnerRepo;
	@Autowired
	CategoriaDeDocumentosRepository categoriaDocuRepo;
	@Autowired
	DocumentoPartnerRepository documentoParnterRepo;

	@Override
	public DocumentoPartner getDocumentoPartner(String idPartner, String uuidDocumentos) {
		return documentoParnterRepo.findByIdPartnerAndUuidDocumento(idPartner, uuidDocumentos);
	}

	@Override
	public List<DocumentoPartner> getDocumentos(String idPartner) {
		List<DocumentoPartner> lista = new ArrayList<>();
		Optional<Partner> partner = partnerRepo.findById(idPartner);
		CategoriaDeDocumentos categoria = categoriaDocuRepo.findByTipoPartner(
				partner.isPresent() ? partner.get().getTipoPartner() : null);
		List<Documento> configDocu = categoria.getDocumentos();
		DocumentoPartner documentoPartner = null;
		for (Documento documento : configDocu) {
			documentoPartner = this.getDocumentoPartner(idPartner, documento.getUuid());
			if(documentoPartner == null) {
				documentoPartner  = new DocumentoPartner();
				documentoPartner.setUuidDocumento(documento.getUuid());
				documentoPartner.setDocumento(documento);
			}else {
				documentoPartner.setDocumento(documento);
			}
			lista.add(documentoPartner);
		}
		return lista;
	}

	@Override
	public DocumentoPartner saveDocumentoPartner(DocumentoPartner documentoPartner) {
		return documentoParnterRepo.save(documentoPartner);
	}

	@Override
	public DocumentoPartner updateDocumentoPartner(DocumentoPartner documentoPartner) {
		return documentoParnterRepo.save(documentoPartner);
	}

}
