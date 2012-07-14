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
package com.serotonin.mango.rt.dataImage.types;

import java.awt.Image;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Arrays;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

import com.serotonin.InvalidArgumentException;
import com.serotonin.io.StreamUtils;
import com.serotonin.mango.Common;
import com.serotonin.mango.DataTypes;
import com.serotonin.util.ArrayUtils;
import com.serotonin.util.image.ImageUtils;

/**
 * @author Matthew Lohbihler
 */
public class ImageValue extends MangoValue implements Comparable<ImageValue> {
    private static final String FILENAME_PREFIX = "img";
    private static final DateTimeFormatter dtf = DateTimeFormat.forPattern("yyyy/yyyy-MM-dd");

    public static final int TYPE_JPG = 1;
    private static final String[] TYPES = { "", "jpg" };

    private long id = Common.NEW_ID;
    private int type;
    private long timestamp;
    private byte[] data;

    public ImageValue(long id, int type, long timestamp) {
        this.id = id;
        this.type = type;
        this.timestamp = timestamp;
    }

    public ImageValue(byte[] data, int type, long timestamp) {
        this.data = data;
        this.type = type;
        this.timestamp = timestamp;
    }

    public ImageValue(String filename) throws InvalidArgumentException {
        id = parseIdFromFilename(filename);
        if (id == -1)
            throw new InvalidArgumentException();
        
        timestamp = parseDateFromFilePath(filename);
        if (timestamp == -1) 
        	throw new InvalidArgumentException();
        

        int dot = filename.indexOf('.');
        if (dot == -1)
            throw new InvalidArgumentException();

        String ext = filename.substring(dot + 1);
        type = ArrayUtils.indexOf(TYPES, ext);
        if (type == -1)
            throw new InvalidArgumentException();
    }

    public String getFilename() {
        return FILENAME_PREFIX + id + '.' + TYPES[type];
    }

        public String getDirectoryName() { 
    	      return dtf.print(new DateTime(timestamp));
    	    }
    	    
	public static long parseIdFromFilename(String filename) {
		// could have a path in front of the filename so lop anyting before a /
		// off
		int slash = filename.lastIndexOf(File.separator);
		if (slash != -1 && !filename.endsWith(File.separator)) {
			filename = filename.substring(slash + 1, filename.length());
		}

        if (!filename.startsWith(FILENAME_PREFIX))
            return -1;
        int dot = filename.indexOf('.');
        if (dot == -1)
            filename = filename.substring(FILENAME_PREFIX.length());
        else
            filename = filename.substring(FILENAME_PREFIX.length(), dot);

        try {
            return Long.parseLong(filename);
        }
        catch (NumberFormatException e) {
            return -1;
        }
    }

	public static long parseDateFromFilePath(String filename) {

		// expecting
		// (Common.getFileDataPath)/yyyy/yyyy-mm-dd/(\d+)\.(jpg|png|TYPE)
		filename = filename.replace(Common.getFiledataPath(), "");

		// don't really know if filedatapath ends with /
		if (filename.startsWith(File.separator))
			filename = filename.substring(1, filename.length());

		// expect to have yyyy/yyyy-mm-dd/filename
		int slash = filename.lastIndexOf(File.separator);
		if (slash == -1)
			return -1;

		filename = filename.substring(1, slash - 1);

		return dtf.parseDateTime(filename).getMillis();
	}
		    	
	public String getFilePath() {
		File f = new File(Common.getFiledataPath() + "/" + getDirectoryName(),
				getFilename());
		if (!f.exists())
			f = new File(Common.getFiledataPath(), getFilename());
		return f.getPath();
	}
		    
	
    @Override
    public String toString() {
        return getFilename();
    }

    public String getTypeExtension() {
        return TYPES[type];
    }

    public boolean isSaved() {
        return id != Common.NEW_ID;
    }

    public Image getImage() {
        try {
            if (data != null)
                return ImageUtils.createImage(data);
            return ImageUtils.loadImage(getFilePath());
        }
        catch (InterruptedException e) {
            // no op
        }
        return null;
    }

    public byte[] getImageData() throws IOException {
        if (!isSaved())
            return data;

        FileInputStream in = null;
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try {
            in = new FileInputStream(getFilePath());
            StreamUtils.transfer(in, out);
        }
        finally {
            if (in != null)
                in.close();
        }
        return out.toByteArray();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + (int) (id ^ (id >>> 32));
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        final ImageValue other = (ImageValue) obj;

        if (id != -1 && id == other.id)
            return true;

        if (data != null && other.data != null && Arrays.equals(data, other.data))
            return true;

        return false;
    }

    @Override
    public boolean hasDoubleRepresentation() {
        return false;
    }

    @Override
    public double getDoubleValue() {
        throw new RuntimeException(
                "ImageValue has no double value. Use hasDoubleRepresentation() to check before calling this method");
    }

    @Override
    public String getStringValue() {
        return getFilename();
    }

    @Override
    public boolean getBooleanValue() {
        throw new RuntimeException("ImageValue has no boolean value.");
    }

    @Override
    public Object getObjectValue() {
        throw new RuntimeException("ImageValue has no object value.");
    }

    @Override
    public int getIntegerValue() {
        throw new RuntimeException("ImageValue has no int value.");
    }

    @Override
    public Number numberValue() {
        throw new RuntimeException("ImageValue has no Number value.");
    }

    @Override
    public int getDataType() {
        return DataTypes.IMAGE;
    }

    @Override
    public int compareTo(ImageValue that) {
        return getFilename().compareTo(that.getFilename());
    }

    @Override
    public <T extends MangoValue> int compareTo(T that) {
        return compareTo((ImageValue) that);
    }
}
