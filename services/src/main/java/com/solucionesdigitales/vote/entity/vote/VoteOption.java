package com.solucionesdigitales.vote.entity.vote;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "vote_options")
public class VoteOption {
	
	@Id 
	private String id;
	private String name;
	private String voteColor;
	private boolean onWinIsApproved;
	
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
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	public String getVoteColor() {
		return voteColor;
	}
	public void setVoteColor(String voteColor) {
		this.voteColor = voteColor;
	}
	public boolean isOnWinIsApproved() {
		return onWinIsApproved;
	}
	public void setOnWinIsApproved(boolean onWinIsApproved) {
		this.onWinIsApproved = onWinIsApproved;
	}
	/* (non-Javadoc)
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		return "VoteOption [id=" + id + ", name=" + name + ", voteColor=" + voteColor + "]";
	}
	
	
}
