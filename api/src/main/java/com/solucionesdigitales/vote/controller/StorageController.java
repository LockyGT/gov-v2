package com.solucionesdigitales.vote.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.solucionesdigitales.vote.entity.GenericFile;
import com.solucionesdigitales.vote.entity.documentfile.File;
import com.solucionesdigitales.vote.service.StorageService;
import com.solucionesdigitales.vote.service.utils.Utils;
import com.solucionesdigitales.vote.service.utils.exceptions.StorageFileNotFoundException;

/**
 * 
 * @author javier
 *
 */
@RestController
@RequestMapping("files")
public class StorageController {
	private static final Logger logger = LoggerFactory.getLogger(StorageController.class);	
	private final StorageService storageService;
	@SuppressWarnings("unused")
	private static final String USER_AGENT = "Mozilla/5.0";
	@Autowired
	Utils utils;
	
	/**
	 * 
	 * @param storageService
	 */
	@Autowired
	public StorageController(StorageService storageService) {
		this.storageService = storageService;
	}
	
	/**
	 * 
	 * @param filePath
	 * @return Object
	 */
	@GetMapping(value = "/stringb64")
	public Object get(@RequestParam(value="filePath") final String filePath) {
		//logger.debug("buscando archivo" + filePath);
		Map<String, String> map = new HashMap<String, String>();
		map.put("file", utils.encodeImgToBase64(filePath.trim()));
		return map;
	}	
	
	/**
	 * 
	 * @param filename
	 * @param path
	 * @return ResponseEntity<Resource>
	 */
	@GetMapping("/{path}/{filename:.+}")
	@ResponseBody
	public ResponseEntity<Resource> serveFileFromSubDirNoEntidad(@PathVariable String filename,  @PathVariable String path) {
		logger.debug("buscando archivo: " + path +"/"+filename);		
		Resource file = storageService.loadAsResourceSubDir(filename, "/"+path+"/");
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename=\"" + file.getFilename() + "\"").body(file);
	}
	
	/**
	 * 
	 * @param filename
	 * @param path
	 * @return ResponseEntity<Resource>
	 */
	@GetMapping("/download")
	@ResponseBody
	public ResponseEntity<Resource> serveFileFromSubDir(@RequestParam(value="path") final String path, 
			@RequestParam(value="filename") final  String filename) {
		logger.debug("buscando archivo: " + path +"/"+filename);		
		Resource file = storageService.loadAsResourceSubDir(filename, "/"+path+"/");
		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,
				"attachment; filename=\"" + file.getFilename() + "\"").body(file);
	}
	
	@PostMapping("/save")
	public File handleFileUpload(@RequestParam("file") MultipartFile file,
			@RequestParam("folder") String folder) {
		GenericFile gf = new GenericFile();
		gf.setFile(file);
		gf.setFolder(folder);
		logger.info("Archivo resivido");
		return storageService.store(gf);
	}
	
	@PostMapping("/saveFiles")
	public ArrayList<File> handleFilesUploads(@RequestParam("files") ArrayList<MultipartFile> files,
			@RequestParam("folder") String folder,@RequestParam("userId") String userId) {
		GenericFile gf = new GenericFile();
		gf.setFiles(files);
		gf.setFolder(folder);
		logger.info("Archivo resivido");
		return storageService.stores(gf,userId);
	}
	
	@PostMapping("/update")
	public File updateFileUpload(@RequestParam("file") MultipartFile file,
			 @RequestParam("folder") String folder, @RequestParam("oldServerName") String oldServerName,
			 @RequestParam("oldOriginalName") String oldOriginalName,
			 @RequestParam("userId") String userId) {
		
		GenericFile gf = new GenericFile();
		gf.setFile(file);
		gf.setFolder(folder);
		gf.setOriginalName(oldOriginalName);
		gf.setServerName(oldServerName);
		gf.setUserId(userId);
		
		logger.info("Archivo resivido para actualizar");
		return storageService.updateFile(gf);
	}
	
	@PostMapping("/update-files")
	public ArrayList<File> updateFilesUploads(@RequestParam("files") ArrayList<MultipartFile> files,
			@RequestParam("oldServerNames") ArrayList<String> oldServerNames,
			@RequestParam("oldOriginalNames") ArrayList<String> oldOriginalNames,
			@RequestParam("folder")  String folder,
			@RequestParam("userId") String userId) {
		
		GenericFile gf = new GenericFile();
		gf.setFiles(files);
		gf.setFolder(folder);
		
		logger.info("Archivo resivido para actualizar");
		return storageService.updateFiles(gf, oldServerNames, oldOriginalNames, userId);
	}
	@PostMapping("/new-version")
	public ArrayList<File> copyToVersionedFolder(@RequestParam("files") ArrayList<MultipartFile> files,
//			@RequestParam("filesInfo") ArrayList<File> filesInfo,
			@RequestParam("folder")  String folder,
			@RequestParam("userId") String userId) {
		GenericFile gf = new GenericFile();
		gf.setFiles(files);
//		gf.setFilesInfo(filesInfo);
		gf.setFolder(folder);
		gf.setUserId(userId);
		logger.info("Archivo preparado pser versionados: ");
		return storageService.copyToVersionedFolder(gf);
	}
	
	@DeleteMapping("/delete")
	public GenericFile deleteFileUpload(@RequestBody final GenericFile file) {
		
		logger.info("Archivo preparado para eliminar: "+file.toString());
		return storageService.moveRecycleBin(file.getUrlServerFile(),file.getOriginalName(),file.getServerName());
	}
	
	@DeleteMapping("/delete-folder")
	public ArrayList<File> deleteFolder(@RequestBody GenericFile gf) {
		
		logger.info("Carpeta preparada para eliminar: "+gf);
		return storageService.moveFolderRecycleBin(gf);
	}
	
	
	@ExceptionHandler(StorageFileNotFoundException.class)
	public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
		return ResponseEntity.notFound().build();
	}
}

