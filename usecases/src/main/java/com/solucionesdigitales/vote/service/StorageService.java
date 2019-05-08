package com.solucionesdigitales.vote.service;

import java.nio.file.Path;

import org.springframework.core.io.Resource;

import com.solucionesdigitales.vote.entity.GenericFile;

public interface StorageService {
	 public Resource loadAsResourceSubDir(String filename, String subDir);

	Path cargar(String filename);
	
	GenericFile store(GenericFile file);
	
	GenericFile updateFile(GenericFile file, String oldFolder ,String oldFileName);
	
	GenericFile deleteAllFolder(String file);
	
	
}
