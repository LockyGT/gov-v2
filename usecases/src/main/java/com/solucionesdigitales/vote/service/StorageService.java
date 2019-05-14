package com.solucionesdigitales.vote.service;

import java.nio.file.Path;
import java.util.ArrayList;

import org.springframework.core.io.Resource;

import com.solucionesdigitales.vote.entity.GenericFile;
import com.solucionesdigitales.vote.entity.archive.File;

public interface StorageService {
	 public Resource loadAsResourceSubDir(String filename, String subDir);

	Path cargar(String filename);
	
	File store(GenericFile file);
	
	ArrayList<File> stores(GenericFile files, String userId);
	
	GenericFile updateFile(GenericFile file, String oldFolder ,String oldFileName);
	
	ArrayList<File> updateFiles(GenericFile files, ArrayList<String> oldServerName, ArrayList<String>oldOriginalName, String userId);
	
	GenericFile moveRecycleBin(String urlServerFile, String originalName, String serverName);
	
	
}
