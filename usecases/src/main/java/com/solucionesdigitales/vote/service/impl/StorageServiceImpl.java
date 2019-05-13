package com.solucionesdigitales.vote.service.impl;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import com.solucionesdigitales.vote.entity.GenericFile;
import com.solucionesdigitales.vote.service.StorageService;
import com.solucionesdigitales.vote.service.config.StorageConfig;
import com.solucionesdigitales.vote.service.utils.exceptions.StorageException;
import com.solucionesdigitales.vote.service.utils.exceptions.StorageFileNotFoundException;

/**
 * 
 * @author javier
 *
 */
@Service("storageService")
public class StorageServiceImpl implements StorageService {
	private static final Logger LOGGER = LoggerFactory.getLogger(StorageServiceImpl.class);
	
	private final Path rootLocation;
	
	@Autowired
	public StorageServiceImpl(final StorageConfig properties) {
		this.rootLocation = Paths.get(properties.getLocation());
	}
	
	@Override
	public Path cargar(final String filename) {
		return rootLocation.resolve(filename);
	}
	
	@Override
	public Resource loadAsResourceSubDir(final String filename, final String subDir) {
		LOGGER.info("-----cargando recurso----");
		try {
			final Path file = Paths.get(rootLocation.toString(), subDir, filename);
			//file.resolve(filename);
			LOGGER.info("-----ruta del recurso "+file.toUri()+"----");    
			final Resource resource = new UrlResource(file.toUri());
			if (resource.exists() || resource.isReadable()) {
				return resource;
			}
			else {
				LOGGER.info("-----ruta del recurso "+file.toUri()+" no encontrado----"); 
				LOGGER.info("No se pudo leer archivo: " + filename);
				return(null);
				//throw new StorageFileNotFoundException("No se pudo leer archivo: " + filename);
			}
		}
		catch (final MalformedURLException e) {
			throw new StorageFileNotFoundException("No se pudo leer archivo: " + filename, e);
		}
	}

	@Override
	public GenericFile store(GenericFile file) {
		GenericFile gFile = new GenericFile();
		String path = this.rootLocation.toString()+File.separator+file.getFolder();
		Path location = Paths.get(path);
		
		try {
			if(file.getFile().isEmpty()) {
				 throw new StorageException("Failed to store empty file " + file.getFile().getOriginalFilename());
			}
			if (!new File(path).exists() ){
				new File(path).mkdirs();
			}
			Files.copy(file.getFile().getInputStream(), location.resolve(file.getFile().getOriginalFilename()));
			file.setFile(null);
			gFile = file;
			
		}catch (IOException e) {
			throw new StorageException("Failed to store file " + file.getFile().getOriginalFilename(), e);
		}
		
		return gFile;
	}
	
	@Override
	public ArrayList<com.solucionesdigitales.vote.entity.archive.File> stores(GenericFile files,String userId) {
		
		ArrayList<com.solucionesdigitales.vote.entity.archive.File> savedFiles = 
				new ArrayList<com.solucionesdigitales.vote.entity.archive.File>();
		com.solucionesdigitales.vote.entity.archive.File individualFile = null;
		
		String path = this.rootLocation.toString()+File.separator+files.getFolder();
		Path location = Paths.get(path);
		UUID uuid = null;
		
		try {
			
			if (!new File(path).exists() ){
				new File(path).mkdirs();
			}

			for(MultipartFile file : files.getFiles()) {
				if(file.isEmpty()) {
					 throw new StorageException("Failed to store empty file " + file.getOriginalFilename());
				}
				
				individualFile = new com.solucionesdigitales.vote.entity.archive.File();
				uuid = UUID.randomUUID();
				String fileExtention = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
				String fileName = uuid+fileExtention;
				Files.copy(file.getInputStream(), location.resolve(fileName));
				File f = new File(path+File.separator+fileName);
				
				individualFile.setUserId(userId);
				individualFile.setOriginalName(file.getOriginalFilename());
				individualFile.setServerName(fileName);
				individualFile.setSize(file.getSize());
				individualFile.setLastModification(new Date(f.lastModified()));
				individualFile.setExtention(fileExtention);
				individualFile.setMimeTipe(file.getContentType());
				individualFile.setDate(new Date());
				individualFile.setStatus(1);
				savedFiles.add(individualFile);
				
			}
		} catch(IOException e) {
			throw new StorageException("Failed to store file " + files.getFiles().get(0).getOriginalFilename(), e);
		}
		return savedFiles;
	}
	
	@Override
	public GenericFile updateFile(GenericFile file, String oldFolder, String oldFileName) {
		GenericFile gFile = new GenericFile();
		String newPath = this.rootLocation.toString()+File.separator+file.getFolder();
		String oldPath = this.rootLocation.toString()+File.separator+oldFolder;
		Path location = Paths.get(newPath);
		try {
			if(file.getFile().isEmpty()) {
				 throw new StorageException("Failed to store empty file " + file.getFile().getOriginalFilename());
			}

			File archive = new File(oldPath+"/"+oldFileName);
			File oldFile = new File(oldPath);
			if(archive.exists()) {
				archive.delete();
				LOGGER.info("Viejo, archivo eliminado"); 
			}
			File p = new File(newPath);
			if(oldFile.renameTo(p)){
				LOGGER.info("Ruta actualizada");
			}

			Files.copy(file.getFile().getInputStream(), location.resolve(file.getFile().getOriginalFilename()));
			file.setFile(null);

			gFile = file;
			
		}catch (IOException e) {
			throw new StorageException("Failed to store file " + file.getFile().getOriginalFilename(), e);
		}
		
		return gFile;
	}
	
	@Override
	public GenericFile deleteAllFolder(String folder) {
		GenericFile del = new GenericFile();
		String path = this.rootLocation.toString()+File.separator+folder;
		Path location = Paths.get(path);
		FileSystemUtils.deleteRecursively(location.toFile());
		return del;
	}
}
