package com.solucionesdigitales.vote.service.impl.partner;

import java.io.UnsupportedEncodingException;
import java.util.Base64;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.machinezoo.sourceafis.FingerprintMatcher;
import com.machinezoo.sourceafis.FingerprintTemplate;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.partner.PartnerHasFingerPrint;
import com.solucionesdigitales.vote.entity.user.User;
import com.solucionesdigitales.vote.repository.FingerPrintRepository;
import com.solucionesdigitales.vote.repository.partner.PartnerHasFingerPrintRepository;
import com.solucionesdigitales.vote.repository.partner.PartnerRepository;
import com.solucionesdigitales.vote.repository.user.UserRepository;
import com.solucionesdigitales.vote.service.partner.PartnerHasFingerPrintService;
import com.solucionesdigitales.vote.service.utils.Constants;

@Service("partnerHasFingerPrintService")
public class PartnerHasFingerPrintServiceImpl implements PartnerHasFingerPrintService{

	private static final Logger logger = LoggerFactory.getLogger(PartnerHasFingerPrintServiceImpl.class);

	@Autowired
	private PartnerHasFingerPrintRepository repo;

	@Autowired
	private PartnerRepository legislatorRepo;

	@Autowired
	private FingerPrintRepository fingerRepo;

	@Autowired
	private UserRepository userRepo;

	@Override
	public List<PartnerHasFingerPrint> fetch() {		
		return repo.findAll();
	}

	@Override
	public PartnerHasFingerPrint post(PartnerHasFingerPrint entity) {
		if(entity.getFingerPrint().getId() == null || entity.getFingerPrint().getId().isEmpty()) {
			if(entity.getFingerPrint().getTemplateSt() != null && !entity.getFingerPrint().getTemplateSt().isEmpty()) {
				entity.getFingerPrint().setStatus(1);
				entity.setFingerPrint(fingerRepo.save(entity.getFingerPrint()));
			}else {
				return null;
			}			
		}
		return repo.save(entity);
	}

	@Override
	public PartnerHasFingerPrint put(PartnerHasFingerPrint entity) {		
		return repo.save(entity);
	}

	@Override
	public List<PartnerHasFingerPrint> fetchByLegislatorId(String id) {
		return repo.findByPartnerId(id);
	}
	
	@Override
	public List<PartnerHasFingerPrint> fetchByPartnerIdAndStatus(String id, int status) {	
		List<PartnerHasFingerPrint> fps = repo.findByPartnerIdAndStatus(id, status);
		if(fps != null && !fps.isEmpty()) {
			for (int i = 0; i < fps.size(); i++) {				
				if(fps.get(i) != null) {
					if(fps.get(i).getFingerPrint() != null) {
						if(fps.get(i).getFingerPrint().getTemplateSt() != null && !fps.get(i).getFingerPrint().getTemplateSt().isEmpty()) {
							fps.get(i).getFingerPrint().setTemplateSt(null);
						}
					}
				}
			}
		}
		return fps;
	}

	@Override
	public boolean identify(PartnerHasFingerPrint lfp) {		
		boolean match = false;
		if(lfp.getPartner().getId() == null || lfp.getPartner().getId().isEmpty()) {
			if(lfp.getPartner().getSku() > 0) {
				lfp.setPartner(legislatorRepo.findBySku(lfp.getPartner().getSku()));
			}else {
				return match;
			}
		}
		List<PartnerHasFingerPrint> legislatorFingerPrints = repo.findByPartnerId(lfp.getPartner().getId());
		if(legislatorFingerPrints != null && legislatorFingerPrints.size() > 0) {
			byte[] candidate = null;
			FingerprintTemplate candi = new FingerprintTemplate();
			try {					
				candidate = Base64.getDecoder().decode(lfp.getFingerPrint().getTemplateSt().trim().getBytes("UTF-8"));					
				candi = new FingerprintTemplate().dpi(500).create(candidate);
			} catch (UnsupportedEncodingException e1) {					
				e1.printStackTrace();
			}
			for(PartnerHasFingerPrint lf : legislatorFingerPrints) {				
				try {
					byte[] real = Base64.getDecoder().decode(lf.getFingerPrint().getTemplateSt().trim().getBytes("UTF-8"));				

					FingerprintTemplate probe = new FingerprintTemplate().dpi(500).create(real);						
					double score = new FingerprintMatcher().index(probe).match(candi);
					match = score >= 40;
					logger.info("index: ["+lf.getFingerPrint().getFingerIndex()+"] | match : ["+match+"]");
					if(match) break;
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}					
			}				

		}else {
			//TODO
		}
		return match;
	}

	@Override
	public Partner identifySkuOnly(PartnerHasFingerPrint lfp) {		
		boolean match = false;
		if(lfp.getPartner().getId() == null || lfp.getPartner().getId().isEmpty()) {
			if(lfp.getPartner().getSku() > 0) {
				lfp.setPartner(legislatorRepo.findBySku(lfp.getPartner().getSku()));
			}else {
				return null;
			}
		}
		List<PartnerHasFingerPrint> legislatorFingerPrints = repo.findByPartner(lfp.getPartner());
		if(legislatorFingerPrints != null && legislatorFingerPrints.size() > 0) {
			byte[] candidate = null;
			FingerprintTemplate candi = new FingerprintTemplate();
			try {					
				candidate = Base64.getDecoder().decode(lfp.getFingerPrint().getTemplateSt().trim().getBytes("UTF-8"));					
				candi = new FingerprintTemplate().dpi(500).create(candidate);
			} catch (UnsupportedEncodingException e1) {					
				e1.printStackTrace();
			}
			for(PartnerHasFingerPrint lf : legislatorFingerPrints) {				
				try {
					byte[] real = Base64.getDecoder().decode(lf.getFingerPrint().getTemplateSt().trim().getBytes("UTF-8"));				

					FingerprintTemplate probe = new FingerprintTemplate().dpi(500).create(real);						
					double score = new FingerprintMatcher().index(probe).match(candi);
					match = score >= 40;
					logger.info("index: ["+lf.getFingerPrint().getFingerIndex()+"] | match : ["+match+"]");
					if(match) break;
				} catch (UnsupportedEncodingException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}					
			}				

		}else {
			//TODO
		}
		if(match == false) {
			lfp.setPartner(null);
		}
		return lfp.getPartner();
	}

	@Override
	public Partner identifyUsernameOnly(PartnerHasFingerPrint entity) {
		boolean match = false;
		
		if(entity.getPartner().getId() == null) {
			if(!entity.getPartner().getName().isEmpty()) {
				logger.debug("buscando usuario: " + entity);
				User u = userRepo.findByUsername(entity.getPartner().getName());
				logger.debug("usuario encontrado!: " + u);
				if(u != null) {
					logger.debug("buscando partner ... ");
					entity.setPartner(legislatorRepo.findByUserId(u.getId()));
					if(entity.getPartner() != null) {
						logger.debug("partner encontrado!: " + entity.getPartner());
						logger.debug("buscando huellas!: ");
						List<PartnerHasFingerPrint> partnerFingerPrints = repo.findByPartnerIdAndStatus(entity.getPartner().getId(), Constants._ACTIVE);
						if(partnerFingerPrints != null && partnerFingerPrints.size() > 0) {
							logger.debug("huellas encontradas!: ");
							byte[] candidate = null;
							FingerprintTemplate candi = new FingerprintTemplate();
							try {					
								candidate = Base64.getDecoder().decode(entity.getFingerPrint().getTemplateSt().trim().getBytes("UTF-8"));					
								candi = new FingerprintTemplate().dpi(500).create(candidate);
							} catch (UnsupportedEncodingException e1) {					
								e1.printStackTrace();
							}
							for(PartnerHasFingerPrint pf : partnerFingerPrints) {				
								try {
									byte[] real = Base64.getDecoder().decode(pf.getFingerPrint().getTemplateSt().trim().getBytes("UTF-8"));				

									FingerprintTemplate probe = new FingerprintTemplate().dpi(500).create(real);						
									double score = new FingerprintMatcher().index(probe).match(candi);
									match = score >= 40;
									logger.info("index: ["+pf.getFingerPrint().getFingerIndex()+"] | match : ["+match+"]");
									if(match) break;
								} catch (UnsupportedEncodingException e) {
									// TODO Auto-generated catch block
									e.printStackTrace();
								}					
							}				

						}else {
							//TODO
							logger.debug("huellas no encontradas!: ");
							match = false;
						}
					}else {
						match = false;
					}
				}else {
					return null;
				}
			}else {
				return null;
			}
		}
		
		if(match == false) {
			entity.setPartner(null);
		}
		return entity.getPartner();
	}

	@Override
	public boolean putToDelete(String partnerId, int index) {		
		List<PartnerHasFingerPrint> fp2d = repo.findByPartnerId(partnerId);
		//List<PartnerHasFingerPrint> fp2d = new ArrayList<PartnerHasFingerPrint>(); 
		if(fp2d != null && fp2d.size() > 0) {
			logger.debug("cantidad de huellas: " + fp2d.size());
			for(PartnerHasFingerPrint pfp : fp2d) {
				if(pfp.getFingerPrint().getFingerIndex() == index) {
					//logger.debug("huella a borrar" + pfp.getFingerPrint().getId());
					pfp.setStatus(0);
					pfp.getFingerPrint().setStatus(0);
					repo.delete(pfp);
				}				
			}
		}else {
			logger.debug("sin huellas por borrar");
		}
		return true;
	}

	

}
