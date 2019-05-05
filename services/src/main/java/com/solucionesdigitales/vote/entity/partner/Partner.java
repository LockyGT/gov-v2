package com.solucionesdigitales.vote.entity.partner;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.solucionesdigitales.vote.entity.Congress;
import com.solucionesdigitales.vote.entity.Photo;
import com.solucionesdigitales.vote.entity.PoliticalParty;
import com.solucionesdigitales.vote.entity.user.User;

@Document(collection = "partners")
public class Partner {
	
	@Id 
	private String id;
	@Indexed
	private int sku; 
	private String name;
	private String apPaterno;
	private String apMaterno;
	private LocalDate fechaCumplianos;
	private String email;	
	private String comisiones;
	private String distrito;
	private String legislatura;
	private String telefono;
	@DBRef
	private PoliticalParty partido;
	@DBRef
	private User user;
	@DBRef
	private Congress congreso;
	@DBRef
	private Photo foto;	
	private int tipoPartner;//1 LEGISLATOR, 2 OPERATOR 
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
	 * @return the sku
	 */
	public int getSku() {
		return sku;
	}
	/**
	 * @param sku the sku to set
	 */
	public void setSku(int sku) {
		this.sku = sku;
	}
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	
	public String getApPaterno() {
		return apPaterno;
	}
	public void setApPaterno(String apPaterno) {
		this.apPaterno = apPaterno;
	}
	public String getApMaterno() {
		return apMaterno;
	}
	public void setApMaterno(String apMaterno) {
		this.apMaterno = apMaterno;
	}
	/**
	 * @return the fechaCumplianos
	 */
	public LocalDate getFechaCumplianos() {
		return fechaCumplianos;
	}
	/**
	 * @param fechaCumplianos the fechaCumplianos to set
	 */
	public void setFechaCumplianos(LocalDate fechaCumplianos) {
		this.fechaCumplianos = fechaCumplianos;
	}
	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}
	/**
	 * @param email the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}
	
	public String getTelefono() {
		return telefono;
	}
	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}
	/**
	 * @return the comisiones
	 */
	public String getComisiones() {
		return comisiones;
	}
	/**
	 * @param comisiones the comisiones to set
	 */
	public void setComisiones(String comisiones) {
		this.comisiones = comisiones;
	}
	/**
	 * @return the distrito
	 */
	public String getDistrito() {
		return distrito;
	}
	/**
	 * @param distrito the distrito to set
	 */
	public void setDistrito(String distrito) {
		this.distrito = distrito;
	}
	/**
	 * @return the legislatura
	 */
	public String getLegislatura() {
		return legislatura;
	}
	/**
	 * @param legislatura the legislatura to set
	 */
	public void setLegislatura(String legislatura) {
		this.legislatura = legislatura;
	}
	/**
	 * @return the partido
	 */
	public PoliticalParty getPartido() {
		return partido;
	}
	/**
	 * @param partido the partido to set
	 */
	public void setPartido(PoliticalParty partido) {
		this.partido = partido;
	}
	/**
	 * @return the congreso
	 */
	public Congress getCongreso() {
		return congreso;
	}
	/**
	 * @param congreso the congreso to set
	 */
	public void setCongreso(Congress congreso) {
		this.congreso = congreso;
	}
	/**
	 * @return the foto
	 */
	public Photo getFoto() {
		return foto;
	}
	/**
	 * @param foto the foto to set
	 */
	public void setFoto(Photo foto) {
		this.foto = foto;
	}	
	
	public int getTipoPartner() {
		return tipoPartner;
	}
	public void setTipoPartner(int tipoPartner) {
		this.tipoPartner = tipoPartner;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
	
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Partner [id=" + id + ", sku=" + sku + ", name=" + name + ", apPaterno=" + apPaterno + ", apMaterno="
				+ apMaterno + ", fechaCumplianos=" + fechaCumplianos + ", email=" + email + ", comisiones=" + comisiones
				+ ", distrito=" + distrito + ", legislatura=" + legislatura + ", telefono=" + telefono + ", partido="
				+ partido + ", user=" + user + ", congreso=" + congreso + ", foto=, tipoPartner="
				+ tipoPartner + ", status=" + status + "]";
	}	
	
}
