package com.solucionesdigitales.vote.repository.partner;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.partner.FolderAdministrator;


@Repository
public interface FolderAdministratorRepository extends MongoRepository<FolderAdministrator, String>{
	List<FolderAdministrator> findAllByStatus(int status);
	FolderAdministrator findFirstByIdAndStatus(String id, int status);
}