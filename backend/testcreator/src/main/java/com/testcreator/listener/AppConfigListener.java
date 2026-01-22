package com.testcreator.listener;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

/**
 * Application Lifecycle Listener implementation class AppConfigListener
 *
 */
@WebListener
public class AppConfigListener implements ServletContextListener {

   
    public AppConfigListener() {
        
    }

    public void contextDestroyed(ServletContextEvent sce)  { 
         
    }

    public void contextInitialized(ServletContextEvent sce)  { 
         ServletContext context = sce.getServletContext();
         Properties props = new Properties();
         String path = context.getInitParameter("config.location");
         try(InputStream is = new FileInputStream(path)){
       		 props.load(is);
         } catch (FileNotFoundException e) {
       		 throw new RuntimeException("Failed to load application properties file", e);
		 } catch (IOException e) {
		    throw new RuntimeException("Failed to load application properties from the file", e);
		 }
         props.forEach((key,value) -> {
        	context.setInitParameter(key.toString(), value.toString());
        }); 
    }
	
}
