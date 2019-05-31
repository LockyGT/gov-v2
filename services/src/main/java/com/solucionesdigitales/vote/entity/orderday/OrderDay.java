package com.solucionesdigitales.vote.entity.orderday;

import java.time.LocalDate;
import java.util.ArrayList;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.solucionesdigitales.vote.entity.documentfile.Attached;
import com.solucionesdigitales.vote.entity.elementsod.ElementOd;

@Document(collection = "orderday")
public class OrderDay {
	
	@Id
	private String id;
	private String nombre;
	//version
	private int sku;
	private int status;
	private LocalDate fecha;
	private String odOriginal;
	private String referencia;
	private boolean isPublished;
	//private ArrayList<ParagraphOD> paragraphs;
	
	private ArrayList<ElementOd> elementsOd;
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
	
//	public ArrayList<ParagraphOD> getParagraphs() {
//		return paragraphs;
//	}
//	public void setParagraphs(ArrayList<ParagraphOD> paragraphs) {
//		this.paragraphs = paragraphs;
//	}
	
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
	public LocalDate getFecha() {
		return fecha;
	}

	public void setFecha(LocalDate fecha) {
		this.fecha = fecha;
	}
	public ArrayList<ElementOd> getElementsOd() {
		return elementsOd;
	}

	public void setElementsOd(ArrayList<ElementOd> elementsOd) {
		this.elementsOd = elementsOd;
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

	@Override
	public String toString() {
		return "OrderDay [id=" + id + ", nombre=" + nombre + ", sku=" + sku + ", status=" + status + ", fecha=" + fecha
				+ ", odOriginal=" + odOriginal + ", referencia=" + referencia + "]";
	}
}
 