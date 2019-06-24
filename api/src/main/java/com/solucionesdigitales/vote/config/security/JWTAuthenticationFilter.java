package com.solucionesdigitales.vote.config.security;

import static com.solucionesdigitales.vote.config.security.Constants.HEADER_AUTHORIZACION_KEY;
import static com.solucionesdigitales.vote.config.security.Constants.ISSUER_INFO;
import static com.solucionesdigitales.vote.config.security.Constants.SUPER_SECRET_KEY;
import static com.solucionesdigitales.vote.config.security.Constants.TOKEN_BEARER_PREFIX;
import static com.solucionesdigitales.vote.config.security.Constants.TOKEN_EXPIRATION_TIME;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.solucionesdigitales.vote.entity.fingerprint.FingerPrint;
import com.solucionesdigitales.vote.entity.partner.Partner;
import com.solucionesdigitales.vote.entity.partner.PartnerHasFingerPrint;
import com.solucionesdigitales.vote.repository.FingerPrintRepository;
import com.solucionesdigitales.vote.repository.user.UserRepository;
import com.solucionesdigitales.vote.service.impl.partner.PartnerHasFingerPrintServiceImpl;
import com.solucionesdigitales.vote.service.partner.PartnerService;
import com.solucionesdigitales.vote.service.user.MongoUserDetailsService;

public class JWTAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

	private static final Logger LOGGER = LoggerFactory.getLogger(JWTAuthenticationFilter.class);
	
	//@Autowired
	MongoUserDetailsService userDetails;
	UserRepository userRepository;
	private FingerPrintRepository fingerPrintRepository; 
	private PartnerHasFingerPrintServiceImpl validadorDeHuella;
	private PartnerService partnerService;
	
	private AuthenticationManager authenticationManager;
	private boolean passwordEnabled;
	public JWTAuthenticationFilter(AuthenticationManager authenticationManager,PartnerService partnerService,FingerPrintRepository fingerPrintRepository,PartnerHasFingerPrintServiceImpl validadorDeHuella,boolean passwordEnabled) {
		this.authenticationManager = authenticationManager;
		this.partnerService= partnerService;
		this.fingerPrintRepository = fingerPrintRepository;
		this.validadorDeHuella = validadorDeHuella;
		this.passwordEnabled = passwordEnabled;
	}

	@Override
	public Authentication attemptAuthentication(HttpServletRequest request,	HttpServletResponse response) 
			throws AuthenticationException {
		LOGGER.error("AUTENTICANDO");
		
		
		com.solucionesdigitales.vote.entity.user.User access;
		try {
			UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = null;
			access = new ObjectMapper().readValue(request.getInputStream(),
					com.solucionesdigitales.vote.entity.user.User.class);			
			LOGGER.info("access object -->" + access.toString());
			FingerPrint fp = new FingerPrint();
			Partner partner =partnerService.findByUserUsername(access.getUsername());
			if(partner != null && passwordEnabled) {
				partner = partnerService.findByUsernameAndPassword(access.getUsername(), access.getPassword());
			}
			
			if(!passwordEnabled) {
				access.setPassword("test");
			}
			//FingerPrint  fingerPrint = fingerPrintRepository.findByTemplateSt(access.getPassword());//?
			
			fp.setTemplateSt(access.getPassword());
			
			PartnerHasFingerPrint partnerHasFingerPrint = new PartnerHasFingerPrint();
			partnerHasFingerPrint.setPartner(partner);
			partnerHasFingerPrint.setFingerPrint(fp);
			
			//boolean result = validadorDeHuella.identify(partnerHasFingerPrint);
			
			
			usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(access.getUsername(), access.getPassword(),	new ArrayList<>());
			return authenticationManager.authenticate(
					usernamePasswordAuthenticationToken
							);
		} catch (IOException e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		}
	}

	@Override
	protected void successfulAuthentication(HttpServletRequest request,
			HttpServletResponse response, FilterChain chain, Authentication auth)
			throws IOException, ServletException {
		LOGGER.debug("----------- | Test(User):"+((User) auth.getPrincipal()).getUsername());

		String token = Jwts
				.builder()
				.setIssuedAt(new Date())
				.setIssuer(ISSUER_INFO)
				.setSubject(((User) auth.getPrincipal()).getUsername())
				.setExpiration(new Date(System.currentTimeMillis()+ TOKEN_EXPIRATION_TIME))
				.signWith(SignatureAlgorithm.HS512, SUPER_SECRET_KEY)
				.compact();
		LOGGER.debug("token is ["+token+"]");
		response.addHeader(HEADER_AUTHORIZACION_KEY, TOKEN_BEARER_PREFIX + " "+ token);
	}
	
	
}
