package com.solucionesdigitales.vote.service;

import java.nio.file.Path;
import java.util.ArrayList;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.solucionesdigitales.vote.entity.GenericFile;
import com.solucionesdigitales.vote.entity.documentfile.Attached;
import com.solucionesdigitales.vote.entity.documentfile.File;

public interface StorageService {
	public Resource loadAsResourceSubDir(String filename, String subDir);

	public byte[] loadAsResourceZip(ArrayList<String> serverNames, ArrayList<String> originalNames, String folder);

	Path cargar(String filename);

	File store(GenericFile file);

	ArrayList<File> stores(GenericFile files, String userId);

	File updateFile(GenericFile file);

	ArrayList<File> updateFiles(GenericFile files, ArrayList<String> oldServerNames, ArrayList<String> oldOriginalNames,
			String userId);

	Attached copyToVersionedFolder(ArrayList<MultipartFile> files, ArrayList<String> filesServerName, String folder,
			String oldFolder, String userId);

	ArrayList<File> moveFolderRecycleBin(GenericFile gf);

	GenericFile moveRecycleBin(String urlServerFile, String originalName, String serverName);

	File copyFile(MultipartFile multipartFile, String path, String folder, String userId);

}
