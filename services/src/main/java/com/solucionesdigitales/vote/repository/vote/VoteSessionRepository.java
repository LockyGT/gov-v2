package com.solucionesdigitales.vote.repository.vote;

import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
//import org.springframework.data.mongodb.core.query.Criteria;
//import org.springframework.data.jpa.repository.Query;
import org.springframework.data.mongodb.repository.MongoRepository;
//import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.vote.VoteSession;

@Repository
public interface VoteSessionRepository extends MongoRepository<VoteSession, String>{
	List<VoteSession> findVoteSessionByStatus(Integer status);	
	List<VoteSession> findVoteSessionByFechaHora(LocalDateTime fecha);
	List<VoteSession> findVoteSessionByFechaHoraBetweenAndStatusNot(LocalDateTime t1,LocalDateTime t2, Integer status);
	List<VoteSession> findVoteSessionByFechaHoraGreaterThanEqualAndStatusNot(LocalDateTime fecha, Integer status);
	List<VoteSession> findVoteSessionByFechaHoraAndStatusNot(LocalDateTime vsTime, Integer status);
	
	@Query("{'iniciativas' :{'$ref' : 'initiatives' , '$id' : ?0 }}")
	List<VoteSession> findVoteSessionPorIniciativa(ObjectId iniciativaId);
	List<VoteSession> findByIsAttendanceOpen(boolean status);
	VoteSession findFirsByIniciativasId(String iniciativasId);
	VoteSession findFirsByIdOrderByNombreAsc(String id);
}
