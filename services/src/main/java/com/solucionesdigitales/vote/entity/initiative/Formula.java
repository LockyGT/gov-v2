package com.solucionesdigitales.vote.entity.initiative;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "result_formulas")
public class Formula {
	@Id 
	private String id;
	private String formulaName;
	private String formulaDescription;
	private String formulaExpression;
	
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
	 * @return the formulaName
	 */
	public String getFormulaName() {
		return formulaName;
	}

	/**
	 * @param formulaName the formulaName to set
	 */
	public void setFormulaName(String formulaName) {
		this.formulaName = formulaName;
	}

	/**
	 * @return the formulaExpression
	 */
	public String getFormulaExpression() {
		return formulaExpression;
	}

	/**
	 * @param formulaExpression the formulaExpression to set
	 */
	public void setFormulaExpression(String formulaExpression) {
		this.formulaExpression = formulaExpression;
	}

	public String getFormulaDescription() {
		return formulaDescription;
	}

	public void setFormulaDescription(String formulaDescription) {
		this.formulaDescription = formulaDescription;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "Formula [id=" + id + ", formulaName=" + formulaName + ", formulaExpression=" + formulaExpression + "]";
	}	
	
}
