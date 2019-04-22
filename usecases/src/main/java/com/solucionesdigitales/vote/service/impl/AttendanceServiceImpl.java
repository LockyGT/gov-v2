package com.solucionesdigitales.vote.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.Attendance;
import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.vote.VoteSession;
import com.solucionesdigitales.vote.repository.AttendanceRepository;
import com.solucionesdigitales.vote.repository.partner.PartnerRepository;
import com.solucionesdigitales.vote.repository.vote.VoteSessionRepository;
import com.solucionesdigitales.vote.service.AttendanceService;
import com.solucionesdigitales.vote.service.utils.Constants;
import com.solucionesdigitales.vote.service.utils.Utils;

/**
 * 
 * @author javier
 *
 */
@Service("attendanceService")
public class AttendanceServiceImpl implements AttendanceService {
	
	private static final Logger logger = LoggerFactory.getLogger(AttendanceServiceImpl.class);
	
	@Autowired
	private AttendanceRepository repo;
	@Autowired
	private VoteSessionRepository repoVs;
	@Autowired
	private PartnerRepository repop;
	@Autowired
	private Utils utils;
	@Override
	public List<Attendance> fetch() {		
		return repo.findAll();
	}	
	
	@Override
	public List<Attendance> fetchByInitiativeId(String initiative) {
		logger.info("finding by initiative [" + initiative + "]");
		return repo.findAllByInitiative(initiative);
	}

	@Override
	public List<Attendance> fetchByInitiativeIdAndPartnerId(String initiativeId, String partnerId) {
		logger.info("finding by initiative [" + initiativeId + ", "+ partnerId +"]");
		return repo.findAllByInitiativeIdAndPartnerId(initiativeId, partnerId);
	}	
	
	@Override
	public Attendance post(Attendance entity) {		
		return repo.save(entity);
	}

	@Override
	public Attendance put(Attendance entity) {		
		return repo.save(entity);
	}

	@Override
	public Attendance fetchByPartnerIdAndDate(String partnerId, LocalDateTime dt1,LocalDateTime dt2) {
		return repo.findFirstByPartnerAndDateTimeBetween(partnerId, dt1, dt2);
	}

	@Override
	public List<Attendance> findAllByDateTimeBetween(LocalDateTime dt1, LocalDateTime dt2) {
		logger.info("AttendanceServiceImpl.findAllByDateTimeBetween()");
		return repo.findAllByDateTimeBetweenAndStatus(dt1, dt2,1);
	}
	@Override
	public List<Attendance> findAllByDateTimeBetweenWithSesion(LocalDateTime dt1, LocalDateTime dt2) {
		logger.info("AttendanceServiceImpl.findAllByDateTimeBetween()");
		List<Attendance> list = repo.findAllByDateTimeBetweenAndStatus(dt1, dt2,1);
		if (list != null && list.size() >0) {
			for (Attendance attendance : list) {
				if (attendance.getInitiative() != null && attendance.getInitiative().getId() != null) {
					List<String> strl = new ArrayList<String>();
					strl.add(attendance.getInitiative().getId());
//					logger.info(attendance.getInitiative().getId());
//					List<VoteSession> vsl = repoVs.findVoteSessionEstadoIniciativa(
//							new ObjectId(attendance.getInitiative().getId().getBytes())
////							attendance.getInitiative().getId()
//							);
					List<VoteSession> vsl1 = repoVs.findVoteSessionPorIniciativa(new ObjectId(attendance.getInitiative().getId()));
					if (vsl1 != null && vsl1.size() > 0) {
						VoteSession vs = vsl1.get(0);
						List<Initiative> ins = new ArrayList<Initiative>();
						//ins.add(attendance.getInitiative());
						vs.setIniciativas(ins);
						attendance.setVoteSession(vs);
//						logger.info(vsl1.get(0).toString());
					}
//					else {
//						logger.info("NO VS1" );
//					}
				}
				
			}
		}
		return list;
	}

	@Override
	public List<Attendance> findAttendanceSesionByDateTimeBetween(LocalDateTime dt1, LocalDateTime dt2) {
		logger.info("AttendanceServiceImpl.findAttendanceSesionByDateTimeBetween()");
		List<Attendance> list = new ArrayList<Attendance>();
		List<Attendance> attList = repo.findAllByDateTimeBetweenAndStatus(dt1, dt2,1);
		List<VoteSession> vsList = repoVs.findVoteSessionByFechaHoraBetweenAndStatusNot(dt1, dt2, Constants._DELETED);
		if (attList != null && attList.size() > 0 && vsList != null && vsList.size() > 0) {
			logger.info("attList: " + attList.size());
			logger.info("vsList: " + vsList.size());
			for (Attendance att : attList) {
				if (att.getInitiative() != null) {
					//				orderList.add( list.stream().filter(p -> p.getPartner().getId().equals(partner.getId())).findFirst().orElse(null) );
					//				Attendance attvs = new Attendance();
					att.setVoteSession(
							vsList.parallelStream().filter(
									x-> x.getIniciativas() != null && x.getIniciativas().parallelStream().filter(
											y-> y.getId().equals(att.getInitiative().getId()) ).findFirst().isPresent()
									).findFirst().orElse(new VoteSession()));

					boolean existePartnerAndSesion = false;
					existePartnerAndSesion = list.parallelStream().filter(
							p-> p.getPartner().getId().equals(att.getPartner().getId())
							&& p.getVoteSession().getId().equals(att.getVoteSession().getId())).findFirst().isPresent();
					if (!existePartnerAndSesion) {
						list.add(att);
					}
				}
			}
		}
		return list;
	}
	
	@Override
	public List<Attendance> findAllByDateTimeBetweenAndStatusAndPartnerIdAndVoteSessionIsNotNull(LocalDateTime dt1, LocalDateTime dt2, int status, String partnerId) {
		logger.info("AttendanceServiceImpl.findAttendanceSesionByDateTimeBetween()");
		
		List<Attendance> attList = repo.findAllByDateTimeBetweenAndStatusAndPartnerIdAndVoteSessionIsNotNull(dt1, dt2, status, partnerId);
	
		return attList;
	}

	@Override
	public List<Attendance> fetchByVoteSessionId(String voteSessionId) {
		return repo.findByVoteSessionId(voteSessionId);
	}

	@Override
	public List<Attendance> fetchByVoteSessionIdAndPartnerId(String voteSessionId, String partnerId) {
		return repo.findByVoteSessionIdAndPartnerId(voteSessionId, partnerId);
	}
	
	@Override
	public List<Attendance> fetchByVoteSessionIdAndVoteSessionNumberAttendanceAndPartnerId(String voteSessionId,int attendanceNumber, String partnerId) {
		return repo.findByVoteSessionIdAndVoteSessionNumberAttendanceAndPartnerId(voteSessionId,attendanceNumber, partnerId);
	}
	

	@Override
	public List<Attendance> findByVoteSessionIsNotNullAndPartnerId(String partnerId) {
		return repo.findByVoteSessionIsNotNullAndPartnerId(partnerId);
	}

	@Override
	public List<Attendance> findAttendancesSessionsByDateTime(LocalDateTime dt1, LocalDateTime dt2) {
		logger.info("AttendanceServiceImpl.findAttendancesSessionsByDateTime()");
		logger.info(dt1.toString());
		logger.info(dt2.toString());
		List<Attendance> list= repo.findAllByDateTimeBetweenAndStatus(dt1, dt2, Constants._ACTIVE);
		List<Attendance> orderList = new ArrayList<Attendance>();
		List<Partner> lpartner = repop.findAllByStatusAndTipoPartnerOrderByApPaternoAscApMaternoAscNameAsc(Constants._ACTIVE, Constants._LEGISLATOR);
		List<VoteSession> lvs = repoVs.findVoteSessionByFechaHoraBetweenAndStatusNot(dt1, dt2, Constants._DELETED);
		List<LocalDate> listaDates = utils.getDatesBetween(dt1.toLocalDate(), dt2.toLocalDate());
		logger.info("attendanceOrg: " + list.size()) ;
		logger.info("partners: " + lpartner.size()) ;
		logger.info("dates: " + listaDates.size()) ;
		logger.info("sesiones: " + lvs.size()) ;
//		for (Attendance attendance : list) {
//			logger.info(attendance.toString());
//		}
		if (lpartner != null && lpartner.size() > 0 && lvs != null && lvs.size() > 0 && listaDates != null && listaDates.size() > 0) {
			for (LocalDate localDate : listaDates) {
				if(list.parallelStream().filter(
						y-> y.getDateTime().toLocalDate().equals(localDate) 
						&& y.getPartner().getTipoPartner() == 1 
						&& y.getPartner().getUser().getUserRol().getSku() == 1
						&& y.getVoteSession() != null && y.getVoteSession().getId() !=null &&  y.getVoteSession().getId().length() > 0 
						).findFirst().isPresent()) {
					
					for (VoteSession voteSession : lvs) {
//						logger.info(voteSession.toString());
						if (voteSession.getId() != null) {
							if (list.parallelStream().filter(
									y-> y.getVoteSession() != null && y.getVoteSession().getId().length() > 0 
									&& y.getVoteSession().getId().equals(voteSession.getId())
									).findFirst().isPresent()) {

								for (Partner partner : lpartner) {
									if( list.parallelStream().filter(
											p -> p.getPartner().getId().equals(partner.getId())
											&& p.getDateTime().toLocalDate().equals(localDate) 
											&& p.getVoteSession() != null && p.getVoteSession().getId() !=null &&  p.getVoteSession().getId().length() > 0
											&& p.getVoteSession().getId().equals(voteSession.getId())
											).findFirst().isPresent() )  {
										orderList.add( list.parallelStream().filter(
												p -> p.getPartner().getId().equals(partner.getId())
												&& p.getDateTime().toLocalDate().equals(localDate) 
												&& p.getVoteSession() != null && p.getVoteSession().getId() !=null &&  p.getVoteSession().getId().length() > 0
												&& p.getVoteSession().getId().equals(voteSession.getId())
												).findFirst().orElse(null) );
									}else {
										Attendance att = new Attendance();
										att.setDateTime(LocalDateTime.of(localDate,LocalTime.of(0, 0)));
										att.setId("");
										att.setInitiative(new Initiative());
										att.setPartner(partner);
										att.setRegistrationMethod("");
										att.setStatus(0);
										att.setVoteSession(voteSession);
										orderList.add(att);
									}
								}
							}
						}
					}

				}
//				else {
//					Quorum q = new Quorum();
//					q.setId("");
//					q.setNumeroIntento(0);
//					q.setDateTime(LocalDateTime.of(localDate, LocalTime.of(0, 0)));
//					Partner p = new Partner();
//					p.setId("");
//					p.setApPaterno("SIN SESION EN EL DIA");
//					p.setApMaterno("");
//					p.setName("");
//					p.setPartido(new PoliticalParty());
//					q.setPartner(p);
//					orderList.add(q);
//				}
			}
		}
		return orderList;
	}
	
	@Override
	public List<Attendance> findAttendanceListBySession(String voteSessionId, int attendaceNumber) {
		logger.info("AttendanceServiceImpl.findAttendanceListBySession("+voteSessionId+" --- "+attendaceNumber+")");
		Optional<VoteSession> vs = repoVs.findById(voteSessionId);
		VoteSession voteSession = (vs.get() != null && vs.get().getId() != null) ? vs.get() : new VoteSession();
		List<Attendance> list= repo.findByVoteSessionIdAndVoteSessionNumberAttendance(voteSessionId,attendaceNumber);
		if (list == null) {
			list = new ArrayList<Attendance>();
		}
		logger.info("attendance ---- > " + list.size() );
		List<Attendance> orderList = new ArrayList<Attendance>();
		List<Partner> lpartner = repop.findAllByStatusAndTipoPartnerOrderByApPaternoAscApMaternoAscNameAsc(1, 1);

		if (lpartner != null && lpartner.size() > 0) {
			for (Partner partner : lpartner) {
				if( list.stream().filter(
						p -> p.getPartner() != null && p.getPartner().getId() != null && p.getPartner().getId().equals(partner.getId()) &&  p.getPartner().getUser().getUserRol().getSku() == 1
						).findFirst().isPresent() )  {
					orderList.add( list.stream().filter(
							p -> p.getPartner() != null && p.getPartner().getId() != null && p.getPartner().getId().equals(partner.getId()) &&  p.getPartner().getUser().getUserRol().getSku() == 1
							).findFirst().orElse(null) );
				}else {
					Attendance att = new Attendance();
					att.setDateTime(LocalDateTime.of(voteSession.getFechaHora().toLocalDate(),LocalTime.of(0, 0)));
					att.setId("");
					att.setInitiative(new Initiative());
					att.setPartner(partner);
					att.setRegistrationMethod("");
					att.setStatus(0);
					att.setVoteSession(voteSession);
					orderList.add(att);
				}
			}
		}
		logger.info("order attendancelist ---- > " + orderList.size() );
		return orderList;
	}
}
