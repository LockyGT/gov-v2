package com.solucionesdigitales.vote.service.report;

import org.springframework.core.io.Resource;

public interface ReportOdService {
	
	public Resource writePdf(String orderdayId);
}
