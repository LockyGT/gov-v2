package com.solucionesdigitales.vote.entity.partner;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.DBRef;

public class ContractData {

	private String contractType;
	private String job;
	private String boss;
	private String organ;
	@DBRef
	private FolderAdministrator area;
	private Date startDate;
	private Date endDate;
	/**
	 * @return the coontractType
	 */
	public String getContractType() {
		return contractType;
	}
	/**
	 * @param coontractType the coontractType to set
	 */
	public void setContractType(String coontractType) {
		this.contractType = coontractType;
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
	 * @return the area
	 */
	public FolderAdministrator getArea() {
		return area;
	}
	/**
	 * @param area the area to set
	 */
	public void setArea(FolderAdministrator area) {
		this.area = area;
	}
	/**
	 * @return the organ
	 */
	public String getOrgan() {
		return organ;
	}
	/**
	 * @param organ the organ to set
	 */
	public void setOrgan(String organ) {
		this.organ = organ;
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
		return "ContractData [contractType=" + contractType + ", job=" + job + ", boss=" + boss + ", area=" + area
				+ ", startDate=" + startDate + ", endDate=" + endDate + "]";
	}
}
