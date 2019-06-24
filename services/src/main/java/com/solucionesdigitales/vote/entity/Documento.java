package com.solucionesdigitales.vote.entity;

public class Documento {
	
	private String titulo;
	private String tipo;
	private boolean requerido;
	private String uuid;
	
	public String getTitulo() {
		return titulo;
	}
	public void setTitulo(String titulo) {
		this.titulo = titulo;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public boolean isRequerido() {
		return requerido;
	}
	public void setRequerido(boolean requerido) {
		this.requerido = requerido;
	}
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	@Override
	public String toString() {
		return "Documento [titulo=" + titulo + ", tipo=" + tipo + ", requerido=" + requerido + ", uuid=" + uuid + "]";
	}
	
	
	

}
