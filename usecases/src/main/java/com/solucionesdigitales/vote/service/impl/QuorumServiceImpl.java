package com.solucionesdigitales.vote.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.PoliticalParty;
import com.solucionesdigitales.vote.entity.Quorum;
import com.solucionesdigitales.vote.entity.QuorumResets;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.repository.QuorumRepository;
import com.solucionesdigitales.vote.repository.partner.PartnerRepository;
import com.solucionesdigitales.vote.service.QuorumResetsService;
import com.solucionesdigitales.vote.service.QuorumService;
import com.solucionesdigitales.vote.service.utils.Utils;

/**
 * 
 * @author javier
 *
 */
@Service("quorumService")
public class QuorumServiceImpl implements QuorumService {
	
	private static final Logger logger = LoggerFactory.getLogger(QuorumServiceImpl.class);
	
	@Autowired
	private QuorumRepository repo;

	@Autowired
	private PartnerRepository repoPartner ;
	
	@Autowired
	private QuorumResetsService qsService;
	
	@Autowired
	private Utils utils;
	@Override
	public List<Quorum> fetch() {		
		return repo.findAll();
	}	
	
	@Override
	public Quorum post(Quorum entity) {		
		return repo.save(entity);
	}

	@Override
	public Quorum put(Quorum entity) {		
		return repo.save(entity);
	}

	@Override
	public List<Quorum> putAll(List<Quorum> entity) {		
		return repo.saveAll(entity);
	}
	
	@Override
	public Quorum fetchByPartnerIdAndDate(String partnerId, LocalDateTime dt1,LocalDateTime dt2) {
		return repo.findFirstByPartnerAndDateTimeBetweenAndStatus(partnerId, dt1, dt2,1);
	}

	@Override
	public List<Quorum> findAllByDateTimeBetween(LocalDateTime dt1, LocalDateTime dt2) {
		logger.info("AttendanceServiceImpl.findAllByDateTimeBetween()");
		logger.info(dt1.toString());
		logger.info(dt2.toString());
		List<Quorum> list= repo.findAllByDateTimeBetweenAndStatus(dt1, dt2,1);
		List<Quorum> orderList = new ArrayList<Quorum>();
		List<Partner> lpartner = repoPartner.findAllByStatusAndTipoPartnerOrderByApPaternoAscApMaternoAscNameAsc(1, 1);
		if (lpartner != null && lpartner.size() > 0) {
			List<LocalDate> listaDates = utils.getDatesBetween(dt1.toLocalDate(), dt2.toLocalDate());
			if (listaDates != null && listaDates.size() > 0) {
				for (LocalDate localDate : listaDates) {
					if(list.parallelStream().filter(y-> y.getDateTime().toLocalDate().equals(localDate) && y.getPartner().getTipoPartner() == 1 && y.getPartner().getUser().getUserRol().getSku() == 1).findFirst().isPresent()) {
						for (Partner partner : lpartner) {
							if( list.parallelStream().filter(p -> p.getPartner().getId().equals(partner.getId()) && p.getDateTime().toLocalDate().equals(localDate) ).findFirst().isPresent() )  {
								orderList.add( list.parallelStream().filter(p -> p.getPartner().getId().equals(partner.getId()) && p.getDateTime().toLocalDate().equals(localDate)).findFirst().orElse(null) );
							}else {
								Quorum q = new Quorum();
								q.setDateTime(LocalDateTime.of(localDate, LocalTime.of(0, 0)));
								q.setId("");
								q.setNumeroIntento(0);
								q.setPartner(partner);
								q.setRegistrationMethod("");
								q.setStatus(0);
								orderList.add(q);
							}
						}	
					}else {
						Quorum q = new Quorum();
						q.setId("");
						q.setNumeroIntento(0);
						q.setDateTime(LocalDateTime.of(localDate, LocalTime.of(0, 0)));
						Partner p = new Partner();
						p.setId("");
						p.setApPaterno("SIN SESION EN EL DIA");
						p.setApMaterno("");
						p.setName("");
						p.setPartido(new PoliticalParty());
						q.setPartner(p);
						orderList.add(q);
					}
				}
			}
		}
		return orderList;
	}
	
	@Override
	public List<Quorum> findQuorumToday(LocalDateTime dt1, LocalDateTime dt2) {
		logger.info("AttendanceServiceImpl.findAllByDateTimeBetween()");
		logger.info(dt1.toString());
		logger.info(dt2.toString());
		List<Quorum> list= repo.findAllByDateTimeBetweenAndStatus(dt1, dt2,1);
		if (list == null) {
			list = new ArrayList<Quorum>();
		}
		List<Quorum> orderList = new ArrayList<Quorum>();
		List<Partner> lpartner = repoPartner.findAllByStatusAndTipoPartnerOrderByApPaternoAscApMaternoAscNameAsc(1, 1);

		if (lpartner != null && lpartner.size() > 0) {
			for (Partner partner : lpartner) {
				if( list.stream().filter(p -> p.getPartner().getId().equals(partner.getId())).findFirst().isPresent() )  {
					orderList.add( list.stream().filter(p -> p.getPartner().getId().equals(partner.getId())).findFirst().orElse(null) );
				}else {
					Quorum q = new Quorum();
					q.setDateTime(dt1);
					q.setId("");
					q.setNumeroIntento(0);
					q.setPartner(partner);
					q.setRegistrationMethod("");
					q.setStatus(0);
					orderList.add(q);
				}
			}
		}
		return orderList;
	}
	
	@Override
	public List<Quorum> reiniciarQuorum(LocalDateTime dt1, LocalDateTime dt2, Partner partner) {
		logger.info("AttendanceServiceImpl.reiniciarQuorum()");
		logger.info(dt1.toString());
		logger.info(dt2.toString());
		List<Quorum> list= repo.findAllByDateTimeBetweenAndStatus(dt1, dt2,1);
		if (list != null && list.size() > 0) {
			list.forEach(x-> x.setStatus(2));
			QuorumResets qr = new QuorumResets();
			QuorumResets qrs = qsService.findByDateTimeBetweenAndStatus(dt1, dt2,1);
			if (qrs != null && qrs.getId() != null && qrs.getId().trim().length() > 0) {
				qrs.setStatus(0);
				qrs.setPartner(partner);
				qsService.put(qrs);
				qr.setNumeroReinicio(qrs.getNumeroReinicio() + 1);
			}else {
				qr.setNumeroReinicio(1);
			}
			
			qr.setStatus(1);
			qr.setDateTime(LocalDateTime.now());
			qr.setPartner(partner);
			
			qsService.post(qr);
			
			this.putAll(list);
		}
		list =  this.findQuorumToday(dt1, dt2);
		return list;
	}
	
}
