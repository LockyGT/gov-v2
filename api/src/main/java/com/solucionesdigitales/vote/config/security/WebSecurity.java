package com.solucionesdigitales.vote.config.security;

import static com.solucionesdigitales.vote.config.security.Constants.LOGIN_URL;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class WebSecurity extends WebSecurityConfigurerAdapter {

	private UserDetailsService userDetailsService;

	public WebSecurity(UserDetailsService userDetailsService) {
		this.userDetailsService = userDetailsService;
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity httpSecurity) throws Exception {
		httpSecurity
		.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
		.cors().and()
		.headers().addHeaderWriter(new XFrameOptionsHeaderWriter( XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN)).and()
		.csrf().disable()
		.authorizeRequests().antMatchers(HttpMethod.POST, LOGIN_URL).permitAll()
		.antMatchers(HttpMethod.GET, "/partner/byStatus/init*").permitAll()
		.antMatchers(HttpMethod.GET, "/partner/byUsername/init*").permitAll()			
		.antMatchers(HttpMethod.GET, "/config/auth").permitAll()
		.antMatchers("/index.html","/views/**").permitAll()
		.antMatchers("/votes-socket/**").permitAll()
		.antMatchers("/js/**").permitAll()
		.antMatchers("/files/**").permitAll()
		.antMatchers("/components/**").permitAll()			
		.antMatchers("/img/**").anonymous()
		.antMatchers("/webjars/**").anonymous()
		.antMatchers("/css/**").anonymous()
		//.antMatchers("/config/**").anonymous()
		.antMatchers("/favicon.*").anonymous()
		.anyRequest().authenticated().and()
		.addFilter(new JWTAuthenticationFilter(authenticationManager()))
		.addFilter(new JWTAuthorizationFilter(authenticationManager()));
	}

	@Override
	public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", new CorsConfiguration().applyPermitDefaultValues());
		return source;
	}
}
