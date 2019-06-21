package com.solucionesdigitales.vote.entity.partner;

public class Studies {
	private String lastGrade;
	private String complementaryStudies;
	private String complementaryStudiesOther;
	private String career;
    private String professionalLicense;
	/**
	 * @return the lastGrade
	 */
	public String getLastGrade() {
		return lastGrade;
	}
	/**
	 * @param lastGrade the lastGrade to set
	 */
	public void setLastGrade(String lastGrade) {
		this.lastGrade = lastGrade;
	}
	/**
	 * @return the complementaryStudies
	 */
	public String getComplementaryStudies() {
		return complementaryStudies;
	}
	/**
	 * @param complementaryStudies the complementaryStudies to set
	 */
	public void setComplementaryStudies(String complementaryStudies) {
		this.complementaryStudies = complementaryStudies;
	}
	/**
	 * @return the complementaryStudiesOther
	 */
	public String getComplementaryStudiesOther() {
		return complementaryStudiesOther;
	}
	/**
	 * @param complementaryStudiesOther the complementaryStudiesOther to set
	 */
	public void setComplementaryStudiesOther(String complementaryStudiesOther) {
		this.complementaryStudiesOther = complementaryStudiesOther;
	}
	/**
	 * @return the career
	 */
	public String getCareer() {
		return career;
	}
	/**
	 * @param career the career to set
	 */
	public void setCareer(String career) {
		this.career = career;
	}
	/**
	 * @return the professionalLicense
	 */
	public String getProfessionalLicense() {
		return professionalLicense;
	}
	/**
	 * @param professionalLicense the professionalLicense to set
	 */
	public void setProfessionalLicense(String professionalLicense) {
		this.professionalLicense = professionalLicense;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Studies [lastGrade=" + lastGrade + ", complementaryStudies=" + complementaryStudies + ", career="
				+ career + ", professionalLicense=" + professionalLicense + "]";
	}
}
