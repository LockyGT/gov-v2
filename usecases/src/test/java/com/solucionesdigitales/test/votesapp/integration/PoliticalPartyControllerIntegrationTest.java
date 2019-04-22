package com.solucionesdigitales.test.votesapp.integration;

import static org.junit.Assert.assertEquals;

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

import com.solucionesdigitales.vote.entity.PoliticalParty;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class PoliticalPartyControllerIntegrationTest {
	private static final Logger LOGGER = LoggerFactory.getLogger(PoliticalPartyControllerIntegrationTest.class.getName());
	
	String className = this.getClass().getSimpleName();
	PoliticalParty politicalParty;
	
	RestTemplate restTemplate = new RestTemplate();
	HttpHeaders headers = new HttpHeaders();
	
	@Before
	public void before () {
		LOGGER.debug("Start test: "+className);
	}
	
	@Test
	public void test1_postPoliticalParty() {
		int valueExpected = 200;
		politicalParty = new PoliticalParty();
		politicalParty.setAcronym("PRD");
		politicalParty.setName("PARTIDO DE LA REVOLUCION DEMOCRATICA");
		politicalParty.setColour("#FFFFFF");
		
		List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
		acceptableMediaTypes.add(MediaType.APPLICATION_JSON);
		headers.setAccept(acceptableMediaTypes);
		HttpEntity<PoliticalParty> entity = new HttpEntity<PoliticalParty>(politicalParty,
				headers);
		ResponseEntity<String> response = null;
		try {
			response = restTemplate.exchange(
					createURLWithPort("/politicalparty"), HttpMethod.POST,
					entity, String.class);
			LOGGER.info("response post [" + response.getBody()
					+ "]");
		} catch (Exception e) {
			LOGGER.error("Exception",e);		
		}
		assertEquals(valueExpected, response.getStatusCodeValue());
	}
	
	@Test
	public void test2_putPoliticalParty() {
		int valueExpected = 200;
		politicalParty = new PoliticalParty();
		politicalParty.setId("5c5de9d2de32c22e304cd287");
		politicalParty.setColour("#FAF60A");
		
		List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
		acceptableMediaTypes.add(MediaType.APPLICATION_JSON);
		headers.setAccept(acceptableMediaTypes);
		HttpEntity<PoliticalParty> entity = new HttpEntity<PoliticalParty>(politicalParty,
				headers);
		ResponseEntity<String> response = null;
		try {
			response = restTemplate.exchange(
					createURLWithPort("/politicalparty"), HttpMethod.PUT,
					entity, String.class);
			LOGGER.info("response put [" + response.getBody()
					+ "]");
		} catch (Exception e) {
			LOGGER.error("Exception",e);		
		}
		assertEquals(valueExpected, response.getStatusCodeValue());
	}
	
	@Test
	public void test3_getPoliticalParty() {
		int valueExpected = 200;
		
		HttpEntity<PoliticalParty> entity = new HttpEntity<PoliticalParty>(null,
				headers);
		ResponseEntity<String> response = null;
		try {
			response = restTemplate.exchange(
					createURLWithPort("/politicalparty"), HttpMethod.GET,
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
