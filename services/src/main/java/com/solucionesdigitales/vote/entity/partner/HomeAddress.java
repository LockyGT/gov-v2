package com.solucionesdigitales.vote.entity.partner;

public class HomeAddress {
	private String street;
	private String numberExt;
	private String numberInt;
	private String cp;
	private String colony;
	private String betweenStreets;
	private String state;
	private String municipality;
	/**
	 * @return the street
	 */
	public String getStreet() {
		return street;
	}
	/**
	 * @param street the street to set
	 */
	public void setStreet(String street) {
		this.street = street;
	}
	/**
	 * @return the numberExt
	 */
	public String getNumberExt() {
		return numberExt;
	}
	/**
	 * @param numberExt the numberExt to set
	 */
	public void setNumberExt(String numberExt) {
		this.numberExt = numberExt;
	}
	/**
	 * @return the numberInt
	 */
	public String getNumberInt() {
		return numberInt;
	}
	/**
	 * @param numberInt the numberInt to set
	 */
	public void setNumberInt(String numberInt) {
		this.numberInt = numberInt;
	}
	/**
	 * @return the cp
	 */
	public String getCp() {
		return cp;
	}
	/**
	 * @param cp the cp to set
	 */
	public void setCp(String cp) {
		this.cp = cp;
	}
	/**
	 * @return the colony
	 */
	public String getColony() {
		return colony;
	}
	/**
	 * @param colony the colony to set
	 */
	public void setColony(String colony) {
		this.colony = colony;
	}
	/**
	 * @return the betwennStreets
	 */
	public String getBetweenStreets() {
		return betweenStreets;
	}
	/**
	 * @param betwennStreets the betweenStreets to set
	 */
	public void setBetweenStreets(String betweenStreets) {
		this.betweenStreets = betweenStreets;
	}
	/**
	 * @return the state
	 */
	public String getState() {
		return state;
	}
	/**
	 * @param state the state to set
	 */
	public void setState(String state) {
		this.state = state;
	}
	/**
	 * @return the municipality
	 */
	public String getMunicipality() {
		return municipality;
	}
	/**
	 * @param municipality the municipality to set
	 */
	public void setMunicipality(String municipality) {
		this.municipality = municipality;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "HomeAddress [street=" + street + ", numberExt=" + numberExt + ", numberInt=" + numberInt + ", cp=" + cp
				+ ", colony=" + colony + ", betweenStreets=" + betweenStreets + ", state=" + state + ", municipality="
				+ municipality + "]";
	}
}
