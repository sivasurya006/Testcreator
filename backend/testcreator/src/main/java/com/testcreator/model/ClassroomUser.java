package com.testcreator.model;

import java.time.Instant;

public class ClassroomUser {
	private final User user;
	private final Instant joinedAt;
	private final UserRole role;
	
	public ClassroomUser(User user, Instant joinedAt, UserRole role) {
		this.user = user;
		this.joinedAt = joinedAt;
		this.role = role;
	}
	
	public User getUser() {
		return user;
	}
	public Instant getJoinedAt() {
		return joinedAt;
	}
	public UserRole getRole() {
		return role;
	}
	
	
	
}
