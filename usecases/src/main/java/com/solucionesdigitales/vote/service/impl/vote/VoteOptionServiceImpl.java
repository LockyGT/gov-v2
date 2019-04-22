package com.solucionesdigitales.vote.service.impl.vote;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.vote.VoteOption;
import com.solucionesdigitales.vote.repository.vote.VoteOptionRepository;
import com.solucionesdigitales.vote.service.vote.VoteOptionService;

@Service("voteOptionService")
public class VoteOptionServiceImpl implements VoteOptionService {
	
	private static final Logger logger = LoggerFactory.getLogger(VoteOptionServiceImpl.class);
	
	@Autowired
	private VoteOptionRepository repo;
	
	@Override
	public List<VoteOption> fetch() {	
		List<VoteOption> lista = repo.findAll();
		if (lista == null || lista.size() == 0) {
			VoteOption favor = new VoteOption();
			favor.setName("A FAVOR");
			favor.setVoteColor("success");
			favor.setOnWinIsApproved(true);
			
			VoteOption contra = new VoteOption();
			contra.setName("EN CONTRA");
			contra.setVoteColor("danger");
			contra.setOnWinIsApproved(false);
			
			VoteOption abstencion = new VoteOption();
			abstencion.setName("ABSTENCION");
			abstencion.setVoteColor("warning");
			contra.setOnWinIsApproved(false);
		
			repo.save(favor);
			repo.save(contra);
			repo.save(abstencion);
		}
		logger.debug("regresando lista de opciones de votos");
		return repo.findAll();
	}

	@Override
	public VoteOption post(VoteOption entity) {		
		return repo.save(entity);
	}

	@Override
	public VoteOption put(VoteOption entity) {		
		return repo.save(entity);
	}

}
