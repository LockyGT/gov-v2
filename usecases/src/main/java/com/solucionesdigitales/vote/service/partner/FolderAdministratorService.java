package com.solucionesdigitales.vote.service.partner;

import java.util.List;

import com.solucionesdigitales.vote.entity.partner.FolderAdministrator;

public interface FolderAdministratorService {
	
	List<FolderAdministrator> fetch(int status);
	
	FolderAdministrator fetchById(String id, int status);
	
	FolderAdministrator post(FolderAdministrator entity);
	
	FolderAdministrator put(FolderAdministrator entity);
	
	FolderAdministrator delete(FolderAdministrator entity);
	
}
