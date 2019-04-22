package com.solucionesdigitales.vote.service.impl.partner;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.Photo;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.user.User;
import com.solucionesdigitales.vote.repository.PhotoRepository;
import com.solucionesdigitales.vote.repository.partner.PartnerRepository;
import com.solucionesdigitales.vote.repository.user.UserRepository;
import com.solucionesdigitales.vote.service.partner.PartnerService;
import com.solucionesdigitales.vote.service.utils.Utils;

@Service("partnerService")
public class PartnerServiceImpl implements PartnerService {
	
	private static final Logger logger = LoggerFactory.getLogger(PartnerServiceImpl.class);
	
	@Autowired
	private PartnerRepository repo;
	
	@Autowired
	private PhotoRepository repoFoto;
	
	@Autowired
	private UserRepository repoUser;
	
	
	@Autowired
	private Utils utils;
	
	@Override
	public List<Partner> fetch() {
		List<Partner> partners= repo.findAllByOrderByNameAsc();
		return partners;

	}
	
	@Override
	public List<Partner> fetchByStatus(int status) { 
//		List<Partner> partners= repo.findAllByStatusOrderByNameAsc(status);
		List<Partner> partners= repo.findAllByStatusOrderByApPaternoAsc(status);
		return partners;
	}
	
	@Override
	public Partner fetchBySku(int sku) {
		Partner partner = repo.findBySku(sku);		
		return partner;
	}

	@Override
	public Partner post(Partner entity) {	
		Partner partner = new Partner();
		if (entity.getUser() != null && entity.getUser().getUsername() != null  
				&& entity.getUser().getUserRol() != null && entity.getUser().getUserRol().getRoleName() != null) {
			User user = repoUser.save(entity.getUser());
			entity.setUser(user);
		}
		
		if (entity != null && entity.getFoto() != null && entity.getFoto().getFilePath() != null && entity.getFoto().getFilePath().trim().length() > 0) {
			String str64Logo = entity.getFoto().getFilePath().trim();
			entity.setFoto(null);;
			partner = repo.save(entity); 
//			legislator.getFoto().setFilePath(); // se manda a guardar primero para recuperar el ID y usarlo de nombre
			Photo foto = new Photo();
			foto.setFilePath(utils.saveImageFromBase64(str64Logo, entity.getId(),"legislator"));
			foto = repoFoto.save(foto);
			partner.setFoto(foto);
			partner = repo.save(partner); //Se reemplaza por el doc que trae ya con la ruta actualizada del logo
		}else {
			partner = repo.save(entity); 
		}
		return partner;
//		return repo.save(entity);
	}

	@Override
	public Partner put(Partner entity) {	
		logger.debug("actualizando foto!");
		Partner partner = new Partner();
		if (entity.getUser() != null && entity.getUser().getUsername() != null  
				&& entity.getUser().getUserRol() != null && entity.getUser().getUserRol().getRoleName() != null) {
			User user = repoUser.save(entity.getUser());
			entity.setUser(user);
		}
		
		if (entity != null && entity.getFoto() != null && entity.getFoto().getFilePath() != null && entity.getFoto().getFilePath().trim().length() > 0) {
			String str64Logo = entity.getFoto().getFilePath().trim();
			Photo foto = entity.getFoto();
			foto.setFilePath(utils.saveImageFromBase64(str64Logo, entity.getId(),"legislator"));
			if (!foto.getFilePath().isEmpty()){//entity.getFoto() != null  && (entity.getId() == null ||  entity.getId().trim().length() == 0)
				foto = repoFoto.save(foto);
				entity.setFoto(foto);
			}
			partner = repo.save(entity); 
		}else {
			partner = repo.save(entity); 
		}
		return partner;
	}

	@Override
	public Partner findByUserUsername(String username) {
		User u = repoUser.findByUsername(username);
		if(u != null)
		{
			return repo.findByUserId(u.getId());
		}else {
			return null;
		}
		
	}

	@Override
	public Partner fetchOneByStatus(int status) {	
		List<Partner> ps = repo.findByStatus(status); 
		Partner p = null;
		if(ps != null && !ps.isEmpty()) {
			p = ps.get(0);
		}
		return p;
	}

	@Override
	public Partner fetchById(String id) {
		return repo.findFirstById(id);
	}	

}
