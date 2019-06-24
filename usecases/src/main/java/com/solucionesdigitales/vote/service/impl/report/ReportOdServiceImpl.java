package com.solucionesdigitales.vote.service.impl.report;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfWriter;
import com.solucionesdigitales.vote.entity.elementsod.ElementOd;
import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.entity.orderday.ParagraphOD;
import com.solucionesdigitales.vote.repository.elementsod.ElementsOdRepository;
import com.solucionesdigitales.vote.repository.orderday.OrderDayRepository;
import com.solucionesdigitales.vote.service.report.ReportOdService;

@Service("reportOdService")
public class ReportOdServiceImpl implements ReportOdService {

	@Autowired
	private OrderDayRepository orderDayRepository;

	@Value("${dir.carpeta.multimedia}")
	private String dirFolder;

	@Override
	public byte[] writePdf(String orderdayId) {
		byte[] content = null;

		OrderDay orderday = orderDayRepository.findFirstById(orderdayId);

		Document document = new Document();
		try {

			String FILE_NAME = dirFolder + "/orderday.pdf";
			PdfWriter.getInstance(document, new FileOutputStream(new File(FILE_NAME)));

			document.open();
			document.addTitle(orderday.getNombre());

			Image image = Image.getInstance("http://congresogro.gob.mx/62/img/congreso-guerrero.png");
			image.scalePercent(10f);
			image.setAlignment(Element.ALIGN_LEFT);
			document.add(image);

			Paragraph paragraphTitle = new Paragraph();

			paragraphTitle.add("Orden del Día");
			paragraphTitle.setAlignment(Element.ALIGN_JUSTIFIED);
			document.add(paragraphTitle);


			Paragraph paragraphLorem = new Paragraph();
			
			// Agregar saltos de linea
			paragraphLorem.add(new Phrase(Chunk.NEWLINE));

			for (ElementOd elementOd: orderday.getElementsOd()) {
				paragraphLorem.add(new Phrase(elementOd.getNombre()));
				paragraphLorem.add(new Phrase(Chunk.NEWLINE));

				for(ParagraphOD paragraphOd : elementOd.getParagraphs()) {
					
					paragraphLorem.add(new Phrase(paragraphOd.getContenidotxt()));
					paragraphLorem.add(new Phrase(Chunk.NEWLINE));

					for (ParagraphOD subParagraphOd : paragraphOd.getSubParagraphs()) {
						
						paragraphLorem.add(new Phrase(subParagraphOd.getContenidotxt()));
						paragraphLorem.add(new Phrase(Chunk.NEWLINE));
					}

				}

			}


			java.util.List<Element> paragraphList = new ArrayList<>();

			//paragraphList = paragraphLorem.breakUp();

			Font f = new Font();
			f.setFamily(FontFamily.COURIER.name());
			f.setStyle(Font.BOLDITALIC);
			f.setSize(8);

			Paragraph p3 = new Paragraph();
			p3.setFont(f);
			p3.addAll(paragraphList);
			p3.add("TEST LOREM IPSUM DOLOR SIT AMET CONSECTETUR ADIPISCING ELIT!");

			//byte[] bytes = new byte[1024];
			document.add(paragraphLorem);
			document.add(p3);
			document.close();

		} catch (FileNotFoundException | DocumentException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return content;
	}


}
