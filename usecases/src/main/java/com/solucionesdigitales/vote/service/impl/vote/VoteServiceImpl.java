package com.solucionesdigitales.vote.service.impl.vote;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.vote.Vote;
import com.solucionesdigitales.vote.entity.vote.VoteOption;
import com.solucionesdigitales.vote.repository.partner.PartnerRepository;
import com.solucionesdigitales.vote.repository.vote.VoteRepository;
import com.solucionesdigitales.vote.service.vote.VoteService;

@Service("voteService")
public class VoteServiceImpl implements VoteService {
	
	@Autowired
	private VoteRepository repo;
	
	@Autowired
	private PartnerRepository repop;
	
	@Override
	public List<Vote> fetch() {		
		return repo.findAll();
	}

	@Override
	public Vote post(Vote entity) {		
		return repo.save(entity);
	}

	@Override
	public Vote put(Vote entity) {		
		return repo.save(entity);
	}

	@Override
	public List<Vote> fetchByInitiativeAndLegislator(String initiativeId, String legislatorId) {
		return repo.findByInitiativeIdAndPartnerId(initiativeId, legislatorId);
	}
	
	@Override
	public List<Vote> fetchByInitiative(String initiativeId) {
		List<Vote> orderlist = new ArrayList<Vote>();
		List<Vote> list =  repo.findByInitiativeId(initiativeId) ;
		List<Partner> lpartner = repop.findAllByStatusAndTipoPartnerOrderByApPaternoAscApMaternoAscNameAsc(1, 1);
		if (lpartner != null && lpartner.size() > 0) {
			for (Partner partner : lpartner) {
				if( list.stream().filter(p -> p.getPartner().getId().equals(partner.getId())).findFirst().isPresent() )  {
					orderlist.add( list.stream().filter(p -> p.getPartner().getId().equals(partner.getId())).findFirst().orElse(null) );
				}else {
					Vote v = new Vote();
					v.setFechaHora(LocalDateTime.now());
					v.setId("");
					v.setInitiative(new Initiative());
					v.setOption(new VoteOption());
					v.setPartner(partner);
					orderlist.add(v);
				}
			}
		}
		return orderlist ;
	}

	@Override
	public List<Vote> fetchByLegislator(String legislatorId) {
		return repo.findByPartnerId(legislatorId);
	}

}
