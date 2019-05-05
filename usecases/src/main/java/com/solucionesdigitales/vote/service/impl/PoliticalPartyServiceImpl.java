package com.solucionesdigitales.vote.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.PoliticalParty;
import com.solucionesdigitales.vote.repository.PoliticalPartyRepository;
import com.solucionesdigitales.vote.service.PoliticalPartyService;
import com.solucionesdigitales.vote.service.utils.Utils;

@Service("politicalPartyService")
public class PoliticalPartyServiceImpl implements PoliticalPartyService {
	
	@Autowired
	private PoliticalPartyRepository repo;
	@Autowired
	private Utils utils;
	
	@Override
	public List<PoliticalParty> fetch() {		
//		List<PoliticalParty> partidos= repo.findAll();	
		List<PoliticalParty> partidos= repo.findAllByStatus(1);	
		return partidos;
	}

	@Override
	public PoliticalParty post(PoliticalParty entity) {
		PoliticalParty politicalParty = new PoliticalParty();
		if (entity != null && entity.getLogo() != null && entity.getLogo().trim().length() > 0) {
			String str64Logo = entity.getLogo().trim();
			entity.setLogo("");
			politicalParty = repo.save(entity); 
			politicalParty.setLogo(utils.saveImageFromBase64(str64Logo, entity.getId(),"politicalParty")); // se manda a guardar primero para recuperar el ID y usarlo de nombre
			politicalParty = repo.save(politicalParty); //Se reemplaza por el doc que trae ya con la ruta actualizada del logo
		}else {
			politicalParty = repo.save(entity); 
		}
		return politicalParty;
	}

	@Override
	public PoliticalParty put(PoliticalParty entity) {
		PoliticalParty politicalParty = new PoliticalParty();
		if (entity != null && entity.getLogo() != null && entity.getLogo().trim().length() > 0) {
			String str64Logo = entity.getLogo().trim();
			entity.setLogo(utils.saveImageFromBase64(str64Logo, entity.getId(), "politicalParty"));
			politicalParty = repo.save(entity); 
		}else {
			politicalParty = repo.save(entity); 
		}
		return politicalParty;
	}

	@Override
	public PoliticalParty fetchByAcronymAndStatus(String acronym, int status) {
		Optional<PoliticalParty> o = repo.findFirstByAcronymAndStatus(acronym,status);
		PoliticalParty vs = null;
		if(o.isPresent()) {
			vs = o.get();
		}
		return vs;
//		return repo.findByAcronymAndStatus(acronym, status);
	}

	

    

}
