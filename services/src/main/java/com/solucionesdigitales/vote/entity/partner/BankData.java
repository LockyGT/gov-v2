package com.solucionesdigitales.vote.entity.partner;

public class BankData {
	private String bank;
	private String numberAccount;
	private String numberKey;
	/**
	 * @return the bank
	 */
	public String getBank() {
		return bank;
	}
	/**
	 * @param bank the bank to set
	 */
	public void setBank(String bank) {
		this.bank = bank;
	}
	/**
	 * @return the numberAccount
	 */
	public String getNumberAccount() {
		return numberAccount;
	}
	/**
	 * @param numberAccount the numberAccount to set
	 */
	public void setNumberAccount(String numberAccount) {
		this.numberAccount = numberAccount;
	}
	/**
	 * @return the numberKey
	 */
	public String getNumberKey() {
		return numberKey;
	}
	/**
	 * @param numberKey the numberKey to set
	 */
	public void setNumberKey(String numberKey) {
		this.numberKey = numberKey;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "BankData [bank=" + bank + ", numberAccount=" + numberAccount + ", numberKey=" + numberKey + "]";
	}
}
