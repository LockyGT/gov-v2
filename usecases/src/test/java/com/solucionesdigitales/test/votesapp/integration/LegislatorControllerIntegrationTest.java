package com.solucionesdigitales.test.votesapp.integration;

import static org.junit.Assert.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.solucionesdigitales.vote.entity.partner.Partner;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class LegislatorControllerIntegrationTest {
	private static final Logger LOGGER = LoggerFactory.getLogger(LegislatorControllerIntegrationTest.class.getName());
	
	String className = this.getClass().getSimpleName();
	
	Partner legislator; 
	
	String fecha = "1970-08-16";
    LocalDate fecha_cumpleanios = LocalDate.parse(fecha);
    RestTemplate restTemplate = new RestTemplate();
	HttpHeaders headers = new HttpHeaders();
	
	@Before
	public void before () {
		LOGGER.debug("Start test: "+className);
	}
	
	@Test
	public void test1_postLegislator() {
		int valueExpected = 200;
		Partner legislator = new Partner();
		legislator.setSku(1111);
		legislator.setName("Juan");
		legislator.setApPaterno("Jimenez");
		legislator.setApMaterno("Perez");
		legislator.setFechaCumplianos(fecha_cumpleanios);
		
		List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
		acceptableMediaTypes.add(MediaType.APPLICATION_JSON);
		headers.setAccept(acceptableMediaTypes);
		HttpEntity<Partner> entity = new HttpEntity<Partner>(legislator,
				headers);
		ResponseEntity<String> response = null;
		try {
			response = restTemplate.exchange(
					createURLWithPort("/legislator"), HttpMethod.POST,
					entity, String.class);
			LOGGER.info("response post [" + response.getBody()
					+ "]");
		} catch (Exception e) {
			LOGGER.error("Exception",e);		
		}
		assertEquals(valueExpected, response.getStatusCodeValue());
	}
	
	@Test
	public void test2_putLegislator() {
		int valueExpected = 200;
		Partner legislator = new Partner();
		legislator.setId("5c59af7001ff230d44ae19cd");
		legislator.setSku(1111);
		legislator.setName("Juan Marco");
		legislator.setApPaterno("Perez");
		legislator.setApMaterno("Jimenez");
		
		List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
		acceptableMediaTypes.add(MediaType.APPLICATION_JSON);
		headers.setAccept(acceptableMediaTypes);
		HttpEntity<Partner> entity = new HttpEntity<Partner>(legislator,
				headers);
		ResponseEntity<String> response = null;
		try {
			response = restTemplate.exchange(
					createURLWithPort("/legislator"), HttpMethod.PUT,
					entity, String.class);
			LOGGER.info("response put [" + response.getBody()
					+ "]");
		} catch (Exception e) {
			LOGGER.error("Exception",e);	
		}
		assertEquals(valueExpected, response.getStatusCodeValue());
	}
	
	@Test
	public void test3_getLegislator() {
		int valueExpected = 200;
		HttpEntity<Partner> entity = new HttpEntity<Partner>(null,
				headers);
		ResponseEntity<String> response = null;
		try {
			response = restTemplate.exchange(
					createURLWithPort("/legislator"), HttpMethod.GET,
					entity, String.class);
			LOGGER.info("response get [" + response.getBody()
					+ "]");
		} catch (Exception e) {
			LOGGER.error("Exception",e);
		}
		assertEquals(valueExpected, response.getStatusCodeValue());
	}
	
	private String createURLWithPort(String uri) {
		return "http://localhost:" + "8091" + uri;
	}
}
