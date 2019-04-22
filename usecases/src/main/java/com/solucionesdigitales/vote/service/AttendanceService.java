package com.solucionesdigitales.vote.service;

import java.time.LocalDateTime;
import java.util.List;

import com.solucionesdigitales.vote.entity.Attendance;

public interface AttendanceService {
	
	List<Attendance> fetch();
	
	Attendance fetchByPartnerIdAndDate(String partnerId,LocalDateTime dt1, LocalDateTime dt2);
	
	List<Attendance> fetchByInitiativeId(String initiativeId);
	
	List<Attendance> fetchByInitiativeIdAndPartnerId(String initiativeId, String partnerId);

	Attendance post(Attendance entity);

	Attendance put(Attendance entity);
	
	List<Attendance> findAllByDateTimeBetween(LocalDateTime dt1, LocalDateTime dt2);

	List<Attendance> findAllByDateTimeBetweenWithSesion(LocalDateTime dt1, LocalDateTime dt2);
	
	List<Attendance> findAttendanceSesionByDateTimeBetween(LocalDateTime dt1, LocalDateTime dt2);

	List<Attendance> fetchByVoteSessionId(String voteSessionId);

	List<Attendance> fetchByVoteSessionIdAndPartnerId(String voteSessionId, String partnerId);

	List<Attendance> findByVoteSessionIsNotNullAndPartnerId(String partnerId);
	
	List<Attendance> findAttendancesSessionsByDateTime(LocalDateTime dt1, LocalDateTime dt2);
	
	List<Attendance> fetchByVoteSessionIdAndVoteSessionNumberAttendanceAndPartnerId(String voteSessionId, int attendanceNumber , String partnerId);
	
	List<Attendance> findAttendanceListBySession(String voteSessionId , int attendanceNumber);

	List<Attendance> findAllByDateTimeBetweenAndStatusAndPartnerIdAndVoteSessionIsNotNull(LocalDateTime dt1,
			LocalDateTime dt2, int status, String partnerId);
}
