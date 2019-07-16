package com.solucionesdigitales.vote.controller.partner;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.solucionesdigitales.vote.entity.partner.FolderAdministrator;
import com.solucionesdigitales.vote.service.partner.FolderAdministratorService;

@RestController
@RequestMapping("folder-administrator")
public class FolderAdministratorController {
	
	@Autowired
	private FolderAdministratorService service;
	
	@GetMapping
	public List<FolderAdministrator> get(@RequestParam final int status) {
		return service.fetch(status);
	}
	
	@GetMapping(value="/id")
	public FolderAdministrator getById(@RequestParam final String id, @RequestParam final int status) {
		return service.fetchById(id, status);
	}
	
	@PostMapping
	public FolderAdministrator post(@RequestBody final FolderAdministrator entity) {
		return service.post(entity);
	}
	
	@PutMapping
	public FolderAdministrator put(@RequestBody final FolderAdministrator entity) {
		return service.put(entity);
	}
	
	@DeleteMapping 
	public FolderAdministrator delete(@RequestBody final FolderAdministrator entity) {
		return service.delete(entity);
	}
}
