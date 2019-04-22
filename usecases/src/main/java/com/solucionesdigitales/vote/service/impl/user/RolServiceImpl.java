package com.solucionesdigitales.vote.service.impl.user;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.user.Rol;
import com.solucionesdigitales.vote.repository.user.RolRepository;
import com.solucionesdigitales.vote.service.user.RolService;
import com.solucionesdigitales.vote.service.utils.Constants;

@Service("rolService")
public class RolServiceImpl implements RolService {
	
	@Autowired
	private RolRepository repo;
	
	@Override
	public List<Rol> fetch() {
		List<Rol> rols= repo.findAll();
		if ( rols == null || rols.size() == 0) {
			Rol r1 = new Rol();
			r1.setRoleName("LEGISLADOR");
			r1.setStatus(1);
			r1.setSku(Constants._LEGISLATOR);
			
			Rol r2 = new Rol();
			r2.setRoleName("OPERADOR");
			r2.setStatus(1);
			r2.setSku(Constants._OPERATOR);
			
			Rol r3 = new Rol();
			r3.setRoleName("OPERADOR");
			r3.setStatus(1);
			r3.setSku(Constants._PANEL_OPERATOR);
			
			repo.save(r1);
			repo.save(r2);
			repo.save(r3);			
		}else {
			if(rols.size() == 2) {
				Rol r3 = new Rol();
				r3.setRoleName("OPERADOR_PANEL");
				r3.setStatus(1);
				r3.setSku(Constants._PANEL_OPERATOR);				
				repo.save(r3);
			}
		}
		rols = repo.findAll();
		return rols;
	}
	
	@Override
	public Rol post(Rol entity) {	
		return repo.save(entity);
	}

	@Override
	public Rol put(Rol entity) {	
		return repo.save(entity);
	}	

}
