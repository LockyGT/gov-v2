package com.solucionesdigitales.vote.repository.vote;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.vote.VoteOption;

@Repository
public interface VoteOptionRepository extends MongoRepository<VoteOption, String>{

}
