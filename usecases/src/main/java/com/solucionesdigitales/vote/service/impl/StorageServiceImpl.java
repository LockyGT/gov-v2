package com.solucionesdigitales.vote.service.impl;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
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
	public com.solucionesdigitales.vote.entity.archive.File store(GenericFile file) {
		com.solucionesdigitales.vote.entity.archive.File gFile = new com.solucionesdigitales.vote.entity.archive.File();
		UUID uuidFolder = UUID.randomUUID();
		String path = this.rootLocation.toString()+File.separator+file.getFolder()+File.separator+uuidFolder.toString();
		Path location = Paths.get(path);
		MultipartFile archive = file.getFile();
		UUID uuid = null;
		try {
			if(file.getFile().isEmpty()) {
				 throw new StorageException("Failed to store empty file " + file.getFile().getOriginalFilename());
			}
			if (!new File(path).exists() ){
				new File(path).mkdirs();
			}
			
			String fileExtention = archive.getOriginalFilename().substring(archive.getOriginalFilename().lastIndexOf(".")+1);
			String fileName = uuid+"."+fileExtention;
			Files.copy(file.getFile().getInputStream(), location.resolve(fileName));
			File f = new File(path+File.separator+fileName);
			
			gFile.setUserId(file.getUserId());
			gFile.setOriginalName(archive.getOriginalFilename());
			gFile.setServerName(fileName);
			gFile.setFolder(uuidFolder.toString());
			gFile.setSize(archive.getSize());
			gFile.setLastModification(new Date(f.lastModified()));
			gFile.setExtention(fileExtention);
			gFile.setMimeTipe(archive.getContentType());
			gFile.setDate(new Date());
			gFile.setStatus(1);
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
		UUID uuidFolder = UUID.randomUUID();
		String path = this.rootLocation.toString()+File.separator+files.getFolder()+File.separator+uuidFolder.toString();
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
				String fileExtention = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
				String fileName = uuid+"."+fileExtention;
				Files.copy(file.getInputStream(), location.resolve(fileName));
				File f = new File(path+File.separator+fileName);
				
				individualFile.setUserId(userId);
				individualFile.setOriginalName(file.getOriginalFilename());
				individualFile.setServerName(fileName);
				individualFile.setFolder(uuidFolder.toString());
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
	public ArrayList<com.solucionesdigitales.vote.entity.archive.File>  
			updateFiles(GenericFile files, ArrayList<String> oldServerNames, ArrayList<String> oldOriginalNames, String userId) {
		
		ArrayList<com.solucionesdigitales.vote.entity.archive.File> updatedFiles = 
				new ArrayList<com.solucionesdigitales.vote.entity.archive.File>();
		com.solucionesdigitales.vote.entity.archive.File individualFile = null;
		String path = this.rootLocation.toString()+File.separator+files.getFolder();
		UUID uuid = null;
		String folder = path.substring(path.lastIndexOf("/")+1);
		try {
			Path location = Paths.get(path);
			int i = 0;
			
			for(String oldServerName : oldServerNames) {
				
				moveRecycleBin(files.getFolder(), oldServerName, oldOriginalNames.get(i));
				i++;
			}
			
			for(MultipartFile file : files.getFiles()) {
				if(file.isEmpty()) {
					 throw new StorageException("Failed to store empty file " + file.getOriginalFilename());
				}
				individualFile = new com.solucionesdigitales.vote.entity.archive.File();
				uuid = UUID.randomUUID();
				String fileExtention = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
				String fileName = uuid+"."+fileExtention;
				
				Files.copy(file.getInputStream(), location.resolve(fileName));
				File f = new File(path+File.separator+fileName);
				
				individualFile.setUserId(userId);
				individualFile.setOriginalName(file.getOriginalFilename());
				individualFile.setServerName(fileName);
				individualFile.setFolder(folder);
				individualFile.setSize(file.getSize());
				individualFile.setLastModification(new Date(f.lastModified()));
				individualFile.setExtention(fileExtention);
				individualFile.setMimeTipe(file.getContentType());
				individualFile.setDate(new Date());
				individualFile.setStatus(1);
				updatedFiles.add(individualFile);
				
			}
		}catch(IOException e) {
			throw new StorageException("Failed to store files ", e);
		}
		return updatedFiles;
	}
	@Override
	public GenericFile updateFile(GenericFile file, String oldFolder, String oldFileName) {
		GenericFile gFile = new GenericFile();
		String newPath = this.rootLocation.toString()+File.separator+file.getFolder();
		String oldPath = this.rootLocation.toString()+File.separator+oldFolder;
		
		Path location = Paths.get(newPath);
		try {

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
	public GenericFile moveRecycleBin(String urlServerFile, String originalName, String serverName) {
		GenericFile del = new GenericFile();
		String[] serverFile = serverName.split("\\.");
		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
		String urlRecycleBin = this.rootLocation.toString()+File.separator+"Recycle Bin";
		long ms = System.currentTimeMillis();
		Path target = Paths.get(urlRecycleBin+File.separator+serverFile[0]+"_"+dateFormat.format(date)+"_"+originalName);
		
		Path source = Paths.get(this.rootLocation.toString()+File.separator+urlServerFile+File.separator+serverName);
		try {
			if (!new File(urlRecycleBin).exists() ){
				new File(urlRecycleBin).mkdirs();
			}
			if(source.toFile().exists()) {
				Files.move(source, target);
				target.toFile().setLastModified(ms);
				del.setFolder(urlServerFile);
			}
			
		} catch (IOException e) {
			throw new StorageException("Failed delete file " + originalName, e);
		}
		return del;
	}
}
