package com.solucionesdigitales.vote.entity.report;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.repository.orderday.OrderDayRepository;

@Service("orderDayReport")
public class orderDayReport {
	
private static final Logger LOGGER = LoggerFactory.getLogger(orderDayReport.class);
	
	@Autowired
	private OrderDayRepository orderdayRepository;
	
//	public byte[] getPDF(String id) {
//		JsonArray arr = new JsonArray();
//		List<OrderDay> list = null;
//		
//			list = (List<OrderDay>)orderdayRepository.findAll();
//		}
//	
	
}