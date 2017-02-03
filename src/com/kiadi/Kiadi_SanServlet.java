package com.kiadi;

import java.io.IOException;
import javax.servlet.http.*;

@SuppressWarnings("serial")
public class Kiadi_SanServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		resp.setContentType("text/plain");
		resp.getWriter().println("Hello, world");
	}
}
