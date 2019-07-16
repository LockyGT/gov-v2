package com.solucionesdigitales.vote.entity.orderday;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.solucionesdigitales.vote.entity.documentfile.Attached;

@Document(collection = "orderday")
public class OrderDay {
	
	@Id
	private String id;
	private String nombre;
	//version
	private int sku;
	private int status;
	private Date fecha;
	private String odOriginal;
	private String referencia;
	private boolean isPublished;
	private boolean isApproved;
	//private ArrayList<ElementOd> elementsOd;
	
	private ArrayList<ElementParagraph> elementParagraph;

	private Attached attached;
	
	
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public int getSku() {
		return sku;
	}

	public void setSku(int sku) {
		this.sku = sku;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}
	public String getOdOriginal() {
		return odOriginal;
	}

	public void setOdOriginal(String odOriginal) {
		this.odOriginal = odOriginal;
	}
	public String getReferencia() {
		return referencia;
	}
	public void setReferencia(String referencia) {
		this.referencia = referencia;
	}
	public Date getFecha() {
		return fecha;
	}

	public void setFecha(Date fecha) {
		this.fecha = fecha;
	}
	
	/**
	 * @return the attached
	 */
	public Attached getAttached() {
		return attached;
	}

	/**
	 * @param attached the attached to set
	 */
	public void setAttached(Attached attached) {
		this.attached = attached;
	}

	public boolean isPublished() {
		return isPublished;
	}

	public void setPublished(boolean isPublished) {
		this.isPublished = isPublished;
	}
	public boolean isApproved() {
		return isApproved;
	}

	public void setApproved(boolean isApproved) {
		this.isApproved = isApproved;
	}

	public ArrayList<ElementParagraph> getElementParagraph() {
		return elementParagraph;
	}

	public void setElementParagraph(ArrayList<ElementParagraph> elementParagraph) {
		this.elementParagraph = elementParagraph;
	}

	@Override
	public String toString() {
		return "OrderDay [id=" + id + ", nombre=" + nombre + ", sku=" + sku + ", status=" + status + ", fecha=" + fecha
				+ ", odOriginal=" + odOriginal + ", referencia=" + referencia + ", isPublished=" + isPublished
				+ ", isApproved=" + isApproved + ", elementParagraph=" + elementParagraph + ", attached=" + attached
				+ "]";
	}
	
}
 