package com.solucionesdigitales.vote.service.impl.vote;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.vote.VoteSession;
import com.solucionesdigitales.vote.repository.vote.VoteSessionRepository;
import com.solucionesdigitales.vote.service.utils.Constants;
import com.solucionesdigitales.vote.service.vote.VoteSessionService;

@Service("voteSessionService")
public class VoteSessionServiceImpl implements VoteSessionService {
	
	@Autowired
	private VoteSessionRepository repo;

	@Override
	public List<VoteSession> fetch() {
		return repo.findAll();
	}

	@Override
	public VoteSession post(VoteSession entity) {
		return repo.save(entity);
	}

	@Override
	public VoteSession put(VoteSession entity) {
		return repo.save(entity);
	}

	@Override
	public List<VoteSession> fetchByStatus(int status) {
		return repo.findVoteSessionByStatus(status);
	}

	@Override
	public List<VoteSession> fetchByDateAndStatus(LocalDateTime fecha) {

		return repo.findVoteSessionByFechaHoraGreaterThanEqualAndStatusNot(fecha, Constants._DELETED);
	}

	@Override
	public List<VoteSession> findVoteSessionByFechaHoraBetwen(LocalDateTime t1, LocalDateTime t2) {
		List<VoteSession> res = new ArrayList<VoteSession>();
		List<VoteSession> l1 = repo.findVoteSessionByFechaHoraBetweenAndStatusNot(t1,t2, Constants._DELETED);
		List<VoteSession> l2 = repo.findVoteSessionByFechaHora(t1);
		List<VoteSession> l3 = repo.findVoteSessionByFechaHora(t2);
		if(l1 != null) {
			res.addAll(l1);
		}
		if(l2 != null) {
			res.addAll(l2);
		}
		if(l3 != null) {
			res.addAll(l3);
		}
		return res;	
	}

	@Override
	public VoteSession findById(String id) {
		Optional<VoteSession> o = repo.findById(id);
		VoteSession vs = null;
		if(o.isPresent()) {
			vs = o.get();
		}
		return vs;
	}

	@Override
	public List<VoteSession> fetchByIsAttendanceOpen(boolean status) {
		
		return repo.findByIsAttendanceOpen(status);
	}

	@Override
	public List<VoteSession> findVoteSessionByFechaHoraBetwenAndStatus(LocalDateTime t1, LocalDateTime t2,
			Integer status) {
		return repo.findVoteSessionByFechaHoraBetweenAndStatusNot(t1, t2, status);
	}	

}
