package com.solucionesdigitales.vote.repository.vote;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.solucionesdigitales.vote.entity.vote.VoteOption;

@RepositoryRestResource(collectionResourceRel = "voteOption", path = "votesOptions")
public interface VoteOptionRepository extends MongoRepository<VoteOption, String>{

}
