package com.solucionesdigitales.vote.service.vote;

import java.time.LocalDateTime;
import java.util.List;

import com.solucionesdigitales.vote.entity.vote.VoteSession;

/**
 * 
 * @author javier
 *
 */
public interface VoteSessionService {
	
	List<VoteSession> fetch();
	
	List<VoteSession> fetchByStatus(int status);
	
	List<VoteSession> fetchByDateAndStatus(LocalDateTime ldt);

	VoteSession post(VoteSession entity);

	VoteSession put(VoteSession entity);

	VoteSession findById(String id);

	List<VoteSession> findVoteSessionByFechaHoraBetwen(LocalDateTime t1, LocalDateTime t2);
	List<VoteSession> findVoteSessionByFechaHoraBetwenAndStatus(LocalDateTime t1, LocalDateTime t2, Integer status);

	List<VoteSession> fetchByIsAttendanceOpen(boolean status);
}
