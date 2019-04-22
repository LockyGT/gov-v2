package com.solucionesdigitales.vote.service.impl.vote;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.vote.VoteSessionType;
import com.solucionesdigitales.vote.repository.vote.VoteSessionTypeRepository;
import com.solucionesdigitales.vote.service.vote.VoteSessionTypeService;

@Service("voteSessionTypeService")
public class VoteSessionTypeServiceImpl implements VoteSessionTypeService{
	
	@Autowired
	private VoteSessionTypeRepository repo;

	@Override
	public List<VoteSessionType> fetch() {
		return repo.findAll();
	}

	@Override
	public VoteSessionType post(VoteSessionType entity) {
		return repo.save(entity);
	}

	@Override
	public VoteSessionType put(VoteSessionType entity) {
		return repo.save(entity);
	}
}
