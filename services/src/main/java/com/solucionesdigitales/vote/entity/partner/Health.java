package com.solucionesdigitales.vote.entity.partner;

public class Health {
	private String allergies;
	private String bloodType;
	private String diseases;
	/**
	 * @return the allergies
	 */
	public String getAllergies() {
		return allergies;
	}
	/**
	 * @param allergies the allergies to set
	 */
	public void setAllergies(String allergies) {
		this.allergies = allergies;
	}
	/**
	 * @return the bloodType
	 */
	public String getBloodType() {
		return bloodType;
	}
	/**
	 * @param bloodType the bloodType to set
	 */
	public void setBloodType(String bloodType) {
		this.bloodType = bloodType;
	}
	/**
	 * @return the diseases
	 */
	public String getDiseases() {
		return diseases;
	}
	/**
	 * @param diseases the diseases to set
	 */
	public void setDiseases(String diseases) {
		this.diseases = diseases;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Health [allergies=" + allergies + ", bloodType=" + bloodType + ", diseases=" + diseases + "]";
	}
}
