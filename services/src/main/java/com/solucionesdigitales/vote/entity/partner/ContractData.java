package com.solucionesdigitales.vote.entity.partner;

import java.util.Date;

public class ContractData {

	private String coontractType;
	private String job;
	private String boss;
	private Date startDate;
	private Date endDate;
	/**
	 * @return the coontractType
	 */
	public String getCoontractType() {
		return coontractType;
	}
	/**
	 * @param coontractType the coontractType to set
	 */
	public void setCoontractType(String coontractType) {
		this.coontractType = coontractType;
	}
	
	/**
	 * @return the job
	 */
	public String getJob() {
		return job;
	}
	/**
	 * @param job the job to set
	 */
	public void setJob(String job) {
		this.job = job;
	}
	/**
	 * @return the boss
	 */
	public String getBoss() {
		return boss;
	}
	/**
	 * @param boss the boss to set
	 */
	public void setBoss(String boss) {
		this.boss = boss;
	}
	/**
	 * @return the startDate
	 */
	public Date getStartDate() {
		return startDate;
	}
	/**
	 * @param startDate the startDate to set
	 */
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	/**
	 * @return the endDate
	 */
	public Date getEndDate() {
		return endDate;
	}
	/**
	 * @param endDate the endDate to set
	 */
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "ContractData [coontractType=" + coontractType + ", startDate=" + startDate + ", endDate=" + endDate
				+ "]";
	}
}
