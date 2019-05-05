package com.solucionesdigitales.vote.service.vote;

import java.util.List;

import com.solucionesdigitales.vote.entity.vote.VoteSessionType;

public interface VoteSessionTypeService {

	List<VoteSessionType> fetch();

	VoteSessionType post(VoteSessionType entity);

	VoteSessionType put(VoteSessionType entity);
}
