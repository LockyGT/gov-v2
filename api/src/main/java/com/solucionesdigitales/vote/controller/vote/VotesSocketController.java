package com.solucionesdigitales.vote.controller.vote;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.solucionesdigitales.vote.entity.Attendance;
import com.solucionesdigitales.vote.entity.Quorum;
import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.entity.vote.Vote;
import com.solucionesdigitales.vote.entity.vote.VoteSession;
import com.solucionesdigitales.vote.service.initiative.InitiativeService;
import com.solucionesdigitales.vote.service.utils.Constants;
import com.solucionesdigitales.vote.service.utils.Utils;

/**
 * 
 * @author javier
 *
 */
@Controller
public class VotesSocketController {

	private static final Logger logger = LoggerFactory.getLogger(VotesSocketController.class);
	@Autowired
	InitiativeService initiativeService;

	CompletableFuture<Void> future;

	@Autowired
	private SimpMessagingTemplate template;
	
	@Autowired
	private Utils utils;

	/**
	 * 
	 * @param initiative
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/initvotation")
	@SendTo("/votation/init")
	public Initiative initVotation(Initiative initiative) throws Exception {		
		ZonedDateTime s = ZonedDateTime.now();
		logger.debug("zoned: " + s);
		LocalDateTime now = s.toLocalDateTime();
		logger.debug("localdate: " + now);
		initiative.setFechaHoraInicio(now);
		initiative.setStatus(Constants._INITIATED);
		initiativeService.put(initiative);
		future = CompletableFuture.runAsync(() -> {
			logger.info("Looking up " + initiative);

			// Artificial delay of 1s for demonstration purposes
			Long millis = (long) (initiative.getHours() * 60 * 60 * 1000);
			millis += (long) (initiative.getMinutes() * 60 * 1000);
			millis += (long) (initiative.getSeconds() * 1000);
			try {
				Thread.sleep(millis);
			} catch (InterruptedException e1) {
				
				e1.printStackTrace();
			}
			// TODO ACTUALIZAR LA INICIATIVA A FINALIZADA, mandar paquete de websocket para
			// finalizar en clientes
			Optional<Initiative> ini = initiativeService.fetchById(initiative.getId());
			if (ini.isPresent()) {
				if (ini.get().isClosed()) {
					// TODO Votacion cerrada
				} else {
					logger.info("Terminando de manera automatica " + ini.get());
					Initiative iniciativa = ini.get();
					ZonedDateTime nowAfter = ZonedDateTime.now();
					iniciativa.setFechaHoraFin(nowAfter.toLocalDateTime());
					iniciativa.setClosed(true);
					iniciativa.setStatus(Constants._FINALIZED);
					iniciativa = utils.qualifyInitiativeResult(iniciativa);
					iniciativa = initiativeService.put(iniciativa);
					try {
						template.convertAndSend("/votation/end", iniciativa);
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}

			}
		});
		return initiative;
	}

	/**
	 * 
	 * @param initiative
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/showvotation")
	@SendTo("/votation/show")
	public Initiative showVotation(Initiative initiative) throws Exception {
		return initiative;
	}
	
	/**
	 * 
	 * @param VoteSession session
	 * @return VoteSession
	 * @throws Exception
	 */
	@MessageMapping("/initattendance")
	@SendTo("/votation/initattendance")
	public VoteSession showAttendence(VoteSession session) throws Exception {
		logger.debug("mandando session");
		return session;
	}
	
	/**
	 * 
	 * @param initiative
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/endvotation")
	@SendTo("/votation/stop")
	public Initiative stopVotationManual(Initiative initiative) throws Exception {
		future.cancel(true);// cancelamos el task de finalizar votacion automatica
		initiative.setFechaHoraFin(LocalDateTime.now());
		initiative.setClosed(true);
		initiative.setStatus(Constants._STOPED);
		initiative = initiativeService.put(initiative);
		return initiative;
	}

	
	/**
	 * 
	 * @param vote
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/add/vote")
	@SendTo("/votation/vote")
	public Vote addVote(Vote vote) throws Exception {
		return vote;
	}
	
	
	/**
	 * 
	 * @param quorum
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/reset/quorum")
	@SendTo("/quorum/reset")
	public Object resetQuorum(String m) throws Exception {
		logger.debug("enviando mensaje" + m);
		HashMap<String, String> msg = new HashMap<>();
		msg.put("mensaje", m);
		return msg;
	}
	
	
	/**
	 * 
	 * @param quorum
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/add/quorum/attendance")
	@SendTo("/quorum/attendance")
	public Quorum addQuorum(Quorum quorum) throws Exception {
		return quorum;
	}

	
	/**
	 * 
	 * @param vote
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/add/attendance")
	@SendTo("/votation/attendance")
	public Attendance addAttendance(Attendance att) throws Exception {
		return att;
	}
}