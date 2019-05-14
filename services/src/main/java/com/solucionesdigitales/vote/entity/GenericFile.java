package com.solucionesdigitales.vote.entity;

import java.util.ArrayList;

import org.springframework.web.multipart.MultipartFile;

/**
 * 
 * @author israel
 *
 */
public class GenericFile {
	
	private MultipartFile file;
	private ArrayList<MultipartFile> files;
	private String folder;
	private String urlServerFile;
	private String originalName;
	private String serverName;
	private String userId;
	/**
	 * @return the file
	 */
	public MultipartFile getFile() {
		return file;
	}
	/**
	 * @param file the file to set
	 */
	public void setFile(MultipartFile file) {
		this.file = file;
	}
	/**
	 * @return the files
	 */
	public ArrayList<MultipartFile> getFiles() {
		return files;
	}
	/**
	 * @param files the files to set
	 */
	public void setFiles(ArrayList<MultipartFile> files) {
		this.files = files;
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
	 * @return the urlServerFile
	 */
	public String getUrlServerFile() {
		return urlServerFile;
	}
	/**
	 * @param urlServerFile the urlServerFile to set
	 */
	public void setUrlServerFile(String urlServerFile) {
		this.urlServerFile = urlServerFile;
	}
	/**
	 * @return the originalName
	 */
	public String getOriginalName() {
		return originalName;
	}
	/**
	 * @param originalName the originalName to set
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
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "GenericFile [folder=" + folder + ", urlServerFile=" + urlServerFile + ", originalName=" + originalName
				+ ", serverName=" + serverName + ", userId=" + userId + "]";
	}
	
}
