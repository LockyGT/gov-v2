package com.solucionesdigitales.vote.repository.archive;

import java.util.Date;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.archive.Archive;

public interface ArchiveRepository extends MongoRepository<Archive, String> {
	List<Archive> findByStatusAndModuloodIdAndModuloodStatus(int status, String moduloodId, int moduloodStatus);
	List<Archive> findByStatusAndDeleteDateLessThan(int status, Date deleteDate);
}
