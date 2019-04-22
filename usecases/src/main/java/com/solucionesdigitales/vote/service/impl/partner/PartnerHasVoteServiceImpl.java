package com.solucionesdigitales.vote.service.impl.partner;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.Attendance;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.partner.PartnerHasVote;
import com.solucionesdigitales.vote.entity.vote.Vote;
import com.solucionesdigitales.vote.entity.vote.VoteSession;
import com.solucionesdigitales.vote.repository.AttendanceRepository;
import com.solucionesdigitales.vote.repository.partner.PartnerRepository;
import com.solucionesdigitales.vote.repository.vote.VoteSessionRepository;
import com.solucionesdigitales.vote.service.partner.PartnerHasVoteService;
import com.solucionesdigitales.vote.service.utils.Constants;

@Service("partnerHasVoteService")
public class PartnerHasVoteServiceImpl implements PartnerHasVoteService {
	private static final Logger logger = LoggerFactory.getLogger(PartnerHasVoteServiceImpl.class);
	@Autowired
	PartnerRepository partnerRepo;
	@Autowired
	AttendanceRepository attendanceRepo;
	@Autowired
	VoteSessionRepository voteSessionRepo;


	@Override
	public List<PartnerHasVote> get() {
		List<PartnerHasVote> lvs = null;
		List<Partner> ls = partnerRepo.findAllByStatusAndTipoPartnerOrderByApPaternoAsc(Constants._ACTIVE, Constants._LEGISLATOR);
		if(ls != null && ls.size() > 0) {
			lvs = new ArrayList<PartnerHasVote>();
			for (int i = 0; i < ls.size(); i++) {
				PartnerHasVote lv = new PartnerHasVote();
				lv.setPartner(ls.get(i));

				lv.setVote(new Vote());

				lv.setAsistencia(new Attendance());
				lvs.add(lv);
			}//end for loop	
		}else {
			logger.warn("no partner found for this query [findAllByStatusAndTipoPartnerOrderByApPaternoAsc]");
		}			
		return lvs;
	}

	@Override
	public List<PartnerHasVote> fetchByVoteSessionId(String voteSessionId) {
		List<PartnerHasVote> lvs = null;
		Optional<VoteSession> voteSessionOpt = voteSessionRepo.findById(voteSessionId);
		if(voteSessionOpt.isPresent()) {
			List<Partner> ls = partnerRepo.findAllByStatusAndTipoPartnerOrderByApPaternoAsc(Constants._ACTIVE, Constants._LEGISLATOR);
			if(ls != null && ls.size() > 0) {
				lvs = new ArrayList<PartnerHasVote>();
				for (int i = 0; i < ls.size(); i++) {
					PartnerHasVote lv = new PartnerHasVote();
					lv.setPartner(ls.get(i));
					lv.setVote(new Vote());
					List<Attendance> a = attendanceRepo.findByVoteSessionIdAndVoteSessionNumberAttendanceAndPartnerId(voteSessionId, voteSessionOpt.get().getAttendanceNumber(), lv.getPartner().getId());
					if(a != null && !a.isEmpty()) {
						lv.setAsistencia(a.get(0));
					}
					lvs.add(lv);
				}//end for loop						
			}else {
				logger.warn("no partner found for this query [findAllByStatusAndTipoPartnerOrderByApPaternoAsc]");
			}				
		}else {
			logger.warn("no voteSessionId was found with this id ["+voteSessionId+"]");
		}
		return lvs;
	}

}
