package com.solucionesdigitales.vote.service.module;

import java.util.List;

import com.solucionesdigitales.vote.entity.module.ModuloOd;

public interface ModuloOdService {
	
	List<ModuloOd> fetch();
	
	ModuloOd findFirstById(String id);
	
	ModuloOd post(ModuloOd entity);
	
	ModuloOd put (ModuloOd entity);
	
	ModuloOd delete (ModuloOd entity);
	
}