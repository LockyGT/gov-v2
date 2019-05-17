package com.solucionesdigitales.vote.service.impl.elementsod;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.elementsod.ElementOd;
import com.solucionesdigitales.vote.repository.elementsod.ElementsOdRepository;
import com.solucionesdigitales.vote.service.elementsod.ElementsOdService;

@Service("elementsOdService")
public class ElementsOdServiceImpl implements ElementsOdService {
	@Autowired
	private ElementsOdRepository  elementsOdRepository;
	
	//private final OrderDayStatus ORDERDAY_STATUS = new OrderDayStatus() {};

	@Override
	public List<ElementOd> fetch() {
		List<ElementOd> elements= elementsOdRepository.findAll();
		return elements;
	}

	@Override
	public ElementOd post(ElementOd entity) {
		ElementOd element= new ElementOd();
		element = elementsOdRepository.save(entity);
		return element;
	}
	
	@Override
	public ElementOd put(ElementOd entity) {
		ElementOd elements= new ElementOd();
		return elements;
	}

	@Override
	public ElementOd delete(ElementOd entity) {
		ElementOd elements = new ElementOd();
		//entity.setStatus(-1);
		return elements;
	}
}