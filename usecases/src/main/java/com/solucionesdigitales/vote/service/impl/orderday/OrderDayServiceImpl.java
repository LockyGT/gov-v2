package com.solucionesdigitales.vote.service.impl.orderday;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.solucionesdigitales.vote.entity.orderday.OrderDay;
import com.solucionesdigitales.vote.repository.orderday.OrderDayRepository;
import com.solucionesdigitales.vote.service.orderday.OrderDayService;
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
		List<OrderDay> l1= orderDayRepository.findByStatusAndReferenciaIsNotNull(ORDERDAY_STATUS._ACTIVA);
		List<OrderDay> l2= orderDayRepository.findByStatusAndReferenciaIsNull(ORDERDAY_STATUS._ACTIVA);
		List<OrderDay> ordenes = new ArrayList<OrderDay>();
		ordenes.addAll(l1);
		ordenes.addAll(l2);
		
		return ordenes;
	}
	@Override
	public List<OrderDay> getSustituidaWithAndWithoutReference() {
		List<OrderDay> lista = orderDayRepository.findByStatus(ORDERDAY_STATUS._SUSTITUIDA);
		List<OrderDay> ordendia = new ArrayList<OrderDay>();
		ordendia.addAll(lista);
		return ordendia;
	}

//	@Override
//	public List<OrderDay> findOrderDayByFechaBetwen(LocalDateTime t1, LocalDateTime t2) {
//		List<OrderDay> res = new ArrayList<OrderDay>();
//		List<OrderDay> l1 = orderDayRepository.findOrderDayByFechaHora(t1);
//		List<OrderDay> l2 = orderDayRepository.findOrderDayByFechaHora(t2);
//		
//		if(l1 != null) {
//			res.addAll(l1);
//		}
//		if(l2 != null) {
//			res.addAll(l2);
//		}
//		return res;	
//	}
	
	
	@Override
	public OrderDay post(OrderDay entity) {		
		entity = orderDayRepository.save(entity);	
		return entity;
	}

	
	@Override
	public OrderDay put(OrderDay entity) {
		OrderDay nuevaVersion = new OrderDay();
		nuevaVersion.setFecha(entity.getFecha());
		nuevaVersion.setModuloOd(entity.getModuloOd());
		nuevaVersion.setNombre(entity.getNombre());
		nuevaVersion.setParagraphs(entity.getParagraphs());
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
		nuevaVersion = orderDayRepository.save(nuevaVersion);
		
		
		entity = od.get(); 
		entity.setReferencia(nuevaVersion.getId()); 
		entity.setId(null);
		entity.setStatus(ORDERDAY_STATUS._SUSTITUIDA);
		orderDayRepository.save(entity);
		return nuevaVersion;
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

	

	
	

	
}
