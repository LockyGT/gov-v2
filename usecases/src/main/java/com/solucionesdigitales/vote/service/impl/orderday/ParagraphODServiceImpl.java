package com.solucionesdigitales.vote.service.impl.orderday;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.orderday.ParagraphOD;
import com.solucionesdigitales.vote.repository.orderday.ParagraphODRepository;
import com.solucionesdigitales.vote.service.orderday.ParagraphODService;


@Service("paragraphService")
public class ParagraphODServiceImpl implements ParagraphODService {

	
	@Autowired
	private ParagraphODRepository repository;
	
	@Override
	public List<ParagraphOD> fetch() {
		List<ParagraphOD> paragraph= repository.findAll();
		return paragraph;

	}
	@Override
	public ParagraphOD post(ParagraphOD entity) {
		return repository.save(entity);
	}
	@Override
	public ParagraphOD put(ParagraphOD entity) {
		return repository.save(entity);
	}
	
}
