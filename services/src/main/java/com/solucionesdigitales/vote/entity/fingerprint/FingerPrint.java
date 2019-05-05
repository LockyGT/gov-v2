package com.solucionesdigitales.vote.entity.fingerprint;

import java.util.Arrays;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "finger_prints")
public class FingerPrint {
	
	@Id 
	private String id;
	private int fingerIndex;
	private byte[] template;
	private String templateSt;
	private String filePath;
	private int status;

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
	 * @return the fingerIndex
	 */
	public int getFingerIndex() {
		return fingerIndex;
	}

	/**
	 * @param fingerIndex the fingerIndex to set
	 */
	public void setFingerIndex(int fingerIndex) {
		this.fingerIndex = fingerIndex;
	}

	/**
	 * @return the template
	 */
	public byte[] getTemplate() {
		return template;
	}

	/**
	 * @param template the template to set
	 */
	public void setTemplate(byte[] template) {
		this.template = template;
	}

	public String getTemplateSt() {
		return templateSt;
	}

	public void setTemplateSt(String templateSt) {
		this.templateSt = templateSt;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "FingerPrint [id=" + id + ", fingerIndex=" + fingerIndex + ", template=" + Arrays.toString(template)
				+ ", filePath=" + filePath + ", status=" + status + "]";
	}	
}
