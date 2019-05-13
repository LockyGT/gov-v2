package com.solucionesdigitales.vote.service;

import java.nio.file.Path;
import java.util.ArrayList;

import org.springframework.core.io.Resource;

import com.solucionesdigitales.vote.entity.GenericFile;
import com.solucionesdigitales.vote.entity.archive.File;

public interface StorageService {
	 public Resource loadAsResourceSubDir(String filename, String subDir);

	Path cargar(String filename);
	
	GenericFile store(GenericFile file);
	
	ArrayList<File> stores(GenericFile files, String userId);
	
	GenericFile updateFile(GenericFile file, String oldFolder ,String oldFileName);
	
	GenericFile deleteAllFolder(String file);
	
	
}
