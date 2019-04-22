package com.solucionesdigitales.vote.service;

import java.nio.file.Path;

import org.springframework.core.io.Resource;

public interface StorageService {
	 public Resource loadAsResourceSubDir(String filename, String subDir);

	Path cargar(String filename);
}
