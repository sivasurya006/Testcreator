package com.testcreator.actions;



import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.interceptor.ServletResponseAware;
import org.apache.struts2.util.ServletContextAware;

import com.opensymphony.xwork2.Action;
import com.testcreator.dto.ApiError;
import com.testcreator.exception.UserNotFoundException;
import com.testcreator.service.Userservice;
import com.testcreator.util.InputValidatorUtil;
import com.testcreator.util.JwtUtil;


public class UserAction extends JsonApiAction implements ServletResponseAware, ServletContextAware{
	
	private String userName;
	private String userEmail;
	private String userPassword;
	private int userId;
	private HttpServletResponse response;
	private ServletContext context;
	
	public String signin() {
		if(! InputValidatorUtil.isValidEmail(userEmail)) {
			setError(new ApiError("Invalid email", 400));
			return INPUT;
		}
		if(userPassword == null) {
			setError(new ApiError("Password can't be null", 400));
			return INPUT;
		}
		Userservice userservice = new Userservice();
		try {
			userId =  userservice.signin(userEmail, userPassword);
			if(userId == -1) {
				setError(new ApiError("Invalid email or password", 401));
				return ERROR;
			}
			JwtUtil jwt = new JwtUtil(context);
			String token = jwt.generateToken(userId+"");
			Cookie cookie = new Cookie("token", token);
			cookie.setMaxAge(60);
			cookie.setHttpOnly(true);
			
			response.addCookie(cookie);
			
			
			System.out.println("cookie added");
			return SUCCESS;
		}catch (UserNotFoundException e) {
			// TODO: logger
			
		}
		
		setError(new ApiError("Invalid email or password", 401));
		return ERROR;
		
	}

	public String signup() {
		if(! InputValidatorUtil.isValidUsername(userName)){
			setError(new ApiError("Invalid username", 400));
			return INPUT;
		}
		if(! InputValidatorUtil.isValidEmail(userEmail)) {
			setError(new ApiError("Invalid email", 400));
			return INPUT;
		}
		if(! InputValidatorUtil.isStrongPassword(userPassword)) {
			setError(new ApiError("not a string password", 400));
			return INPUT;
		}
		
		Userservice userservice = new Userservice();
		userId  =  userservice.signup(userName, userEmail, userPassword);
		
		if(userId == -1) {
			setError(new ApiError("User already exists", 409));
			return "duplicate";
		}
		
		
		JwtUtil jwt = new JwtUtil(context);
		String token = jwt.generateToken(userId+"");
		Cookie cookie = new Cookie("token", token);
		cookie.setMaxAge(60);
		cookie.setHttpOnly(true);
		
		response.addCookie(cookie);		
		return SUCCESS;
	}	

	public int getUserId() {
		return userId;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}

	@Override
	public void setServletContext(ServletContext context) {
		this.context = context;
	}

	@Override
	public void setServletResponse(HttpServletResponse response) {
		this.response = response;
	}

	
}
