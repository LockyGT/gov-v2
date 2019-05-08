package com.solucionesdigitales.vote.config.security;

import java.io.File;
import java.io.IOException;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import com.solucionesdigitales.vote.entity.archive.Archive;
import com.solucionesdigitales.vote.service.module.archive.ArchiveService;

@Configuration
@EnableScheduling
public class SecurityContext {
	private static final Logger logger = LoggerFactory.getLogger(SecurityContext.class);
	@Value("${app.server.security.add}")
	private String add;	
	
	@Autowired
	private ArchiveService archiveService;
	
	@EventListener(ApplicationReadyEvent.class)
	public void validate() throws SocketException {
	    
	    int i=0;
		ArrayList<NetworkInterface> list = Collections.list(NetworkInterface.getNetworkInterfaces() );
		if(list != null && list.size() > 0) {
			String[] macs = new String[list.size()];
			for ( NetworkInterface ni :  list) {
				byte[] adr = ni.getHardwareAddress();

				if ( adr == null || adr.length != 6 )
					continue;
				String mac = String.format( "%02X:%02X:%02X:%02X:%02X:%02X",
						adr[0], adr[1], adr[2], adr[3], adr[4], adr[5] );
				//logger.info("MAC ADDRESS["+mac+"]");
				macs[i] = mac;
				i++;
			}
			//logger.info("MAC ADDRESS 0["+macs[0]+"]");

			

			
			//logger.info("MAC ADDRESS compare ["+add+"]");

			boolean allowed = false;
			if(macs != null && macs.length > 0){
				for(String m : macs) {
					if(m != null && !m.isEmpty()) {
						//logger.info("MAC ADDRESS for["+m+"]");
						if(m.equals(add)) {
							allowed = true;
							break;
						}else {
							allowed = false;
						}
					}else {
						allowed = false;
					}
				}
				if(allowed) {
					logger.info("allowed");
				}else {
					logger.error("NOT ALLOWED");
					System.exit(0);
				}
				//TODO
			}else {
				logger.error("NOT ALLOWED");
				System.exit(0);
			}
		}
	}
	
	@Scheduled(fixedRate = 80000)
	public void taskDeleteFile() {
		logger.info("Buscando archivos para eliminar");
		List<Archive> listArchives =archiveService.fetchByDeleteDate(new Date()); 
		try {
			int count = 1;
			for (Archive archive : listArchives) {
				logger.info("Encontrado un archivo para eliminar: "+count);
				Files.walk(Paths.get("/home/israel/server/gazzete")).forEach(ruta-> {
				    if (Files.isRegularFile(ruta)) {
				    	if(ruta.getFileName().toString().equals(archive.getUrlArchivo())){
					    	logger.info("Eliminando archivo: -----"+ ruta.getFileName().toString()+"-----");
					    	if(ruta.toFile().delete()) {
					    		logger.info("Archivo eliminado"+ ruta);
					    	}
				    	}

				    	
				    }
				});
				count++;
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	    
		
}
