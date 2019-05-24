package com.solucionesdigitales.vote.entity.documentfile;

import java.util.Date;

public class File {
	
	private String id;
	private String userId;
	private String originalName;
	private String serverName;
	private String folder;
	private long size;
	private Date lastModification;
	private String extention;
	private String mimeType;
	private Date date;
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
	 * @return the userId
	 */
	public String getUserId() {
		return userId;
	}
	/**
	 * @param userId the userId to set
	 */
	public void setUserId(String userId) {
		this.userId = userId;
	}
	/**
	 * @return the originalName
	 */
	public String getOriginalName() {
		return originalName;
	}
	/**
	 * @param originalName the orginalName to set
	 */
	public void setOriginalName(String originalName) {
		this.originalName = originalName;
	}
	/**
	 * @return the serverName
	 */
	public String getServerName() {
		return serverName;
	}
	/**
	 * @param serverName the serverName to set
	 */
	public void setServerName(String serverName) {
		this.serverName = serverName;
	}
	/**
	 * @return the folder
	 */
	public String getFolder() {
		return folder;
	}
	/**
	 * @param folder the folder to set
	 */
	public void setFolder(String folder) {
		this.folder = folder;
	}
	/**
	 * @return the size
	 */
	public long getSize() {
		return size;
	}
	/**
	 * @param size the size to set
	 */
	public void setSize(long size) {
		this.size = size;
	}
	/**
	 * @return the lastModification
	 */
	public Date getLastModification() {
		return lastModification;
	}
	/**
	 * @param lastModification the lastModification to set
	 */
	public void setLastModification(Date lastModification) {
		this.lastModification = lastModification;
	}
	/**
	 * @return the extention
	 */
	public String getExtention() {
		return extention;
	}
	/**
	 * @param extention the extention to set
	 */
	public void setExtention(String extention) {
		this.extention = extention;
	}
	/**
	 * @return the mimeTipe
	 */
	public String getMimeType() {
		return mimeType;
	}
	/**
	 * @param mimeTipe the mimeTipe to set
	 */
	public void setMimeType(String mimeType) {
		this.mimeType = mimeType;
	}
	/**
	 * @return the date
	 */
	public Date getDate() {
		return date;
	}
	/**
	 * @param date the date to set
	 */
	public void setDate(Date date) {
		this.date = date;
	}
	/**
	 * @return the status
	 */
	public int getStatus() {
		return status;
	}
	/**
	 * @param status the status to set
	 */
	public void setStatus(int status) {
		this.status = status;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "File [id=" + id + ", originalName=" + originalName + ", serverName=" + serverName + ", size=" + size
				+ ", lastModification=" + lastModification + ", extention=" + extention + ", mimeTipe=" + mimeType
				+ ", status=" + status + "]";
	}
}
