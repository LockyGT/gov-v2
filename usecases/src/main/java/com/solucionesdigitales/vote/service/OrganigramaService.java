package com.solucionesdigitales.vote.service;

import java.util.List;

import com.solucionesdigitales.vote.entity.Organigrama;

public interface OrganigramaService {

	public Organigrama save(Organigrama org);
	public Organigrama update(Organigrama org);
	public boolean delete(Organigrama org);
	public List<Organigrama> listaOrganigramas();
	
}
