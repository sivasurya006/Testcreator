package com.testcreator.filters;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class CorsFilter extends HttpFilter implements Filter {
       
    public CorsFilter() {
        super();
    }
	public void destroy() {
		
	}

	@Override
	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
	        throws IOException, ServletException {

	    HttpServletRequest request = (HttpServletRequest) req;
	    HttpServletResponse response = (HttpServletResponse) res;

	    response.setHeader("Access-Control-Allow-Origin", "http://localhost:8081");
	    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	    response.setHeader(
	        "Access-Control-Allow-Headers",
	        "Content-Type, Authorization"
	    );
	    response.setHeader("Access-Control-Allow-Credentials", "true");

	    chain.doFilter(req, res);
	}

	public void init(FilterConfig fConfig) throws ServletException {
		
	}

}
