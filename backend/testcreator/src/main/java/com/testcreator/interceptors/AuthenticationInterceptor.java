package com.testcreator.interceptors;
import com.opensymphony.xwork2.Action;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.testcreator.actions.JsonApiAction;
import com.testcreator.dto.ApiError;
import com.testcreator.util.JwtUtil;

import io.jsonwebtoken.Claims;

public class AuthenticationInterceptor extends AbstractInterceptor {

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
	
		HttpServletRequest request = (HttpServletRequest) ServletActionContext.getRequest();
		String tokenValue = null;
		
		Cookie[] cookies = request.getCookies();
		if(cookies == null) {
			Object action = invocation.getAction();
			if(action instanceof JsonApiAction jsonAction) {
				jsonAction.setError(new ApiError("Authentication failed", 301));
			}
			return Action.ERROR;
		}
			for(Cookie cookie : cookies) {
				if(cookie.getName().equals("token")) {
					tokenValue = cookie.getValue();
					break;
				}
			}
		if(tokenValue == null) {
			Object action = invocation.getAction();
			if(action instanceof JsonApiAction jsonAction) {
				jsonAction.setError(new ApiError("Authentication failed", 301));
			}
			return Action.ERROR;
		}
		
		JwtUtil jwtUtil = new JwtUtil(ServletActionContext.getServletContext());
		
		Claims claims = jwtUtil.verifyToken(tokenValue) ;

		if(claims != null) {
			request.setAttribute("token", claims);
			request.setAttribute("userId", claims.getSubject());
			return invocation.invoke();
		}
		
		Object action = invocation.getAction();
		if(action instanceof JsonApiAction jsonAction) {
			jsonAction.setError(new ApiError("Authentication failed", 301));
		}
		
		return Action.ERROR;
		
	}

}
