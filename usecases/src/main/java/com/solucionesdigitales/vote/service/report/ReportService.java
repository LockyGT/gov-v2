package com.solucionesdigitales.vote.service.report;
 
import com.google.gson.JsonObject;

public interface ReportService {
	JsonObject generatedReporLegislator(String[] partnersId, String[] initiativesId);
}
