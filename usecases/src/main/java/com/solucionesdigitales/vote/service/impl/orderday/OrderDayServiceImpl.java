package com.solucionesdigitales.vote.service.impl.orderday;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.entity.vote.VoteSession;
import com.solucionesdigitales.vote.repository.orderday.OrderDayRepository;
import com.solucionesdigitales.vote.service.orderday.OrderDayService;
import com.solucionesdigitales.vote.service.utils.Constants;
import com.solucionesdigitales.vote.service.utils.OrderDayStatus;


@Service("orderDayService")
public class OrderDayServiceImpl implements OrderDayService {
	private static final Logger logger = LoggerFactory.getLogger(OrderDayServiceImpl.class);

	@Autowired
	private OrderDayRepository orderDayRepository;

	private final OrderDayStatus ORDERDAY_STATUS = new OrderDayStatus() {};

	@Override
	public List<OrderDay> fetch() {
		List<OrderDay> orderday= orderDayRepository.findAll();
		return orderday;
	}

	@Override
	public List<OrderDay> getActiveWithAndWithoutReference() {
		List<OrderDay> l1= orderDayRepository.findByStatusAndReferenciaIsNotNullOrderByFechaDesc(ORDERDAY_STATUS._ACTIVA);
		List<OrderDay> l2= orderDayRepository.findByStatusAndReferenciaIsNullOrderByFechaDesc(ORDERDAY_STATUS._ACTIVA);
		List<OrderDay> ordenes = new ArrayList<OrderDay>();
		ordenes.addAll(l1);
		ordenes.addAll(l2);

		return ordenes;
	}

	@Override
	public List<OrderDay> getSustituidaWithReference() {
		List<OrderDay> V1= orderDayRepository.findByStatusAndReferenciaIsNotNullOrderByFechaDesc(ORDERDAY_STATUS._SUSTITUIDA);
		List<OrderDay> ordendia = new ArrayList<OrderDay>();
		ordendia.addAll(V1);
		return ordendia;
	}


	@Override
	public List<OrderDay> getOdOriginal(String odOriginal) {
		List<OrderDay> odv = new ArrayList<OrderDay>();
		List<OrderDay> v2 = orderDayRepository.findByReferenciaOrderBySkuDesc(odOriginal);
		odv.addAll(v2);
		return  odv;
	}

	@Override
	public List<OrderDay> getByStatus(int status) {
		List<OrderDay> odpost= new ArrayList<OrderDay>();
		List<OrderDay> p1= orderDayRepository.findByStatus(ORDERDAY_STATUS._PUBLICADA);
		odpost.addAll(p1);
		return odpost;
	}

	@Override
	public OrderDay fetchById(String id) {
		return orderDayRepository.findFirstById(id);
	}

	@Override
	public List<OrderDay> getByDateBetween(int status, LocalDateTime f1, LocalDateTime f2) {
		List<OrderDay> res = new ArrayList<OrderDay>();
		res = orderDayRepository.findByStatusAndFechaBetween(status,f1,f2);
		return res;	
	}

	@Override
	public OrderDay post(OrderDay entity) {		
		entity = orderDayRepository.save(entity);	
		return entity;
	}

	@Override
	public OrderDay postNewVerssion(OrderDay entity) {
		OrderDay nuevaVersion = new OrderDay();
		nuevaVersion.setFecha(entity.getFecha());
		nuevaVersion.setElementParagraph(entity.getElementParagraph());
		//nuevaVersion.setElementsOd(entity.getElementsOd());
		nuevaVersion.setNombre(entity.getNombre());
		nuevaVersion.setId(entity.getId());
		Optional<OrderDay> od = orderDayRepository.findById(entity.getId());
		if(entity.getOdOriginal() != null && !entity.getOdOriginal().isEmpty()) {
			nuevaVersion.setOdOriginal(entity.getOdOriginal());
		}else {
			if (entity.getId() != null && !entity.getId().isEmpty()) {
				nuevaVersion.setOdOriginal(entity.getId());
			}else {
				//TODO error
			}
		}
		//nuevaVersion.getStatus();
		nuevaVersion.setStatus(ORDERDAY_STATUS._ACTIVA);
		nuevaVersion.setAttached(entity.getAttached());
		nuevaVersion.setSku(entity.getSku()+1);
		nuevaVersion = orderDayRepository.save(nuevaVersion);

		entity = od.get(); 
		entity.setReferencia(nuevaVersion.getId()); 
		entity.setId(null);
		entity.setStatus(ORDERDAY_STATUS._SUSTITUIDA);
		orderDayRepository.save(entity);
		return nuevaVersion;
	}

	@Override
	public OrderDay putPublishedByOdOriginal(OrderDay entity) {
		OrderDay replace = new OrderDay();
		
		entity.setPublished(true);
		if(entity.getOdOriginal() != null || entity.getOdOriginal() == entity.getReferencia()) {
			//replace.setOdOriginal(entity.getOdOriginal());
			replace = orderDayRepository.save(entity);
			logger.info("Orden del dia publicada: ["+entity+"]");
			 
		}
		 return replace;
	}

	
	@Override
	public OrderDay put(OrderDay entity) {
		OrderDay orderday= new OrderDay();
		orderday = orderDayRepository.save(entity);
		return orderday;
	}

	@Override
	public OrderDay delete(OrderDay entity) {
		OrderDay orderday = new OrderDay();
		entity.setStatus(ORDERDAY_STATUS._ELIMINADA);
		if(entity.getId() != null) {
			orderday = orderDayRepository.save(entity);
			logger.info("Orden del dia eliminado: ["+entity+"]");
		}
		return orderday;
	}

	@Override
	public List<OrderDay> getByStatusPublicada(boolean publicada) {
		List<OrderDay> orderday= new ArrayList<OrderDay>();
		orderday= orderDayRepository.findByIsPublishedOrderByFechaDesc(publicada);
		orderday= orderDayRepository.findByStatus(ORDERDAY_STATUS._ACTIVA);
		return orderday;
	}

	@Override
	public List<OrderDay> getByStatusAprobada(boolean status) {
		List<OrderDay> odapproved= new ArrayList<OrderDay>();
		odapproved = orderDayRepository.findByIsApproved(status);
		return odapproved;
	}

	@Override
	public List<OrderDay> fetchByBetweenDates(boolean status, Date dateStart, Date dateEnd) {
		Calendar date = Calendar.getInstance();
		date.setTime(dateEnd);
		date.add(Calendar.DAY_OF_YEAR, 1);
		return orderDayRepository.findByIsPublishedAndFechaBetween(status,dateStart,date.getTime());
	}

	@Override
	public List<OrderDay> getDateAndActiveWithoutReference(LocalDateTime t1, LocalDateTime t2, int status) {
		List<OrderDay> res = new ArrayList<OrderDay>();
		List<OrderDay> l1 = orderDayRepository.findByStatusAndFechaBetween(status, t1, t2);
		if(l1 != null) {
			res.addAll(l1);
		}
		
		return res;	
	}

	
}
