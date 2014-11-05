package server;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class JsonProjects extends HttpServlet {
	private static final long serialVersionUID = 1L;
	 
    public void doGet (HttpServletRequest request,HttpServletResponse response)
            throws ServletException, IOException  {
     
	    	response.setContentType("text/html");
	    	response.getWriter().println("<h1>GOOD!</h1>");
    }
    
    public String generateJSONData(String code) {
    	return null;
    }
}