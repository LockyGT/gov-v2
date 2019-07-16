package com.solucionesdigitales.vote.service.impl.orderday;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.entity.orderday.ParagraphOD;
import com.solucionesdigitales.vote.repository.orderday.ParagraphODRepository;
import com.solucionesdigitales.vote.service.orderday.ParagraphODService;
import com.solucionesdigitales.vote.service.utils.ElementStatus;


@Service("paragraphService")
public class ParagraphODServiceImpl implements ParagraphODService {
	private static final Logger logger = LoggerFactory.getLogger(ParagraphODServiceImpl.class);


	@Autowired
	private ParagraphODRepository repository;
	private final ElementStatus ELEMENTOD_STATUS = new ElementStatus() {};
	
	@Override
	public List<ParagraphOD> fetch() {
		List<ParagraphOD> paragraph= repository.findAll();
		return paragraph;

	}
	
	@Override
	public List<ParagraphOD> getByStatus() {
		List<ParagraphOD> paragraph=repository.findByStatus(ELEMENTOD_STATUS._ACTIVAPARAGRAPH);
		//element.addAll(ele);
		return paragraph;
	}
	
	@Override
	public ParagraphOD post(ParagraphOD entity) {
		entity = repository.save(entity);
		return entity;
	}


	@Override
	public ParagraphOD put(ParagraphOD entity) {
		entity =  repository.save(entity);
		return entity;
	}
	@Override
	public ParagraphOD delete(ParagraphOD entity) {
		ParagraphOD paragraph = new ParagraphOD();
		entity.setStatus(0);
		if(entity.getId() != null) {
			paragraph = repository.save(entity);
			logger.info("Parrafo eliminado: ["+entity+"]");
		}
		return paragraph;
	}

	@Override
	public List<ParagraphOD> getByStatusIniciative(boolean status) {
		List<ParagraphOD> iniciativa= new ArrayList<ParagraphOD>();
		iniciativa = repository.findByIsIniciativa(status);
		return iniciativa;
	}

}
