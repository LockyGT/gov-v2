package com.solucionesdigitales.vote.service.report;
 
import com.google.gson.JsonObject;

public interface ReportService {
	JsonObject generatedReporLegislator(String[] partnersId, String[] initiativesId);
	JsonObject generatedReportResults(String[] sessionsId, String[] initiativesId);
	JsonObject generatedReportInitiatives(String[] sessionsId, String[] initiativesId);
	JsonObject generatedReportLegislatura(String[] sessionsId, String[] initiativesId);
}
