package com.solucionesdigitales.vote.service.impl.orderday;


import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.orderday.ElementParagraph;
import com.solucionesdigitales.vote.repository.orderday.ElementParagraphRepository;
import com.solucionesdigitales.vote.service.orderday.ElementParagraphService;


@Service("elementsParagraphService")
public class ElementParagraphServiceImpl implements ElementParagraphService {
	private static final Logger logger = LoggerFactory.getLogger(ElementParagraphServiceImpl.class);
	@Autowired
	private ElementParagraphRepository  elementParagraphRepository;
	

	@Override
	public List<ElementParagraph> fetch() {
		List<ElementParagraph> elementParagrap= elementParagraphRepository.findAll();
		return elementParagrap;
	}
	@Override
	public ElementParagraph post(ElementParagraph entity) {
		ElementParagraph elementParagrap= new ElementParagraph();
		elementParagrap = elementParagraphRepository.save(entity);
		return elementParagrap;
	}

	@Override
	public ElementParagraph put(ElementParagraph entity) {
		ElementParagraph elementParagrap= new ElementParagraph();
		elementParagrap = elementParagraphRepository.save(entity);
		return elementParagrap;
	}

//	@Override
//	public ElementParagraph delete(ElementParagraph entity) {
//		ElementParagraph elements = new ElementParagraph();
//		
//		if(entity.getId() != null) {
//			entity.setStatus();
//			elements = elementParagraphRepository.save(entity);
//			logger.info("Elemento eliminado: ["+entity+"]");
//		}
//		return elements;
//	}

	

	

}
