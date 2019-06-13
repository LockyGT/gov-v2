package com.solucionesdigitales.vote.service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.Organigrama;
import com.solucionesdigitales.vote.repository.OrganigramaRepository;
import com.solucionesdigitales.vote.service.OrganigramaService;

@Service("organigramaService")
public class OrganigramaServiceImpl implements OrganigramaService {

	@Autowired
	OrganigramaRepository repo;
	
	@Override
	public Organigrama save(Organigrama org) {
		LocalDate a = LocalDate.now();
		org.setCreado(a);
		return repo.save(org);
	}

	@Override
	public Organigrama update(Organigrama org) {
		return repo.save(org);
	}

	@Override
	public boolean delete(Organigrama org) {
		repo.delete(org);
		Optional<Organigrama> organigrama = repo.findById(org.getId());
		return !organigrama.isPresent();
	}

	@Override
	public List<Organigrama> listaOrganigramas() {
		return repo.findByOrderByCreado();
	}

}
