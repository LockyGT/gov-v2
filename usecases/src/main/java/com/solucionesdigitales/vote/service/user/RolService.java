package com.solucionesdigitales.vote.service.user;

import java.util.List;

import com.solucionesdigitales.vote.entity.user.Rol;

public interface RolService {

	List<Rol> fetch();
	
	Rol post(Rol entity);

	Rol put(Rol entity);
}
