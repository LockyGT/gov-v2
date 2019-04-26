package com.solucionesdigitales.vote.config.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.solucionesdigitales.vote.repository.FingerPrintRepository;
import com.solucionesdigitales.vote.repository.user.UserRepository;
import com.solucionesdigitales.vote.service.impl.partner.PartnerHasFingerPrintServiceImpl;
import com.solucionesdigitales.vote.service.partner.PartnerService;
import com.solucionesdigitales.vote.service.user.MongoUserDetailsService;

@SuppressWarnings("deprecation")
@Configuration
@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter {
	private static final Logger LOGGER = LoggerFactory.getLogger(WebSecurity.class);	
	
	@Autowired
	private MongoUserDetailsService userDetailsService;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	PartnerHasFingerPrintServiceImpl validadorDeHuella;
	
	@Autowired
	private PartnerService partnerService; 
	
	@Autowired
	private FingerPrintRepository fingerPrintRepository; 
	
	
	private static final int MAX_NUMBER_OF_SESSIONS_PEER_USER=1;
/*
	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}*/
	
	@Bean
	public PasswordEncoder passwordEncoder() {
	    return NoOpPasswordEncoder.getInstance();
	}

	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {
		
		//Limitando el numero a 1 sesión activa por usuario.
		httpSecurity.sessionManagement().maximumSessions(MAX_NUMBER_OF_SESSIONS_PEER_USER);
		//Creando sesión solo si es requerida.
		httpSecurity
		.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED).and()
		.cors().and()
		.headers().addHeaderWriter(new XFrameOptionsHeaderWriter( XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN)).and()
		.csrf().disable()
		//.authorizeRequests().antMatchers(HttpMethod.POST, LOGIN_URL).permitAll()
		.authorizeRequests().antMatchers(HttpMethod.POST, "/login").permitAll()
		.antMatchers(HttpMethod.GET, "/partner/byStatus/init*").permitAll()
		.antMatchers(HttpMethod.GET, "/partner/byUsername/init*").permitAll()			
		.antMatchers(HttpMethod.GET, "/config/auth").permitAll()
		.antMatchers("/index.html","/views/**").permitAll()
		.antMatchers("/votes-socket/**").permitAll()
		.antMatchers("/js/**").permitAll()
		.antMatchers("/files/**").permitAll()
		.antMatchers("/components/**").permitAll()			
		.antMatchers("/img/**").permitAll()
		.antMatchers("/webjars/**").anonymous()
		.antMatchers("/css/**").anonymous()
		//.antMatchers("/config/**").anonymous()
		.antMatchers("/favicon.*").anonymous()
		.anyRequest().authenticated().and()
		.addFilter(new JWTAuthenticationFilter(authenticationManager(),partnerService,fingerPrintRepository,validadorDeHuella))
		//.addFilter(new JWTAuthenticationFilter())
		.addFilter(new JWTAuthorizationFilter(authenticationManager()));
	}
	
	/*@Bean
	public JWTAuthenticationFilter getJWTAuthenticationFilter() throws Exception {
	    final JWTAuthenticationFilter filter = new JWTAuthenticationFilter(authenticationManager());
	    filter.setFilterProcessesUrl("/api/auth/login");
	    return filter;
	}*/

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		LOGGER.debug("configure method");
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
		
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());
		return source;
	}
}
