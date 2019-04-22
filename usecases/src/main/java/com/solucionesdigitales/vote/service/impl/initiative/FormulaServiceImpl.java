package com.solucionesdigitales.vote.service.impl.initiative;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.initiative.Formula;
import com.solucionesdigitales.vote.repository.FormulaRepository;
import com.solucionesdigitales.vote.service.initiative.FormulaService;

@Service("formulaService")
public class FormulaServiceImpl implements FormulaService {	
	@Autowired
	private FormulaRepository repo;

	@Override
	public List<Formula> fetchFormulas() {		
		List<Formula> l =repo.findAll();
		if(l != null && !l.isEmpty()) {
			return l; 
		}else {
			List<Formula> fs = new ArrayList<Formula>();
			Formula f1 = new Formula();
			f1.setFormulaExpression("($legislator_lenght/2)+1");
			f1.setFormulaName("Mayoría absoluta del total de integrantes");
			f1.setFormulaDescription("Es el resultado de la suma de votos que representan más de la mitad (mitad + 1"
					+ ") del total de integrantes del Congreso del Estado");
			fs.add(f1);
			Formula f1n1 = new Formula();
			f1n1.setFormulaExpression("($attendance_lenght/2)+1");
			f1n1.setFormulaName("Mayoría absoluta de los presentes");
			f1n1.setFormulaDescription("Es el resultado de la suma de votos que representan más de la mitad (mitad + 1"
					+ ") del total de los presentes en el Congreso del Estado");
			fs.add(f1n1);
			
			Formula f2n1 = new Formula();
			f2n1.setFormulaExpression("($legislator_lenght/3)*2");
			f2n1.setFormulaName("Mayoría calificada del total de integrantes");
			f2n1.setFormulaDescription("Es el resultado de la suma de votos que representen, cuando menos; las dos terceras partes"
					+ " del total de integrantes del Congreso del Estado");
			fs.add(f2n1);
			Formula f2 = new Formula();
			f2.setFormulaExpression("($attendance_lenght/3)*2");
			f2.setFormulaName("Mayoría calificada de los presentes");
			f2.setFormulaDescription("Es el resultado de la suma de votos que representen, cuando menos; las dos terceras partes del"
					+ " total de los presentes en el Congreso del Estado");
			fs.add(f2);
			Formula f3 = new Formula();
			f3.setFormulaExpression("$most");
			f3.setFormulaName("Mayoría relativa o simple");
			f3.setFormulaDescription("Es el resultado de la suma de votos de los diputados presentes, que constituye la cantidad superior "
					+ "frente a otra u otras opciones");
			fs.add(f3);
			
			repo.saveAll(fs);
			l =repo.findAll();
		}
		return l; 
	}

}
