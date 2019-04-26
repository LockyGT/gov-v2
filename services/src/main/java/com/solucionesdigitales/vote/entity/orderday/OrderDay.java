package com.solucionesdigitales.vote.entity.orderday;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "orderday")
public class OrderDay {
	
	@Id
	private String id;
	private String version;
	
	/*idGaceta
	@DBRef*/
	private String gaceta;

	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getGaceta() {
		return gaceta;
	}

	public void setGaceta(String gaceta) {
		this.gaceta = gaceta;
	}
	
	
	@Override
	public String toString() {
		return "OrderDay [id=" + id + ", version" + version + ", gaceta" + gaceta + "]";
		
		
	}
	
	

}
 