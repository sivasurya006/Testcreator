package com.testcreator.service;

import java.sql.Connection;
import java.util.List;

import com.testcreator.dao.ClassroomDao;
import com.testcreator.dao.UserDao;
import com.testcreator.exception.UserNotFoundException;
import com.testcreator.model.Classroom;
import com.testcreator.model.User;




public class ClassroomService {
	
	private final UserDao userDao;
	private final ClassroomDao classroomDao;
	
	
	public ClassroomService(Connection connection) {
		userDao = new UserDao(connection);
		classroomDao = new ClassroomDao(connection);
	}
	
	public Classroom createNewClassRoom(int creatorId,String name) {
		User user = userDao.getUserById(creatorId);
		if(user == null) {
			throw new UserNotFoundException("User not registered");
		}
		return classroomDao.createNewClassRoom(user.getUserId(), name);	
	}
	
	public List<Classroom> getAllCreatedClassrooms(int userId){
		return classroomDao.getAllCreatedClassrooms(userId);
	}

	public List<Classroom> getAllJoinedClassrooms(int userId){
		return classroomDao.getAllJoinedClassrooms(userId);
	}
	
}
