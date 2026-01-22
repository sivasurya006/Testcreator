package com.testcreator.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.servlet.ServletContext;

public class DBConnectionMaker {
	
	private Connection connection;
	private static DBConnectionMaker connectionMaker;
	
	private DBConnectionMaker(ServletContext context) throws SQLException, ClassNotFoundException {
		String url = context.getInitParameter("db.url");
		String user = context.getInitParameter("db.user");
		String password = context.getInitParameter("db.password");
		Class.forName("com.mysql.cj.jdbc.Driver");
		this.connection = DriverManager.getConnection(url,user,password);
	}
	
	
	public static DBConnectionMaker getInstance(ServletContext context) throws ClassNotFoundException, SQLException {
		if(connectionMaker == null) {
			connectionMaker = new DBConnectionMaker(context);
			System.out.println("New connection maked");
		}
		return connectionMaker;
	}
	
	public Connection getConnection(){
		
		System.out.println("One connection getted");
		return connection;
	}
}
