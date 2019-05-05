package com.solucionesdigitales.test.votesapp.integration;

import static org.junit.Assert.*;

import java.util.ArrayList;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.solucionesdigitales.vote.entity.vote.VoteOption;


public class VoteOptionControllerIntegrationTest {
	String className = this.getClass().getSimpleName();
	private static final Logger LOGGER = LoggerFactory.getLogger(VoteOptionControllerIntegrationTest.class.getName());
	RestTemplate restTemplate = new RestTemplate();
	HttpHeaders headers = new HttpHeaders();
	
	@Before
	public void before () {
		LOGGER.debug("Start test: "+className);
	}
	
	@Test
	public void test1_posVoteOption() {
		int valueExpected = 200;
		VoteOption voteOption = new VoteOption();
		voteOption.setName("Aprobed");
		voteOption.setVoteColor("Green");
		
		List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
		acceptableMediaTypes.add(MediaType.APPLICATION_JSON);
		headers.setAccept(acceptableMediaTypes);
		HttpEntity<VoteOption> entity = new HttpEntity<VoteOption>(voteOption,
				headers);
		ResponseEntity<String> response = null;
		try {
			response = restTemplate.exchange(
					createURLWithPort("/voteoption"), HttpMethod.POST,
					entity, String.class);
			LOGGER.info("response post [" + response.getBody()
					+ "]");
		} catch (Exception e) {
			LOGGER.error("Exception",e);		
		}
		assertEquals(valueExpected, response.getStatusCodeValue());
	}
	
	@Test
	public void test2_putVoteOption() {
		int valueExpected = 200;
		VoteOption voteOption = new VoteOption();
		voteOption.setId("5c59c92401ff230d44ae19d4");
		voteOption.setName("Disapproved");
		voteOption.setVoteColor("Red");
		
		List<MediaType> acceptableMediaTypes = new ArrayList<MediaType>();
		acceptableMediaTypes.add(MediaType.APPLICATION_JSON);
		headers.setAccept(acceptableMediaTypes);
		HttpEntity<VoteOption> entity = new HttpEntity<VoteOption>(voteOption,
				headers);
		ResponseEntity<String> response = null;
		try {
			response = restTemplate.exchange(
					createURLWithPort("/voteoption"), HttpMethod.PUT,
					entity, String.class);
			LOGGER.info("response put [" + response.getBody()
					+ "]");
		} catch (Exception e) {
			LOGGER.error("Exception",e);		
		}
		assertEquals(valueExpected, response.getStatusCodeValue());
	}
	
	@Test
	public void test3_getVoteOption() {
		int valueExpected = 200;
		HttpEntity<VoteOption> entity = new HttpEntity<VoteOption>(null,
				headers);
		ResponseEntity<String> response = null;
		try {
			response = restTemplate.exchange(
					createURLWithPort("/voteoption"), HttpMethod.GET,
					entity, String.class);
			LOGGER.info("response get [" + response.getBody()
					+ "]");
		} catch (Exception e) {
			LOGGER.error("Exception",e);		
		}
		assertEquals(valueExpected, response.getStatusCodeValue());
	}
	
	private String createURLWithPort(String uri) {
		return "http://localhost:" + "8080" + uri;
	}

}
