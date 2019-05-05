package com.solucionesdigitales.vote.repository.vote;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.solucionesdigitales.vote.entity.vote.VoteSessionType;

@RepositoryRestResource(collectionResourceRel = "voteSessionType", path = "voteSessionType")
public interface VoteSessionTypeRepository extends MongoRepository<VoteSessionType, String>{

}
