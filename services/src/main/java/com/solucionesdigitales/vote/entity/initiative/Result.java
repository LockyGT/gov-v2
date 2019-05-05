package com.solucionesdigitales.vote.entity.initiative;

public class Result {

	private String resultName;
	private Formula formula;
	private int totalAFavor;
	private int totalEnContra;
	private int totalAbstencion;
	private int totalNoVoto;
	private int totalAusente;
	private int indefinido;
	private int presentes;
	private RoundMethod roundMethod;
	
	public String getResultName() {
		return resultName;
	}
	public void setResultName(String resultName) {
		this.resultName = resultName;
	}
	public Formula getFormula() {
		return formula;
	}
	public void setFormula(Formula formula) {
		this.formula = formula;
	}
	/**
	 * @return the totalAFavor
	 */
	public int getTotalAFavor() {
		return totalAFavor;
	}
	/**
	 * @param totalAFavor the totalAFavor to set
	 */
	public void setTotalAFavor(int totalAFavor) {
		this.totalAFavor = totalAFavor;
	}
	/**
	 * @return the totalEnContra
	 */
	public int getTotalEnContra() {
		return totalEnContra;
	}
	/**
	 * @param totalEnContra the totalEnContra to set
	 */
	public void setTotalEnContra(int totalEnContra) {
		this.totalEnContra = totalEnContra;
	}
	/**
	 * @return the totalAbstencion
	 */
	public int getTotalAbstencion() {
		return totalAbstencion;
	}
	/**
	 * @param totalAbstencion the totalAbstencion to set
	 */
	public void setTotalAbstencion(int totalAbstencion) {
		this.totalAbstencion = totalAbstencion;
	}
	/**
	 * @return the totalNoVoto
	 */
	public int getTotalNoVoto() {
		return totalNoVoto;
	}
	/**
	 * @param totalNoVoto the totalNoVoto to set
	 */
	public void setTotalNoVoto(int totalNoVoto) {
		this.totalNoVoto = totalNoVoto;
	}
	/**
	 * @return the totalAusente
	 */
	public int getTotalAusente() {
		return totalAusente;
	}
	/**
	 * @param totalAusente the totalAusente to set
	 */
	public void setTotalAusente(int totalAusente) {
		this.totalAusente = totalAusente;
	}
	public int getIndefinido() {
		return indefinido;
	}
	public void setIndefinido(int indefinido) {
		this.indefinido = indefinido;
	}
	public int getPresentes() {
		return presentes;
	}
	public void setPresentes(int presentes) {
		this.presentes = presentes;
	}
	public RoundMethod getRoundMethod() {
		return roundMethod;
	}
	public void setRoundMethod(RoundMethod roundMethod) {
		this.roundMethod = roundMethod;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Result [resultName=" + resultName + ", formula=" + formula + ", totalAFavor=" + totalAFavor
				+ ", totalEnContra=" + totalEnContra + ", totalAbstencion=" + totalAbstencion + ", totalNoVoto="
				+ totalNoVoto + ", totalAusente=" + totalAusente + "]";
	}
}
