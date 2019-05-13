package com.solucionesdigitales.vote.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.solucionesdigitales.vote.entity.Attendance;

@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String>{

	List<Attendance> findAllByInitiative(String initiative);

	List<Attendance> findAllByInitiativeIdAndPartnerId(String initiativeId, String partnerId);
	List<Attendance> findAllByVoteSessionIdAndPartnerId(String voteSessionId, String partnerId);
	
	Attendance findFirstByPartnerAndDateTimeBetween(String partnerId , LocalDateTime dt1, LocalDateTime dt2);
	
	List<Attendance> findAllByDateTimeBetweenAndStatus(LocalDateTime dt1, LocalDateTime dt2,int status);

	List<Attendance> findByVoteSessionId(String voteSessionId);

	List<Attendance> findByVoteSessionIdAndPartnerId(String voteSessionId, String partnerId);

	List<Attendance> findByVoteSessionIsNotNullAndPartnerId(String partnerId);
	
	List<Attendance> findByVoteSessionIdAndVoteSessionNumberAttendanceAndPartnerId(String voteSessionId,int voteSessionNumberAttendance, String partnerId);
	
	List<Attendance> findByVoteSessionIdAndVoteSessionNumberAttendance(String voteSessionId,int voteSessionNumberAttendance);

	List<Attendance> findAllByDateTimeBetweenAndStatusAndPartnerIdAndVoteSessionIsNotNull(LocalDateTime dt1,
			LocalDateTime dt2, int active, String partnerId);
}
