package com.solucionesdigitales.vote.entity.vote;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.Congress;
import com.solucionesdigitales.vote.entity.initiative.Initiative;

/**
 * 
 * @author javier
 *
 */

@Document(collection = "vote_sessions")
public class VoteSession {
	
	@Id
	private String id;
	private String nombre;
	private LocalDateTime fechaHora;
	@DBRef
	private List<Initiative> iniciativas;
	@DBRef
	private VoteSessionType type;
	@DBRef
	private Congress congress;
	private boolean isAttendanceOpen;
	private int attendanceNumber;
	private int status;
	
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
	/**
	 * @return the nombre
	 */
	public String getNombre() {
		return nombre;
	}
	/**
	 * @param nombre the nombre to set
	 */
	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
	/**
	 * 
	 * @return
	 */
	public LocalDateTime getFechaHora() {
		return fechaHora;
	}
	
	/**
	 * 
	 * @param fechaHora
	 */
	public void setFechaHora(LocalDateTime fechaHora) {
		this.fechaHora = fechaHora;
	}
	/**
	 * 
	 * @return
	 */
	public List<Initiative> getIniciativas() {
		return iniciativas;
	}
	/**
	 * 
	 * @param iniciativas
	 */
	public void setIniciativas(List<Initiative> iniciativas) {
		this.iniciativas = iniciativas;
	}
	/**
	 * @return the type
	 */
	public VoteSessionType getType() {
		return type;
	}
	/**
	 * @param type the type to set
	 */
	public void setType(VoteSessionType type) {
		this.type = type;
	}
	/**
	 * 
	 * @return
	 */
	public int getStatus() {
		return status;
	}
	/**
	 * 
	 * @param status
	 */
	public void setStatus(int status) {
		this.status = status;
	}
	/**
	 * @return the congress
	 */
	public Congress getCongress() {
		return congress;
	}
	/**
	 * @param congress the congress to set
	 */
	public void setCongress(Congress congress) {
		this.congress = congress;
	}
	public boolean isAttendanceOpen() {
		return isAttendanceOpen;
	}
	public void setAttendanceOpen(boolean isAttendanceOpen) {
		this.isAttendanceOpen = isAttendanceOpen;
	}
	
	public int getAttendanceNumber() {
		return attendanceNumber;
	}
	public void setAttendanceNumber(int attendanceNumber) {
		this.attendanceNumber = attendanceNumber;
	}
	@Override
	public String toString() {
		return "VoteSession [id=" + id + ", nombre=" + nombre + ", fechaHora=" + fechaHora + ", iniciativas="
				+ iniciativas + ", type=" + type + ", congress=" + congress + ", isAttendanceOpen=" + isAttendanceOpen
				+ ", status=" + status + "]";
	}
}
