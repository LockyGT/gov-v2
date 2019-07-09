package com.solucionesdigitales.vote.service.impl.report;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Font.FontFamily;
import com.itextpdf.text.GreekList;
import com.itextpdf.text.List;
import com.itextpdf.text.ListItem;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.RomanList;
import com.itextpdf.text.pdf.PdfWriter;
import com.solucionesdigitales.vote.entity.elementsod.ElementOd;
import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.entity.orderday.ParagraphOD;
import com.solucionesdigitales.vote.repository.orderday.OrderDayRepository;
import com.solucionesdigitales.vote.service.report.ReportOdService;

@Service("reportOdService")
public class ReportOdServiceImpl implements ReportOdService {

	@Autowired
	private OrderDayRepository orderDayRepository;

	@Value("${dir.carpeta.multimedia}")
	private String dirFolder;

	@Override
	public Resource writePdf(String orderdayId) {
		byte[] content = null;
		Path file= null;

		OrderDay orderday = orderDayRepository.findFirstById(orderdayId);
		Document document = new Document(PageSize.LETTER, 85, 85, 135, 135);
		try {

			String FILE_NAME = dirFolder + "/Orden-Del-Día.pdf";
			file = Paths.get(dirFolder,"", "Orden-Del-Día.pdf");
			PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(FILE_NAME));

			HeaderFooterPageEvent event = new HeaderFooterPageEvent();
			writer.setPageEvent(event);
			document.open();
			document.addTitle(orderday.getNombre());

			Font fontitle = new Font();
			fontitle.setStyle(Font.BOLD);
			fontitle.setSize(25);
			fontitle.setFamily(FontFamily.TIMES_ROMAN.toString());

			Font fontElement = new Font();
			fontElement.setStyle(Font.BOLD);
			fontElement.setSize(12);
			fontElement.setFamily(FontFamily.HELVETICA.toString());

			Font paragraphContent = new Font();
			paragraphContent.setFamily(FontFamily.TIMES_ROMAN.toString());
			paragraphContent.setSize(12);

			Font subTitleF = new Font();
			subTitleF.setSize(9);
			subTitleF.setFamily(FontFamily.TIMES_ROMAN.toString());

			// Agregar Parrafos
			Paragraph paragraphTitle = new Paragraph();
			paragraphTitle.add(Chunk.NEWLINE);
			paragraphTitle.add(new Phrase("Orden del Día", fontitle));
			paragraphTitle.setAlignment(Element.ALIGN_CENTER);
			document.add(paragraphTitle);

			Paragraph subTitle = new Paragraph();
			subTitle.add(Chunk.NEWLINE);
			subTitle.add(new Phrase("*PASE DE LISTA DE ASISTENCIA." + "\n", subTitleF));
			subTitle.add(new Phrase("*DECLARATORIA DE QUÓRUM." + "\n\n\n", subTitleF));
			subTitle.setAlignment(Element.ALIGN_JUSTIFIED);
			document.add(subTitle);


			List lista = new List(true);
			ListItem listItem = null;

			List listaParagraph = new GreekList();
			ListItem itemParagraph = null;

			List listaSubP = new RomanList();
			ListItem itemSubP = null;

			for (ElementOd elementOd: orderday.getElementsOd()) {
				if(elementOd.getStatus() == 1) {
					listItem = new ListItem(elementOd.getNombre()  +"\n\n", fontElement);
					listItem.setAlignment(Element.ALIGN_JUSTIFIED);
					listaParagraph = new GreekList();
					
					for(ParagraphOD paragraphOd : elementOd.getParagraphs()) {
						if(paragraphOd.getStatus() == 2) {
							itemParagraph = new ListItem(paragraphOd.getContenidotxt() + "\n\n" , paragraphContent);
							itemParagraph.setAlignment(Element.ALIGN_JUSTIFIED);
							listaSubP = new RomanList();

							for (ParagraphOD subParagraphOd : paragraphOd.getSubParagraphs()) {
								if(subParagraphOd.getStatus() == 2) {
									itemSubP = new ListItem(subParagraphOd.getContenidotxt() + "\n\n",paragraphContent);
									itemSubP.setAlignment(Element.ALIGN_JUSTIFIED);
									listaSubP.add(itemSubP);

								}
							}
							listaParagraph.add(itemParagraph);
							listaParagraph.add(listaSubP);	

						} 
					}
					lista.add(listItem);
					document.add(listItem);
					document.add(listaParagraph);
					document.add(listaSubP);
				}
			}


			document.close();
			final Resource resource = new UrlResource(file.toUri());
			return resource;
		} catch (FileNotFoundException | DocumentException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

}
