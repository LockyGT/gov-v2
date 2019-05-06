package com.solucionesdigitales.vote.service.impl.archive;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.archive.Archive;
import com.solucionesdigitales.vote.repository.archive.ArchiveRepository;
import com.solucionesdigitales.vote.service.module.archive.ArchiveService;

@Service("archiveService")
public class ArchiveServiceImpl implements ArchiveService{
	
	private static final Logger logger = LoggerFactory.getLogger(ArchiveServiceImpl.class);
	
	@Autowired
	private ArchiveRepository repository;
	
	@Override
	public List<Archive> fetch() {
		List<Archive> records = repository.findByStatus(1);
		return records;
	}

	@Override
	public Archive post(Archive entity) {
		Archive archive = new Archive();
		if(entity.getFecha() != null & entity.getNombre() != null & entity.getUrlArchivo() != null) {
			archive = repository.save(entity);
			logger.info("Archivo registrado: ["+entity.toString()+"]");
		}
		return archive;
	}

	@Override
	public Archive put(Archive entity) {
		Archive archive = new Archive();
		if(entity.getFecha() != null & entity.getNombre() != null) {
			archive = repository.save(entity);
			logger.info("Archivo registrado: ["+entity.toString()+"]");
		}
		return archive;
	}

	@Override
	public Archive delete(Archive entity) {
		Archive archive = new Archive();
		entity.setStatus(0);
		if(entity.getFecha() != null & entity.getNombre() != null) {
			archive = repository.save(entity);
			logger.info("Archivo eliminado: ["+entity.toString()+"]");
		}
		return archive;
	}

}
