package com.solucionesdigitales.vote.service.impl.elementsod;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.elementsod.ElementOd;
import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.repository.elementsod.ElementsOdRepository;
import com.solucionesdigitales.vote.service.elementsod.ElementsOdService;
import com.solucionesdigitales.vote.service.utils.ElementStatus;

@Service("elementsOdService")
public class ElementsOdServiceImpl implements ElementsOdService {
	private static final Logger logger = LoggerFactory.getLogger(ElementsOdServiceImpl.class);
	@Autowired
	private ElementsOdRepository  elementsOdRepository;
	

	private final ElementStatus ELEMENTOD_STATUS = new ElementStatus() {};

	@Override
	public List<ElementOd> fetch() {
		List<ElementOd> elements= elementsOdRepository.findByStatus(1);
		return elements;
	}
	
	@Override
	public List<ElementOd> getNameOrder() {
		List<ElementOd> ele= elementsOdRepository.findOrderByNombreAsc();
		List<ElementOd> element = new ArrayList<ElementOd>();
		element.addAll(ele);
		return element;
	}

	@Override
	public ElementOd post(ElementOd entity) {
		ElementOd elements= new ElementOd();
		elements = elementsOdRepository.save(entity);
		return elements;
	}

	@Override
	public ElementOd put(ElementOd entity) {
		ElementOd elements= new ElementOd();
		elements = elementsOdRepository.save(entity);
		return elements;
	}

	@Override
	public ElementOd delete(ElementOd entity) {
		ElementOd elements = new ElementOd();
		
		if(entity.getId() != null) {
			entity.setStatus(ELEMENTOD_STATUS._ELIMINADO);
			elements = elementsOdRepository.save(entity);
			logger.info("Elemento eliminado: ["+entity+"]");
		}
		return elements;
	}

	

	

}