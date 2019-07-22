package com.solucionesdigitales.vote.service.orderday;

import java.util.List;

import com.solucionesdigitales.vote.entity.orderday.ElementParagraph;


public interface ElementParagraphService {

	List<ElementParagraph> fetch();

	ElementParagraph post(ElementParagraph entity);

	ElementParagraph put(ElementParagraph entity);


}
