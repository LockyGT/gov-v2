package com.solucionesdigitales.vote.entity;

public class Documento {
	
	private String titulo;

	private String uuid;
	private int status;
	
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getTitulo() {
		return titulo;
	}
	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	@Override
	public String toString() {
		return "Documento [titulo=" + titulo +", uuid=" + uuid + "]";
	}
}
