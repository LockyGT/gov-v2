package com.solucionesdigitales.vote.entity.orderday;

import java.util.List;

public class OrderDayParagraph {
	private List<ParagraphOD> paragraph;
	private OrderDay orderday;
	
	public OrderDay getOrderday() {
		return orderday;
	}
	public void setOrderday(OrderDay orderday) {
		this.orderday = orderday;
	}
	public List<ParagraphOD> getParagraph() {
		return paragraph;
	}
	public void setParagraph(List<ParagraphOD> paragraph) {
		this.paragraph = paragraph;
	}
	
}
