package com.solucionesdigitales.vote.service.module.documentfile;

import java.util.Date;
import java.util.List;

import com.solucionesdigitales.vote.entity.documentfile.DocumentFile;

public interface DocumentFileService {
	
	List<DocumentFile> fetch(int status, String moduloId, int moduloodStatus);
	
	List<DocumentFile> fetchByBetweenDates(int status, String moduloodId, int moduloodStatus, Date dateStart, Date dateEnd);
	
	DocumentFile post(DocumentFile entity);
	
	DocumentFile put (DocumentFile entity);
	
	DocumentFile delete (DocumentFile entity);
}
