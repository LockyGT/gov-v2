package com.solucionesdigitales.vote.repository.vote;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.vote.Vote;

@Repository
public interface VoteRepository extends MongoRepository<Vote, String> {

	List<Vote> findByInitiativeIdAndPartnerId(String initiativeId, String partnerId);
	
	List<Vote> findByInitiativeId(String id);
	
	List<Vote> findByPartnerId(String id);
}
