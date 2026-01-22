package com.testcreator.model;

import java.time.Instant;

public class Classroom {
	public final int classroomId;
	public final int createdBy;
	public String name; 
	public final Instant createdAt;
	public Instant joinedAt;
	
	public Classroom(int classroomId, int createdBy, String name, Instant createdAt) {
		this.classroomId = classroomId;
		this.createdBy = createdBy;
		this.name = name;
		this.createdAt = createdAt;
	}
	
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getClassroomId() {
		return classroomId;
	}


	public int getcreatedBy() {
		return createdBy;
	}
	public Instant getcreatedAt() {
		return createdAt;
	}
	
	public Instant getJoinedAt() {
		return joinedAt;
	}


	public void setJoinedAt(Instant joinedAt) {
		this.joinedAt = joinedAt;
	}
	
	
}