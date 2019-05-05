package com.solucionesdigitales.vote.entity.user;

import java.util.Arrays;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
	@Id 
	private String id;
	private String username;
	private byte[] passwordByte;
	private String password;
	private boolean isPasswordEnabled;
	private int status;
	@DBRef
	private Rol userRol;
	
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
	 * @return the username
	 */
	public String getUsername() {
		return username;
	}
	/**
	 * @param username the username to set
	 */
	public void setUsername(String username) {
		this.username = username;
	}
	
	/**
	 * @return the isPasswordEnabled
	 */
	public boolean isPasswordEnabled() {
		return isPasswordEnabled;
	}
	/**
	 * @param isPasswordEnabled the isPasswordEnabled to set
	 */
	public void setPasswordEnabled(boolean isPasswordEnabled) {
		this.isPasswordEnabled = isPasswordEnabled;
	}
	/**
	 * @return the status
	 */
	public int getStatus() {
		return status;
	}
	/**
	 * @param status the status to set
	 */
	public void setStatus(int status) {
		this.status = status;
	}
	/**
	 * @return the userRol
	 */
	public Rol getUserRol() {
		return userRol;
	}
	/**
	 * @param userRol the userRol to set
	 */
	public void setUserRol(Rol userRol) {
		this.userRol = userRol;
	}
	/**
	 * @return the passwordByte
	 */
	public byte[] getPasswordByte() {
		return passwordByte;
	}
	/**
	 * @param passwordByte the passwordByte to set
	 */
	public void setPasswordByte(byte[] passwordByte) {
		this.passwordByte = passwordByte;
	}
	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}
	/**
	 * @param password the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "User [id=" + id + ", username=" + username + ", passwordByte=" + Arrays.toString(passwordByte)
				+ ", isPasswordEnabled=" + isPasswordEnabled + ", status=" + status
				+ ", userRol=" + userRol + "]";
	}
	
	

}
