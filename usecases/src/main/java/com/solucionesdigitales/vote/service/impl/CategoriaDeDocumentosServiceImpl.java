package com.solucionesdigitales.vote.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.CategoriaDeDocumentos;
import com.solucionesdigitales.vote.repository.CategoriaDeDocumentosRepository;
import com.solucionesdigitales.vote.service.CategoriaDeDocumentosService;

@Service("categoriaDeDocumentosService")
public class CategoriaDeDocumentosServiceImpl implements CategoriaDeDocumentosService {
	
	@Autowired
	CategoriaDeDocumentosRepository repo;

	@Override
	public CategoriaDeDocumentos findByTipoPatner(int tipoPartner) {
		return repo.findByTipoPartner(tipoPartner);
	}

	@Override
	public CategoriaDeDocumentos saveCategoriaDeDocumentos(CategoriaDeDocumentos categoriaDeDocumentos) {
		
		return repo.save(categoriaDeDocumentos);
	}

	@Override
	public CategoriaDeDocumentos updateCategoriaDeDocumentos(CategoriaDeDocumentos categoriaDeDocumentos) {
		return repo.save(categoriaDeDocumentos);
	}

}
