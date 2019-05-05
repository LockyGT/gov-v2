package com.solucionesdigitales.vote.service.vote;

import java.util.List;

import com.solucionesdigitales.vote.entity.vote.VoteOption;

public interface VoteOptionService {


	VoteOption post(VoteOption entity);

	VoteOption put(VoteOption entity);

	List<VoteOption> fetch();
}
