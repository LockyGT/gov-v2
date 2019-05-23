package com.solucionesdigitales.vote.service.elementsod;

import java.util.List;

import com.solucionesdigitales.vote.entity.elementsod.ElementOd;

public interface ElementsOdService {

	List<ElementOd> fetch();

	ElementOd post(ElementOd entity);

	ElementOd put(ElementOd entity);

	ElementOd delete(ElementOd entity);

	List<ElementOd> getNameOrder();


}
