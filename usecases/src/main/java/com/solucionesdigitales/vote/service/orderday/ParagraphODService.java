package com.solucionesdigitales.vote.service.orderday;

import java.util.List;

import com.solucionesdigitales.vote.entity.orderday.ParagraphOD;


public interface ParagraphODService {

	List<ParagraphOD> fetch();

	ParagraphOD post(ParagraphOD entity);

	ParagraphOD put(ParagraphOD entity);

	ParagraphOD delete(ParagraphOD entity);

	List<ParagraphOD> getByStatus();

	

}
