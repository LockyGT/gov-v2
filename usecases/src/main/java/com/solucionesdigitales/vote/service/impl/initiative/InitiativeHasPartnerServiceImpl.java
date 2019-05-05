package com.solucionesdigitales.vote.service.impl.initiative;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.Attendance;
import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.entity.initiative.InitiativeHasPartner;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.partner.PartnerHasVote;
import com.solucionesdigitales.vote.entity.vote.Vote;
import com.solucionesdigitales.vote.repository.AttendanceRepository;
import com.solucionesdigitales.vote.repository.InitiativeRepository;
import com.solucionesdigitales.vote.repository.partner.PartnerRepository;
import com.solucionesdigitales.vote.repository.vote.VoteRepository;
import com.solucionesdigitales.vote.service.initiative.InitiativeHasPartnerService;
import com.solucionesdigitales.vote.service.utils.Constants;

@Service("initiativeHasPartnerService")
public class InitiativeHasPartnerServiceImpl implements InitiativeHasPartnerService {
	private static final Logger logger = LoggerFactory.getLogger(InitiativeHasPartnerServiceImpl.class);
	
	@Autowired
	private InitiativeRepository initiativeRepo;	
	
	@Autowired
	private PartnerRepository legislatorRepo;
	@Autowired
	private VoteRepository voteRepo;
	@Autowired
	private AttendanceRepository attendanceRepo;
	
	@Override
	public InitiativeHasPartner fetchInitiativePartnerByInitiativeId(String id) {
		InitiativeHasPartner inl = new InitiativeHasPartner();
		Optional<Initiative> iniOpt = initiativeRepo.findById(id);
		if(iniOpt.isPresent()) {
			Initiative ini = iniOpt.get();			
			inl.setInitiative(ini);
			List<Partner> ls = legislatorRepo.findAllByStatusAndTipoPartnerOrderByApPaternoAsc(Constants._ACTIVE, Constants._LEGISLATOR);
			if(ls != null && ls.size() > 0) {
				List<PartnerHasVote> lvs = new ArrayList<PartnerHasVote>();
				for (int i = 0; i < ls.size(); i++) {
					PartnerHasVote lv = new PartnerHasVote();
					lv.setPartner(ls.get(i));
					List<Vote> v = voteRepo.findByInitiativeIdAndPartnerId(id,lv.getPartner().getId());
					if(v != null && !v.isEmpty()) {
						lv.setVote(v.get(0));
					}
					List<Attendance> a = attendanceRepo.findAllByInitiativeIdAndPartnerId(id,lv.getPartner().getId());
					if(a != null && !a.isEmpty()) {
						lv.setAsistencia(a.get(0));
					}
					lvs.add(lv);
				}//end for loop
				inl.setPartnerHasVote(lvs);			
			}else {
				logger.warn("no partner found for this query [fetchInitiativePartner]");
			}				
		}else {
			logger.warn("no initiative was found with this id ["+id+"]");
		}
		return inl;
	}

}
