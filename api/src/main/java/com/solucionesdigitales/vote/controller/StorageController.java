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
import com.solucionesdigitales.vote.entity.archive.File;
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
	public GenericFile handleFileUpload(@RequestParam("file") MultipartFile file,
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
	public GenericFile updateFileUpload(@RequestParam("file") MultipartFile file,
			 @RequestParam("folder") String folder, @RequestParam("oldFileName") String oldFileName,
			 @RequestParam("oldFolder") String oldFolder) {
		
		GenericFile gf = new GenericFile();
		gf.setFile(file);
		gf.setFolder(folder);
		
		logger.info("Archivo resivido para actualizar");
		return storageService.updateFile(gf,oldFolder, oldFileName);
	}
	
	@PostMapping("/updateFiles")
	public ArrayList<File> updateFilesUploads(@RequestParam("files") ArrayList<MultipartFile> files,
			@RequestParam("files") ArrayList<String> oldFilesNames,
			@RequestParam("folder")  String folder,
			 @RequestParam("userId") String userId) {
		
		GenericFile gf = new GenericFile();
		gf.setFiles(files);
		gf.setFolder(folder);
		
		logger.info("Archivo resivido para actualizar");
		return storageService.updateFiles(gf, oldFilesNames, userId);
	}
	
	@DeleteMapping("/delete")
	public GenericFile deleteFileUpload(@RequestBody final String folder) {
		logger.info("Archivo preparado para eliminar");
		return storageService.deleteAllFolder(folder);
	}
	
	
	@ExceptionHandler(StorageFileNotFoundException.class)
	public ResponseEntity<?> handleStorageFileNotFound(StorageFileNotFoundException exc) {
		return ResponseEntity.notFound().build();
	}
}

