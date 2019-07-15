package com.solucionesdigitales.vote.service.impl.partner;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.partner.FolderAdministrator;
import com.solucionesdigitales.vote.repository.partner.FolderAdministratorRepository;
import com.solucionesdigitales.vote.service.partner.FolderAdministratorService;

@Service("folderAdministratorService")
public class FolderAdministratorServiceImpl implements FolderAdministratorService {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(FolderAdministratorServiceImpl.class);
	
	@Autowired
	private FolderAdministratorRepository repository;
	
	@Override
	public List<FolderAdministrator> fetch(int status) {
		LOGGER.info("Consultando carpetas de administradores");
		return repository.findAllByStatus(status);
	}
	
	@Override
	public FolderAdministrator fetchById(String id, int status) {
		// TODO Auto-generated method stub
		return repository.findFirstByIdAndStatus(id, status);
	}

	@Override
	public FolderAdministrator post(FolderAdministrator entity) {
		LOGGER.info("Registrando nueva carpeta de administradores: "+entity);
		return repository.save(entity);
	}

	@Override
	public FolderAdministrator put(FolderAdministrator entity) {
		LOGGER.info("Actualizanfo carpeta de administrador: "+entity);
		return repository.save(entity);
	}

	@Override
	public FolderAdministrator delete(FolderAdministrator entity) {
		LOGGER.info("Eliminando carpeta de administrador: "+entity);
		return repository.save(entity);
	}
}
