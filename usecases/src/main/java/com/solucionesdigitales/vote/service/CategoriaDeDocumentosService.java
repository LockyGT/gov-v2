package com.solucionesdigitales.vote.service;

import com.solucionesdigitales.vote.entity.CategoriaDeDocumentos;

public interface CategoriaDeDocumentosService {
	
	public CategoriaDeDocumentos findByTipoPatner(int tipoPartner);
	public CategoriaDeDocumentos saveCategoriaDeDocumentos(CategoriaDeDocumentos categoriaDeDocumentos);
	public CategoriaDeDocumentos updateCategoriaDeDocumentos(CategoriaDeDocumentos categoriaDeDocumentos);
}
