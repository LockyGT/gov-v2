package com.solucionesdigitales.vote.config.security;

import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.ArrayList;
import java.util.Collections;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;

@Configuration
public class SecurityContext {
	private static final Logger logger = LoggerFactory.getLogger(SecurityContext.class);
	@Value("${app.server.security.add}")
	private String add;	
	
	
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
}
