package com.solucionesdigitales.vote.repository.archive;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.solucionesdigitales.vote.entity.archive.Archive;

public interface ArchiveRepository extends MongoRepository<Archive, String> {

}
