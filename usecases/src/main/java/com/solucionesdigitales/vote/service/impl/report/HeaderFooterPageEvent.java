package com.solucionesdigitales.vote.service.impl.report;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.ExceptionConverter;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.Image;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfGState;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfWriter;

public class HeaderFooterPageEvent extends PdfPageEventHelper {

	private Image imagen;
	PdfPTable table = new PdfPTable(2);
	private String page;
	private Image waterMarkImage;
	

	/**
	 * Constructor de la clase, inicializa la imagen que se utilizara en el membrete
	 * @return 
	 */

	public  HeaderFooterPageEvent(String dirFolder)
	{
		try
		{
			waterMarkImage = Image.getInstance(dirFolder+"/img-pdf/logo-g.png");

			imagen = Image.getInstance(dirFolder+"/img-pdf/congreso-guerrero.png");
			imagen.scalePercent(20f);
			imagen.setAbsolutePosition(30f, 680f);
			imagen.setAlignment(Element.ALIGN_LEFT);
			table.setTotalWidth(350f);  


		}catch(Exception r)
		{
			System.err.println("Error al leer la imagen");
			System.out.print("Error: "+r.getMessage());
		}  

	}
	/**
	 * Manejador del evento onEndPage, usado para generar el encabezado
	 */
	public void onStartPage(PdfWriter writer, Document document) {

		try{    
			document.add(imagen);
			table.writeSelectedRows(0, -1, 140f, 700f, writer.getDirectContent());

		}catch(Exception doc)
		{
			doc.printStackTrace();
		} 


	}

	public void onEndPage(PdfWriter pdfwriter, Document document) {
		PdfPTable tables = new PdfPTable(3);

		try {

			PdfContentByte canvas = pdfwriter.getDirectContentUnder();
			//Image image = Image.getInstance(waterMarkImage);
			waterMarkImage.scalePercent(70f);
			waterMarkImage.setAbsolutePosition(260f, 55f);
			waterMarkImage.setAlignment(Element.ALIGN_RIGHT);
			canvas.saveState();
			PdfGState state = new PdfGState();
			state.setFillOpacity(20.0f);
			canvas.setGState(state);
			canvas.addImage(waterMarkImage);
			canvas.restoreState();


			// Se determina el ancho y altura de la tabla 
			tables.setWidths(new int[]{24, 24, 2});
			tables.setTotalWidth(527);
			tables.setLockedWidth(true);
			tables.getDefaultCell().setFixedHeight(50);

			// Borde de la celda
			tables.getDefaultCell().setBorder(Rectangle.BOTTOM);

			tables.addCell(page);
			tables.getDefaultCell().setHorizontalAlignment(Element.ALIGN_RIGHT);

			// table.addCell(String.format(“Pagina %010d de”, writer.getPageNumber()));

			PdfPCell cell = new PdfPCell();
			cell.setBorder(Rectangle.BOTTOM);
			tables.addCell(cell);
			// Esta linea escribe la tabla como encabezado
			tables.writeSelectedRows(0, -1, 34, 803, pdfwriter.getDirectContent());
			
		}
		catch(DocumentException de) {

			throw new ExceptionConverter(de);
		}
		
		Font endpage = new Font();
		endpage.setSize(7);
		endpage.setStyle(Font.BOLD);
		endpage.setFamily(FontFamily.TIMES_ROMAN.toString());

		ColumnText.showTextAligned(pdfwriter.getDirectContent(), Element.ALIGN_LEFT, new Phrase("TRÉBOL SUR 'SENTIMIENTOS DE LA NACIÓN' S/N",endpage), 397, 50, 0);
		ColumnText.showTextAligned(pdfwriter.getDirectContent(), Element.ALIGN_LEFT, new Phrase("COL. VILLA MODERNA C.P.39074",endpage), 457, 40, 0);
		ColumnText.showTextAligned(pdfwriter.getDirectContent(), Element.ALIGN_LEFT, new Phrase("CHILPANCINGO DE LOS BRAVOS, GUERRERO, MÉXICO",endpage), 380, 30, 0);
		ColumnText.showTextAligned(pdfwriter.getDirectContent(), Element.ALIGN_LEFT, new Phrase("TELEFONO: 01-747-471-84-00",endpage), 470, 20, 0);

		ColumnText.showTextAligned(pdfwriter.getDirectContent(), Element.ALIGN_CENTER, new Phrase(" " + document.getPageNumber()), 300, 20, 0);

	
	}

}

