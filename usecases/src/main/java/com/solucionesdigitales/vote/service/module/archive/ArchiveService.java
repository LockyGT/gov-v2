package com.solucionesdigitales.vote.service.module.archive;

import java.util.List;

import com.solucionesdigitales.vote.entity.archive.Archive;

public interface ArchiveService {
	
	List<Archive> fetch(String id);
	
	Archive post(Archive entity);
	
	Archive put (Archive entity);
	
	Archive delete (Archive entity);
}
