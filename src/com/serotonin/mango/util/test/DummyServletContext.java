/*
    Mango - Open Source M2M - http://mango.serotoninsoftware.com
    Copyright (C) 2006-2011 Serotonin Software Technologies Inc.
    @author Matthew Lohbihler
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
package com.serotonin.mango.util.test;

import java.io.InputStream;
import java.net.URL;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.RequestDispatcher;
import javax.servlet.Servlet;
import javax.servlet.ServletContext;

/**
 * @author Matthew Lohbihler
 */
public class DummyServletContext implements ServletContext {
    public Map<String, Object> attributes = new HashMap<String, Object>();

    @Override
    public Object getAttribute(String key) {
        return attributes.get(key);
    }

    @Override
    public void removeAttribute(String key) {
        attributes.remove(key);
    }

    @Override
    public void setAttribute(String key, Object value) {
        attributes.put(key, value);
    }

    @Override
    public Enumeration<?> getAttributeNames() {
        return null;
    }

    @Override
    public ServletContext getContext(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getContextPath() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getInitParameter(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Enumeration<?> getInitParameterNames() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public int getMajorVersion() {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public String getMimeType(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public int getMinorVersion() {
        // TODO Auto-generated method stub
        return 0;
    }

    @Override
    public RequestDispatcher getNamedDispatcher(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getRealPath(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public RequestDispatcher getRequestDispatcher(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public URL getResource(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public InputStream getResourceAsStream(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Set<?> getResourcePaths(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getServerInfo() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Servlet getServlet(String arg0) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String getServletContextName() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Enumeration<?> getServletNames() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Enumeration<?> getServlets() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void log(Exception arg0, String arg1) {
        // TODO Auto-generated method stub

    }

    @Override
    public void log(String arg0, Throwable arg1) {
        // TODO Auto-generated method stub

    }

    @Override
    public void log(String arg0) {
        // TODO Auto-generated method stub

    }
}
