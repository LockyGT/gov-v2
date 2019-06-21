package com.solucionesdigitales.vote.entity.partner;

public class Section {
	private HomeAddress homeAddress;
	private LaborAddress laborAddress;
	private Studies studies;
	private Health health;
	private Contact contact;
	private BankData bankData;
	private ContractData contractData;
	/**
	 * @return the homeAddress
	 */
	public HomeAddress getHomeAddress() {
		return homeAddress;
	}
	/**
	 * @param homeAddress the homeAddress to set
	 */
	public void setHomeAddress(HomeAddress homeAddress) {
		this.homeAddress = homeAddress;
	}
	/**
	 * @return the laborAddress
	 */
	public LaborAddress getLaborAddress() {
		return laborAddress;
	}
	/**
	 * @param laborAddress the laborAddress to set
	 */
	public void setLaborAddress(LaborAddress laborAddress) {
		this.laborAddress = laborAddress;
	}
	/**
	 * @return the studies
	 */
	public Studies getStudies() {
		return studies;
	}
	/**
	 * @param studies the studies to set
	 */
	public void setStudies(Studies studies) {
		this.studies = studies;
	}
	/**
	 * @return the health
	 */
	public Health getHealth() {
		return health;
	}
	/**
	 * @param health the health to set
	 */
	public void setHealth(Health health) {
		this.health = health;
	}
	/**
	 * @return the contact
	 */
	public Contact getContact() {
		return contact;
	}
	/**
	 * @param contact the contact to set
	 */
	public void setContact(Contact contact) {
		this.contact = contact;
	}
	/**
	 * @return the bankData
	 */
	public BankData getBankData() {
		return bankData;
	}
	/**
	 * @param bankData the bankData to set
	 */
	public void setBankData(BankData bankData) {
		this.bankData = bankData;
	}
	/**
	 * @return the contractData
	 */
	public ContractData getContractData() {
		return contractData;
	}
	/**
	 * @param contractData the contractData to set
	 */
	public void setContractData(ContractData contractData) {
		this.contractData = contractData;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Section [homeAddress=" + homeAddress + ", laborAddress=" + laborAddress + ", studies=" + studies
				+ ", health=" + health + ", contact=" + contact + ", bankData=" + bankData + ", contractData="
				+ contractData + "]";
	}
}
