package com.solucionesdigitales.vote.service.impl.module;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.module.ModuloOd;
import com.solucionesdigitales.vote.repository.module.ModuloOdRepository;
import com.solucionesdigitales.vote.service.module.ModuloOdService;

@Service("moduloService")
public class ModuloOdServiceImpl implements ModuloOdService {

	private static final Logger logger = LoggerFactory.getLogger(ModuloOdServiceImpl.class);
	
	@Autowired 
	private ModuloOdRepository repository;
	
	@Override
	public List<ModuloOd> fetch() {
		List<ModuloOd> modulosOd = repository.findByStatus(1);
		return modulosOd;
	}

	@Override
	public ModuloOd post(ModuloOd entity) {
		ModuloOd moduloOd = new ModuloOd();
		
		if(entity.getNombre() != null) {
			moduloOd = repository.save(entity);
			logger.info("Modulo registrado: ["+entity+"]");
		}
		return moduloOd;
	}

	@Override
	public ModuloOd put(ModuloOd entity) {
		ModuloOd moduloOd = new ModuloOd();
		
		if(entity.getNombre() != null) {
			moduloOd = repository.save(entity);
			logger.info("Modulo actualizado: ["+entity+"]");
		}
		return moduloOd;
	}

	@Override
	public ModuloOd delete(ModuloOd entity) {
		ModuloOd moduloOd = new ModuloOd();
		
		if(entity.getId() != null) {
			entity.setStatus(0);
			moduloOd = repository.save(entity);
			logger.info("Modulo eliminado: ["+entity+"]");
		}
		return moduloOd;
	}

}
