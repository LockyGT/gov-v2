package com.solucionesdigitales.vote.config;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * 
 * @author israel
 *
 */
@Configuration
@EnableScheduling
public class RecycleBinScheduled {

	private static final Logger logger = LoggerFactory.getLogger(RecycleBinScheduled.class);

	@Value("${dir.carpeta.multimedia}")
	private String rootDir;
	
	@Scheduled(cron = "${cron.expression}")
//	@Scheduled(fixedRate = 9000)
	public void taskDeleteFile() {
		try {
			Calendar  currentdate= Calendar.getInstance();
			currentdate.add(Calendar.DAY_OF_YEAR,-14);
			SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyyy");
			logger.info("Buscando archivos para eliminar Fecha--- "+currentdate.getTime().toString()+" ----");
			Date beforeDate = currentdate.getTime();
			
			String dayDate = format.format(beforeDate);
			Files.walk(Paths.get(rootDir + "/Recycle Bin")).forEach(ruta -> {
				if (Files.isRegularFile(ruta)) {
					
					Date when = new Date(ruta.toFile().lastModified());
					String dateFile = format.format(when);
					
					try {
						Date fecha1 = format.parse(dayDate);
						Date fecha2 = format.parse(dateFile);
						if(fecha1.after(fecha2)) {
							ruta.toFile().delete();
							logger.info("---- Archivo eliminado: "+ruta.toFile().getName()+" ----");
						}
					} catch (ParseException e) {
						logger.error("ERROR: al realizar el parce de fechas: \n"+e.getMessage());
					}
					
				}
			});
		} catch (IOException e) {
			logger.error("ERROR: Al recorrer los archivos de la carpeta 'Recycle Bin': \n"+e.getMessage());
		} 
	}
}
