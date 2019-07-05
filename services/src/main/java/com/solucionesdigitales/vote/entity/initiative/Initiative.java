package com.solucionesdigitales.vote.entity.initiative;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.vote.VoteOption;

@Document(collection = "initiatives")
public class Initiative {
	@Id 
	private String id;
	private String name;
	private LocalDateTime fechaHoraInicio;
	private LocalDateTime fechaHoraPausa;
	private LocalDateTime fechaHoraFin;
	@DBRef
	private List<VoteOption> tiposVotos;	
	private int hours;
	private int minutes;
	private int seconds;
	private boolean isClosed;
	private Result result;
	@DBRef
	private InitiativeAnswerType answerType;
	private boolean noVoteIsAbstention;
	private int status;//0 stado inicial, 1 abierta, 2 pausada, 3 detenida, 4 borrada, 5 error
	
	private String contenidoOd;
	
	/**
	 * @return the id
	 */
	public String getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	/**
	 * @return the tiposVotos
	 */
	public List<VoteOption> getTiposVotos() {
		return tiposVotos;
	}
	/**
	 * @param tiposVotos the tiposVotos to set
	 */
	public void setTiposVotos(List<VoteOption> tiposVotos) {
		this.tiposVotos = tiposVotos;
	}	
	
	public int getHours() {
		return hours;
	}
	public void setHours(int hours) {
		this.hours = hours;
	}
	public int getMinutes() {
		return minutes;
	}
	public void setMinutes(int minutes) {
		this.minutes = minutes;
	}
	public int getSeconds() {
		return seconds;
	}
	public void setSeconds(int seconds) {
		this.seconds = seconds;
	}
	/**
	 * @return the isClosed
	 */
	public boolean isClosed() {
		return isClosed;
	}
	/**
	 * @param isClosed the isClosed to set
	 */
	public void setClosed(boolean isClosed) {
		this.isClosed = isClosed;
	}
	/**
	 * @return the answerType
	 */
	public InitiativeAnswerType getAnswerType() {
		return answerType;
	}
	/**
	 * @param answerType the answerType to set
	 */
	public void setAnswerType(InitiativeAnswerType answerType) {
		this.answerType = answerType;
	}
	/**
	 * @return the noVoteIsAbstention
	 */
	public boolean isNoVoteIsAbstention() {
		return noVoteIsAbstention;
	}
	/**
	 * @param noVoteIsAbstention the noVoteIsAbstention to set
	 */
	public void setNoVoteIsAbstention(boolean noVoteIsAbstention) {
		this.noVoteIsAbstention = noVoteIsAbstention;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	/**
	 * @return the fechaHoraInicio
	 */
	public LocalDateTime getFechaHoraInicio() {
		return fechaHoraInicio;
	}
	/**
	 * @param fechaHoraInicio the fechaHoraInicio to set
	 */
	public void setFechaHoraInicio(LocalDateTime fechaHoraInicio) {
		this.fechaHoraInicio = fechaHoraInicio;
	}
	/**
	 * @return the fechaHoraPausa
	 */
	public LocalDateTime getFechaHoraPausa() {
		return fechaHoraPausa;
	}
	/**
	 * @param fechaHoraPausa the fechaHoraPausa to set
	 */
	public void setFechaHoraPausa(LocalDateTime fechaHoraPausa) {
		this.fechaHoraPausa = fechaHoraPausa;
	}
	/**
	 * @return the fechaHoraFin
	 */
	public LocalDateTime getFechaHoraFin() {
		return fechaHoraFin;
	}
	/**
	 * @param fechaHoraFin the fechaHoraFin to set
	 */
	public void setFechaHoraFin(LocalDateTime fechaHoraFin) {
		this.fechaHoraFin = fechaHoraFin;
	}
	public Result getResult() {
		return result;
	}
	public void setResult(Result result) {
		this.result = result;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Initiative [id=" + id + ", name=" + name + ", fechaHoraInicio=" + fechaHoraInicio + ", fechaHoraPausa="
				+ fechaHoraPausa + ", fechaHoraFin=" + fechaHoraFin + ", tiposVotos=" + tiposVotos + ", hours=" + hours
				+ ", minutes=" + minutes + ", seconds=" + seconds + ", isClosed=" + isClosed + ", result=" + result
				+ ", answerType=" + answerType + ", noVoteIsAbstention=" + noVoteIsAbstention + ", status=" + status
				+ "]";
	}
	public String getContenidoOd() {
		return contenidoOd;
	}
	public void setContenidoOd(String contenidoOd) {
		this.contenidoOd = contenidoOd;
	}
		
}
