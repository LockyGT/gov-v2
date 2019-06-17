package com.solucionesdigitales.vote.service.impl.report;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.report.LegislatorReport;
import com.solucionesdigitales.vote.entity.report.ResultReport;
import com.solucionesdigitales.vote.entity.vote.Vote;
import com.solucionesdigitales.vote.entity.vote.VoteSession;
import com.solucionesdigitales.vote.repository.InitiativeRepository;
import com.solucionesdigitales.vote.repository.partner.PartnerRepository;
import com.solucionesdigitales.vote.repository.vote.VoteRepository;
import com.solucionesdigitales.vote.repository.vote.VoteSessionRepository;
import com.solucionesdigitales.vote.service.report.ReportService;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

@Service("reportService")
public class ReportServiceImpl implements ReportService {

	@Autowired
	private VoteSessionRepository voteSessionReporsitory;

	@Autowired
	private PartnerRepository partnerRepository;

	@Autowired
	private InitiativeRepository initiativeRepository;

	@Autowired
	private VoteRepository voteRepository;

	@Override
	public JsonObject generatedReporLegislator(String[] partnersId, String[] initiativesId) {
		JsonArray arr = new JsonArray();
		ArrayList<LegislatorReport> listLegislator = new ArrayList<LegislatorReport>();
		List<Vote> votes;
		Initiative initiative;
		Partner partner;
		VoteSession voteSession;
		JsonObject jsonLegislator;
		
		LegislatorReport legislator = new LegislatorReport();
		for(String partnerId : partnersId) {
			partner = partnerRepository.findFirstById(partnerId);
			legislator.setPartner(partner);
			for(String initiativeId : initiativesId) {
				votes = voteRepository.findByInitiativeIdAndPartnerId(initiativeId, partnerId);
				legislator.setVote(votes.get(0));
				initiative = initiativeRepository.findFirstByIdAndStatus(votes.get(0).getInitiative().getId(), 6);
				legislator.setInitiative(initiative);
				voteSession = voteSessionReporsitory.findFirsByIniciativasId(initiativeId);
				legislator.setVoteSession(voteSession);
				listLegislator.add(legislator);
			}
		}
		for (LegislatorReport lr : listLegislator) {
			jsonLegislator = new JsonObject();
			jsonLegislator.addProperty("politicalPartie", lr.getPartner().getPartido().getAcronym());
			jsonLegislator.addProperty("namePartner", lr.getPartner().getName() + " " + lr.getPartner().getApPaterno()
					+ " " + lr.getPartner().getApMaterno());
			jsonLegislator.addProperty("district", lr.getPartner().getDistrito());
			jsonLegislator.addProperty("commission", lr.getPartner().getComisiones());
			jsonLegislator.addProperty("date", lr.getVoteSession().getFechaHora().toString());
			jsonLegislator.addProperty("session", lr.getVoteSession().getNombre());
			jsonLegislator.addProperty("initiative", lr.getVote().getInitiative().getName());
			jsonLegislator.addProperty("vote", lr.getVote().getOption().getName());
			jsonLegislator.addProperty("voteColor", lr.getVote().getOption().getVoteColor());
			jsonLegislator.addProperty("startTime",lr.getVote().getInitiative().getFechaHoraInicio().toString());
			jsonLegislator.addProperty("endTime", lr.getVote().getInitiative().getFechaHoraFin().toString());
			jsonLegislator.addProperty("result", lr.getVote().getInitiative().getResult().getResultName());
			arr.add(jsonLegislator);
		}
		JsonObject json = new JsonObject();
		json.add("data",arr);
		return json;
	}
	
	
	@Override
	public JsonObject generatedReportResults(String[] sessionsId, String[] initiativesId) {
		JsonArray arr = new JsonArray();
		ArrayList<ResultReport> listResults = new ArrayList<ResultReport>();
		JsonObject jsonResults;
		ResultReport resultReport;
		VoteSession session;
		
		for(String sessionId : sessionsId) {

			session = voteSessionReporsitory.findFirsByIdOrderByNombreAsc(sessionId);
			for(String initiativeId : initiativesId) {
				resultReport = new ResultReport();
				resultReport.setSession(session);
				resultReport.setInitiative(initiativeRepository.findFirstByIdAndStatus(initiativeId, 6));
				listResults.add(resultReport);
			}
		}
		
		for(ResultReport result : listResults) {
			jsonResults = new JsonObject();
			jsonResults.addProperty("date", result.getSession().getFechaHora().toString());
			jsonResults.addProperty("typeSession",result.getSession().getType().getName());
			jsonResults.addProperty("session", result.getSession().getNombre());
			jsonResults.addProperty("initiative",result.getInitiative().getName());
			jsonResults.addProperty("present",result.getInitiative().getResult().getPresentes());
			jsonResults.addProperty("formula", result.getInitiative().getResult().getFormula().getFormulaName());
			jsonResults.addProperty("formulaId", result.getInitiative().getResult().getFormula().getId());
			jsonResults.addProperty("method", result.getInitiative().getResult().getRoundMethod().getName());
			jsonResults.addProperty("result", result.getInitiative().getResult().getResultName());
			arr.add(jsonResults);
		}
		
		JsonObject json = new JsonObject();
		json.add("data",arr);
		return json;
	}


	@Override
	public JsonObject generatedReportInitiatives(String[] sessionsId, String[] initiativesId) {
		JsonArray arr = new JsonArray();
		ArrayList<ResultReport> listResults = new ArrayList<ResultReport>();
		JsonObject jsonResults;
		ResultReport resultReport;
		VoteSession session;
		
		for(String sessionId : sessionsId) {

			session = voteSessionReporsitory.findFirsByIdOrderByNombreAsc(sessionId);
			for(String initiativeId : initiativesId) {
				resultReport = new ResultReport();
				resultReport.setSession(session);
				resultReport.setInitiative(initiativeRepository.findFirstByIdAndStatus(initiativeId, 6));
				listResults.add(resultReport);
			}
		}
		
		for(ResultReport result : listResults) {
			jsonResults = new JsonObject();
			jsonResults.addProperty("date", result.getSession().getFechaHora().toString());
			jsonResults.addProperty("typeSession",result.getSession().getType().getName());
			jsonResults.addProperty("session", result.getSession().getNombre());
			jsonResults.addProperty("initiative",result.getInitiative().getName());
			jsonResults.addProperty("timeVote",result.getInitiative().getHours()+":"+result.getInitiative().getMinutes()+":"+result.getInitiative().getSeconds());
			jsonResults.addProperty("aFavor",result.getInitiative().getResult().getTotalAFavor());
			jsonResults.addProperty("against",result.getInitiative().getResult().getTotalEnContra());
			jsonResults.addProperty("abstention",result.getInitiative().getResult().getTotalAbstencion());
			jsonResults.addProperty("notVote",result.getInitiative().getResult().getTotalAFavor());
			jsonResults.addProperty("present",result.getInitiative().getResult().getPresentes());
			jsonResults.addProperty("missing",result.getInitiative().getResult().getTotalAusente());
			jsonResults.addProperty("result", result.getInitiative().getResult().getResultName());
			arr.add(jsonResults);
		}
		
		JsonObject json = new JsonObject();
		json.add("data",arr);
		return json;
	}


	@Override
	public JsonObject generatedReportLegislatura(String[] sessionsId, String[] initiativesId) {
		JsonArray arr = new JsonArray();
		ArrayList<ResultReport> listResults = new ArrayList<ResultReport>();
		JsonObject jsonResults;
		ResultReport resultReport;
		VoteSession session;
		
		for(String sessionId : sessionsId) {

			session = voteSessionReporsitory.findFirsByIdOrderByNombreAsc(sessionId);
			for(String initiativeId : initiativesId) {
				resultReport = new ResultReport();
				resultReport.setSession(session);
				resultReport.setInitiative(initiativeRepository.findFirstByIdAndStatus(initiativeId, 6));
				listResults.add(resultReport);
			}
		}
		
		for(ResultReport result : listResults) {
			jsonResults = new JsonObject();
			jsonResults.addProperty("date", result.getSession().getFechaHora().toString());
			jsonResults.addProperty("typeSession",result.getSession().getType().getName());
			jsonResults.addProperty("session", result.getSession().getNombre());
			jsonResults.addProperty("sessionId", result.getSession().getId());
			jsonResults.addProperty("initiative",result.getInitiative().getName());
			jsonResults.addProperty("result", result.getInitiative().getResult().getResultName());
			arr.add(jsonResults);
		}
		
		JsonObject json = new JsonObject();
		json.add("data",arr);
		return json;
	}

}
