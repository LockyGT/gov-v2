package com.solucionesdigitales.vote.service.impl.archive;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.archive.DocumentFile;
import com.solucionesdigitales.vote.repository.archive.DocumentFileRepository;
import com.solucionesdigitales.vote.service.module.archive.DocumentFileService;

@Service("documentFileService")
public class DocumentFileServiceImpl implements DocumentFileService{
	
	private static final Logger logger = LoggerFactory.getLogger(DocumentFileServiceImpl.class);
	
	@Autowired
	private DocumentFileRepository repository;
	
	@Override
	public List<DocumentFile> fetch(int status, String moduloId, int moduloodStatus) {
		List<DocumentFile> records = repository.findByStatusAndModuloodIdAndModuloodStatusOrderByFecha(status, moduloId,moduloodStatus);
		return records;
	}
	
	@Override
	public List<DocumentFile> fetchByDeleteDate(Date deleteDate) {
	
		return repository.findByStatusAndDeleteDateLessThan(0, deleteDate);
	}

	@Override
	public DocumentFile post(DocumentFile entity) {
		DocumentFile archive = new DocumentFile();
		if(entity.getFecha() != null & entity.getNombre() != null) {
			UUID uuid = UUID.randomUUID();
			entity.setFolder(uuid.toString());
			archive = repository.save(entity);
			logger.info("Archivo registrado: ["+entity.toString()+"]");
		}
		return archive;
	}

	@Override
	public DocumentFile put(DocumentFile entity) {
		DocumentFile archive = new DocumentFile();
		if(entity.getFecha() != null & entity.getNombre() != null) {
			archive = repository.save(entity);
			logger.info("Archivo registrado: ["+entity.toString()+"]");
		}
		return archive;
	}

	@Override
	public DocumentFile delete(DocumentFile entity) {
		DocumentFile archive = new DocumentFile();
		entity.setStatus(0);
		entity.setDeleteDate(new Date());
		if(entity.getFecha() != null & entity.getNombre() != null) {
			repository.save(entity);
			archive = entity;
			logger.info("Archivo eliminado: ["+entity.toString()+"]");
		}
		return archive;
	}
}
