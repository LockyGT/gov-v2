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
			// file.resolve(filename);
			LOGGER.info("-----ruta del recurso " + file.toUri() + "----");
			final Resource resource = new UrlResource(file.toUri());
			if (resource.exists() || resource.isReadable()) {
				return resource;
			} else {
				LOGGER.info("-----ruta del recurso " + file.toUri() + " no encontrado----");
				LOGGER.info("No se pudo leer archivo: " + filename);
				return (null);
				// throw new StorageFileNotFoundException("No se pudo leer archivo: " +
				// filename);
			}
		} catch (final MalformedURLException e) {
			throw new StorageFileNotFoundException("No se pudo leer archivo: " + filename, e);
		}
	}

	@Override
	public com.solucionesdigitales.vote.entity.documentfile.File store(GenericFile file) {
		
		UUID uuidFolder = UUID.randomUUID();
		String path = this.rootLocation.toString() + File.separator + file.getFolder();

		if (!new File(path+File.separator +uuidFolder.toString()).exists()) {
			new File(path+File.separator +uuidFolder.toString()).mkdirs();
		}
		return copyFile(file.getFile(),path, uuidFolder.toString(),file.getUserId());

	}

	@Override
	public ArrayList<com.solucionesdigitales.vote.entity.documentfile.File> stores(GenericFile files, String userId) {

		ArrayList<com.solucionesdigitales.vote.entity.documentfile.File> savedFiles 
				= new ArrayList<com.solucionesdigitales.vote.entity.documentfile.File>();
		
		UUID uuidFolder = UUID.randomUUID();
		String path = this.rootLocation.toString() + File.separator + files.getFolder() ;

			if (!new File(path+File.separator +uuidFolder.toString()).exists()) {
				new File(path+File.separator +uuidFolder.toString()).mkdirs();
			}

			for (MultipartFile file : files.getFiles()) {
				
				savedFiles.add(copyFile(file,path, uuidFolder.toString(),files.getUserId()));

			}

		return savedFiles;
	}

	@Override
	public com.solucionesdigitales.vote.entity.documentfile.File updateFile(GenericFile file) {

		com.solucionesdigitales.vote.entity.documentfile.File updatedFile = new com.solucionesdigitales.vote.entity.documentfile.File();

		String path = this.rootLocation.toString() + File.separator + file.getFolder();
		UUID uuid = null;
		String folder = path.substring(path.lastIndexOf("/") + 1);

		try {
			Path location = Paths.get(path);
			moveRecycleBin(file.getFolder(), file.getServerName(), file.getOriginalName());
			if (file.getFile().isEmpty()) {
				throw new StorageException("Failed to store empty file " + file.getFile().getOriginalFilename());
			}
			String fileExtention = file.getFile().getOriginalFilename()
					.substring(file.getFile().getOriginalFilename().lastIndexOf(".") + 1);
			uuid = UUID.randomUUID();
			String fileName = uuid + "." + fileExtention;

			Files.copy(file.getFile().getInputStream(), location.resolve(fileName));
			File f = new File(path + File.separator + fileName);

			updatedFile.setUserId(file.getUserId());
			updatedFile.setOriginalName(file.getFile().getOriginalFilename());
			updatedFile.setServerName(fileName);
			updatedFile.setFolder(folder);
			updatedFile.setSize(file.getFile().getSize());
			updatedFile.setLastModification(new Date(f.lastModified()));
			updatedFile.setExtention(fileExtention);
			updatedFile.setMimeType(file.getFile().getContentType());
			updatedFile.setDate(new Date());
			updatedFile.setStatus(1);
		} catch (IOException e) {
			throw new StorageException("Failed to update files ", e);
		}

		return updatedFile;
	}

	@Override
	public ArrayList<com.solucionesdigitales.vote.entity.documentfile.File> updateFiles(GenericFile files,
			ArrayList<String> oldServerNames, ArrayList<String> oldOriginalNames, String userId) {

		ArrayList<com.solucionesdigitales.vote.entity.documentfile.File> updatedFiles = new ArrayList<com.solucionesdigitales.vote.entity.documentfile.File>();
		com.solucionesdigitales.vote.entity.documentfile.File individualFile = null;
		String path = this.rootLocation.toString() + File.separator + files.getFolder();
		UUID uuid = null;
		String folder = path.substring(path.lastIndexOf("/") + 1);
		try {
			Path location = Paths.get(path);
			int i = 0;

			for (String oldServerName : oldServerNames) {
				LOGGER.info("-----cargando recurso----");
				moveRecycleBin(files.getFolder(), oldServerName, oldOriginalNames.get(i));
				
				i++;
			}

			for (MultipartFile file : files.getFiles()) {
				if (file.isEmpty()) {
					throw new StorageException("Failed to store empty file " + file.getOriginalFilename());
				}
				individualFile = new com.solucionesdigitales.vote.entity.documentfile.File();
				uuid = UUID.randomUUID();
				String fileExtention = file.getOriginalFilename()
						.substring(file.getOriginalFilename().lastIndexOf(".") + 1);
				String fileName = uuid + "." + fileExtention;

				Files.copy(file.getInputStream(), location.resolve(fileName));
				File f = new File(path + File.separator + fileName);

				individualFile.setUserId(userId);
				individualFile.setOriginalName(file.getOriginalFilename());
				individualFile.setServerName(fileName);
				individualFile.setFolder(folder);
				individualFile.setSize(file.getSize());
				individualFile.setLastModification(new Date(f.lastModified()));
				individualFile.setExtention(fileExtention);
				individualFile.setMimeType(file.getContentType());
				individualFile.setDate(new Date());
				individualFile.setStatus(1);
				updatedFiles.add(individualFile);

			}
		} catch (IOException e) {
			throw new StorageException("Failed to store files ", e);
		}
		return updatedFiles;
	}

	@Override
	public ArrayList<com.solucionesdigitales.vote.entity.documentfile.File> copyToVersionedFolder(GenericFile files) {
		ArrayList<com.solucionesdigitales.vote.entity.documentfile.File> versionedFiles = new ArrayList<com.solucionesdigitales.vote.entity.documentfile.File>();
		String path = this.rootLocation.toString() + File.separator + files.getFolder();
		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
		
		long ms = System.currentTimeMillis();
		Path target = null;
		Path source = null;
		UUID uuid = UUID.randomUUID();
		String newFolder = "v_" + dateFormat.format(date)+"_"+uuid.toString();
		try {
			if(files.getFilesInfo() != null) {
				for (com.solucionesdigitales.vote.entity.documentfile.File f : files.getFilesInfo()) {
					source = Paths.get(path + File.separator + f.getFolder() + File.separator + f.getServerName());
					target = Paths.get(path + File.separator + newFolder + File.separator + f.getServerName());

					if (source.toFile().exists() && f.getStatus() == 1) {
						Files.copy(source, target);
						target.toFile().setLastModified(ms);
						f.setDate(new Date());
						f.setLastModification(new Date(target.toFile().lastModified()));
					}
					versionedFiles.add(f);
				}
			}

			for (MultipartFile mf : files.getFiles()) {
				versionedFiles.add(copyFile(mf,path, newFolder,files.getUserId()));
				
			}
		} catch (IOException e) {

		}
		return versionedFiles;
	}

	@Override
	public ArrayList<com.solucionesdigitales.vote.entity.documentfile.File> moveFolderRecycleBin(GenericFile gf) {

		ArrayList<com.solucionesdigitales.vote.entity.documentfile.File> deletedFiles = new ArrayList<com.solucionesdigitales.vote.entity.documentfile.File>();
		String folderDocument = "";
		for (com.solucionesdigitales.vote.entity.documentfile.File file : gf.getFilesInfo()) {
			folderDocument = gf.getFolder() + File.separator + file.getFolder();
			moveRecycleBin(folderDocument, file.getOriginalName(), file.getServerName());
			file.setStatus(0);
			deletedFiles.add(file);
		}

		File dirFolder = new File(this.rootLocation.toString() + File.separator + folderDocument);
		if (dirFolder.list().length == 0) {
			if (dirFolder.delete())
				LOGGER.info("-----Carpeta eliminada: " + dirFolder.toString() + "----");
		}

		dirFolder = null;
		return deletedFiles;
	}

	@Override
	public GenericFile moveRecycleBin(String urlServerFile, String originalName, String serverName) {
		GenericFile del = new GenericFile();
		String[] serverFile = serverName.split("\\.");
		Date date = new Date();
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
		String urlRecycleBin = this.rootLocation.toString() + File.separator + "Recycle Bin";
		long ms = System.currentTimeMillis();
		Path target = Paths.get(
				urlRecycleBin + File.separator + serverFile[0] + "_" + dateFormat.format(date) + "_" + originalName);

		Path source = Paths
				.get(this.rootLocation.toString() + File.separator + urlServerFile + File.separator + serverName);
		try {
			if (!new File(urlRecycleBin).exists()) {
				new File(urlRecycleBin).mkdirs();
			}
			if (source.toFile().exists()) {
				Files.move(source, target);
				target.toFile().setLastModified(ms);
				del.setFolder(urlServerFile);
				LOGGER.info("-----Archivo movido a la papelera: " + originalName + "----");
			}

		} catch (IOException e) {
			throw new StorageException("Failed delete file " + originalName, e);
		}
		return del;
	}

	@Override
	public com.solucionesdigitales.vote.entity.documentfile.File copyFile(MultipartFile multipartFile,
			String path, String folder,String userId) {
		
		com.solucionesdigitales.vote.entity.documentfile.File file =
				new com.solucionesdigitales.vote.entity.documentfile.File();
		UUID uuid = UUID.randomUUID();
		Path location = Paths.get(path+File.separator+folder);
		String fileExtention = multipartFile.getOriginalFilename()
				.substring(multipartFile.getOriginalFilename().lastIndexOf(".") + 1);
		String fileName = uuid + "." + fileExtention;
		try {
			if (multipartFile.isEmpty()) {
				throw new StorageException("Failed to store empty file " + multipartFile.getOriginalFilename());
			}
			Files.copy(multipartFile.getInputStream(), location.resolve(fileName));
			File f = new File(path+File.separator+folder + File.separator + fileName);
	
			file.setUserId(userId);
			file.setOriginalName(multipartFile.getOriginalFilename());
			file.setServerName(fileName);
			file.setFolder(folder);
			file.setSize(multipartFile.getSize());
			file.setLastModification(new Date(f.lastModified()));
			file.setExtention(fileExtention);
			file.setMimeType(multipartFile.getContentType());
			file.setDate(new Date());
			file.setStatus(1);
		} catch (IOException e) {
			throw new StorageException("Failed to store file " + multipartFile.getOriginalFilename(), e);

		}
		return file;
	}
}
