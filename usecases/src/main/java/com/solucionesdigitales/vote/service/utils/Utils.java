package com.solucionesdigitales.vote.service.utils;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.imageio.ImageIO;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.solucionesdigitales.vote.entity.initiative.Formula;
import com.solucionesdigitales.vote.entity.initiative.Initiative;
import com.solucionesdigitales.vote.entity.initiative.InitiativeHasPartner;
import com.solucionesdigitales.vote.entity.initiative.Result;
import com.solucionesdigitales.vote.entity.partner.PartnerHasVote;
import com.solucionesdigitales.vote.service.initiative.InitiativeHasPartnerService;

@Component
public class Utils {

	private static final Logger logger = LoggerFactory.getLogger(Utils.class);

	@Value("${dir.carpeta.multimedia: /temp}")
	private String location ;

	@Autowired
	InitiativeHasPartnerService initiativeHasPartnerService;

	public String saveImageFromBase64(String str64, String nombreImg,String subdir) {
		String  path = ""; 
		String base64String = str64;
		if(base64String != null && base64String.length() > 0){
			String[] strings = base64String.split(",");
			if(strings != null && strings.length > 0) {
				if(strings[0] != null) {
					String extension;
					switch (strings[0]) {//check image's extension
					case "data:image/jpeg;base64":
						extension = "jpeg";
						break;
					case "data:image/png;base64":
						extension = "png";
						break;
					default://should write cases for more images types
						extension = "jpg";
						break;
					}
					if(strings.length > 1) {
						if(strings[1] != null) {
							// create a buffered image
							BufferedImage image = null;
							byte[] imageByte;
							imageByte = Base64.getDecoder().decode(new String(strings[1]).getBytes());
							ByteArrayInputStream bis = new ByteArrayInputStream(imageByte);
							try {
								image = ImageIO.read(bis);
							} catch (IOException e1) {
								// TODO Auto-generated catch block
								e1.printStackTrace();
							}finally {
								try {
									bis.close();
								} catch (IOException e1) {
									// TODO Auto-generated catch block
									e1.printStackTrace();
								}
							}
							// write the image to a file
							String home = location;//System.getProperty("user.home");
							path = home +File.separator +subdir + File.separator ;
							if (!new File(path).exists() ){
								new File(path).mkdirs();
							}
							path = path  +nombreImg +"."+ extension;
							System.out.println(path);
							File outputfile = new File(path);
							try {
								ImageIO.write(image, extension, outputfile);
								//				 entity.setLogo(path);
							} catch (IOException e1) {
								// TODO Auto-generated catch block
								e1.printStackTrace();
							}
						}else {
							logger.error("cant get img part of string splitted due to null data");
						}
					}else {
						logger.error("cant get img part of string splitted");
					}
				}else {
					logger.debug("can determine extension of base64string img due to missing string part after split");
				}								
			}else {
				logger.error("no data found after split of base 64 string");
			}			
		}else {
			logger.error("no data to split in base 64 string");
		}
		return path;
	}

	public String encodeImgToBase64(String filePath) {
		String encodedfile = "", imgBase64 = "" ;
		try {
			File _imgLogoPartido = new File(filePath);
			if (_imgLogoPartido.exists()) {
				FileInputStream fileInputStreamReader = new FileInputStream(_imgLogoPartido);
				byte[] bytes = new byte[(int)_imgLogoPartido.length()];
				fileInputStreamReader.read(bytes);
				encodedfile = new String(Base64.getEncoder().encode(bytes), "UTF-8");
				imgBase64 = "data:image/"+this.getFileExtension(_imgLogoPartido).toLowerCase()+";base64," +encodedfile;
				fileInputStreamReader.close();
			}else {
				imgBase64 = "" ;
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return imgBase64;
	}

	public String getFileExtension(File file) {
		String extension = "";
		try {
			if (file != null && file.exists()) {
				String name = file.getName();
				extension = name.substring(name.lastIndexOf(".")+1);
			}
		} catch (Exception e) {
			extension = "";
		}
		return extension;

	}

	public Initiative qualifyInitiativeResult(Initiative initiative) {
		Result res = initiative.getResult();
		InitiativeHasPartner ihp = initiativeHasPartnerService.fetchInitiativePartnerByInitiativeId(initiative.getId());
		if(ihp != null) {
			if(ihp.getPartnerHasVote() != null && !ihp.getPartnerHasVote().isEmpty()) {
				List<PartnerHasVote> phvs = ihp.getPartnerHasVote();				   			
				int ausentes = phvs.size(),	aFavor = 0, enContra = 0, abstencion = 0, noVoto = 0, indefinido = 0, presentes = 0;
				for(PartnerHasVote phv : phvs) {
					if(phv.getAsistencia() != null){
						ausentes--;
						presentes ++;
					}
					if(phv.getVote() != null){
						if(phv.getVote().getOption() != null){							
							switch (phv.getVote().getOption().getName()) {
							case "A FAVOR":
								aFavor ++;
								break;
							case "EN CONTRA":
								enContra ++;
								break;
							case "ABSTENCION":
								abstencion ++;
								break;
							default:
								indefinido ++;
								break;
							}
						}
					}else{
						noVoto++;
					}
				}//TERMINA CICLO FOR PARA TOTALES
				res.setTotalAbstencion(abstencion);
				res.setTotalAFavor(aFavor);
				res.setTotalAusente(ausentes);
				res.setTotalEnContra(enContra);
				res.setTotalNoVoto(noVoto);
				res.setIndefinido(indefinido);
				res.setPresentes(presentes);
				if(res.getFormula() != null) {
					if(res.getFormula().getFormulaExpression().equals("$most")) {
						if(res.getTotalAFavor() > res.getTotalEnContra() && res.getTotalAFavor() > res.getTotalAbstencion()){
							res.setResultName("Aprobado");
							logger.debug("1");
						}else{
							res.setResultName("No aprobado");
							logger.debug("2");
						}
					}else {
						Double eval = null;
						Double comparator = null;
						try {
							eval = qualify(res.getFormula(), phvs.size(), res.getPresentes());//se mandan las posibles variables
						} catch (ScriptException e) {						
							e.printStackTrace();
						}
						logger.debug(String.valueOf(eval));
						switch (res.getRoundMethod().getValue()) {
						case "floor":
							comparator = Math.floor(eval);
							logger.debug("floor");
							break;
						case "ceil":
							comparator = Math.floor(eval);
							logger.debug("ceil");
							break;
						case "none":
							comparator = eval;
							logger.debug("none");
							break;
						default:
							logger.debug("default");
							comparator = eval;
							break;						
						}
						//establece porcentages
						//						double totalComparar = 0.0;
						//						if(res.getFormula().getFormulaExpression().contains("legislator_lenght")) {
						//							totalComparar = phvs.size();
						//						}else if(res.getFormula().getFormulaExpression().contains("attendance_lenght")) {
						//							totalComparar = res.getPresentes();
						//						}else {
						//							totalComparar = phvs.size();
						//						}						
						//						double valorComparacionFormula = calculatePercentage(eval, totalComparar);
						//						double totalAfavorPorcentaje = calculatePercentage(res.getTotalAFavor(), totalComparar);
						//						double totalEnContraPorcentaje = calculatePercentage(res.getTotalEnContra(), totalComparar);
						//						double totalAbstencionPorcentaje = calculatePercentage(res.getTotalAbstencion(), totalComparar);
						//						res.setResultName(evalResult(totalAfavorPorcentaje, totalEnContraPorcentaje, totalAbstencionPorcentaje, valorComparacionFormula));
						//personas solamente
						res.setResultName(evalResult(res.getTotalAFavor(), res.getTotalEnContra(), res.getTotalAbstencion(), comparator));
					}						
				}else {
					res.setResultName("No aprobado");
				}
			}else {
				res.setResultName("No aprobado");
			}
		}else {
			res.setResultName("No aprobado");
		}
		initiative.setResult(res);
		return initiative;    	
	}

	public Double qualify(Formula f, Integer legislator_lenght, Integer attendance_lenght) throws ScriptException {
		String exp = f.getFormulaExpression();//$legislator_lenght, $attendance_lenght, $most
		ScriptEngine engine = new ScriptEngineManager().getEngineByName("js");
		String infix = exp;
		infix = infix.replace("$legislator_lenght", String.valueOf(legislator_lenght));
		infix = infix.replace("$attendance_lenght", String.valueOf(attendance_lenght));
		logger.debug(infix);
		return ((Number) engine.eval(infix)).doubleValue();
	}

	/**
	 * El orden importa en los parametros 'evalua los parametros para definir el mayor o igual al comparador'
	 * @param aFavor
	 * @param enContra
	 * @param abstencion
	 * @param comparador
	 * @return el resultado de la evaluacion 'Aprovado/No aprovado'
	 */
	public String evalResult(double aFavor, double enContra, double abstencion, double comparador) {
		String res = "INDEFINIDO";
		logger.debug("[aFavor: " + aFavor + " enContra: " + enContra + ", abstencion: " + abstencion + "] comparador: [" + comparador + "]" );
		if(aFavor >= comparador){//vemos empates entre los 3 rubros							
			if(enContra >= comparador) {
				if(abstencion >= comparador) {
					res = "No aprobado";//empate entre los 3
					logger.debug("3");
				}else {
					res = "No aprobado";//empate a favor y en contra
					logger.debug("4");
				}
			}else {
				if(abstencion >= comparador) {
					res = "No aprobado";//empate abtencion y a favor
					logger.debug("5");
				}else {
					res = "Aprobado";//gana a favor
					logger.debug("6");
				}
			}
		}else{
			if(enContra >= comparador) {
				if(abstencion >= comparador) {
					res = "No aprobado";//empate abtencion y en contra
					logger.debug("6");
				}else {
					res = "No aprobado";//gana en contra
					logger.debug("7");
				}
			}else {
				if(abstencion >= comparador) {
					res = "No aprobado";//gana abstencion
					logger.debug("8");
				}else {
					res = "No aprobado";//sin acuerdo
					logger.debug("9");
				}
			}
		}
		logger.info("resultado: [" + res + "]");
		return res;		
	}

	public double calculatePercentage(double obtained, double total) {
		return obtained * 100 / total;
	}

	public List<LocalDate> getDatesBetween(LocalDate startDate, LocalDate endDate) { 
		long numOfDaysBetween = ChronoUnit.DAYS.between(startDate, endDate); 
		return IntStream.iterate(0, i -> i + 1)
				.limit(numOfDaysBetween)
				.mapToObj(i -> startDate.plusDays(i))
				.collect(Collectors.toList()); 
	}
}
