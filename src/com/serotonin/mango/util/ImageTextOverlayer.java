package com.serotonin.mango.util;
import java.awt.Color;
import java.awt.Font;

import java.awt.font.FontRenderContext;
import java.awt.font.TextLayout;
import java.awt.geom.Rectangle2D;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.imageio.ImageIO;


/**
 * Overlay a  list of strings on an image.
 * based on  http://www.javalobby.org/java/forums/t87960.html
 * 
 *
 */
public class ImageTextOverlayer {

	public static final int POSITION_TOP_LEFT =1;
	public static final int POSITION_TOP_RIGHT=2;
	public static final int POSITION_BOTTOM_LEFT=3;
	public static final int POSITION_BOTTOM_RIGHT=4;
	
	public static byte[] overlayText(byte[] data, List<String> texts, int position)  {
		
		try {
			InputStream in = new ByteArrayInputStream(data);
			BufferedImage img = ImageIO.read(in);
		
			img = overlayText(img, texts, position);
			
			// return array of bytes
			ByteArrayOutputStream out = new ByteArrayOutputStream();
			ImageIO.write(img, "JPEG", out);
			byte[] imageBytes = out.toByteArray();		
			return imageBytes;
			
		} catch (IOException e) {
			//LOG.info("IOException overlaying text", e);
		} 
		
		return data;
	}

	
	public static BufferedImage overlayText(BufferedImage image, List<String> texts, int position) {

		// set font
		Font font = new Font("Courier New", Font.BOLD, 10);
		
		// calc/guess bounding of text height
		FontRenderContext frc = new FontRenderContext(null, true, false);
		TextLayout layout = new TextLayout("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", font, frc);
		Rectangle2D textBounds = layout.getBounds();
		int boxHeight = (int)textBounds.getHeight() + 2;
		
		// find maximum width of box
		int boxWidth=0;
		for (String s : texts) {
			layout = new TextLayout(s, font, frc);
			textBounds = layout.getBounds();
			if (textBounds.getWidth()> boxWidth) {
				boxWidth = (int)textBounds.getWidth();
			}
		}
		
		boxWidth+=4;
		
		if (image != null) {

			Graphics2D g = image.createGraphics();
			// default positioning.
			int x=0; 
			int y=0;
			int yOffset=boxHeight;
			
			if (position == POSITION_TOP_LEFT) {
				y=0;
				x=0;
				yOffset=boxHeight;
			} else if (position == POSITION_TOP_RIGHT) {
				y=0;
				x=image.getWidth() - boxWidth;
				yOffset=boxHeight;
			} else if (position == POSITION_BOTTOM_RIGHT) {
				x=image.getWidth() - boxWidth;
				y=image.getHeight() - boxHeight;
				yOffset=-boxHeight;
			} else if (position == POSITION_BOTTOM_LEFT) {
				x=0;
				y=image.getHeight() - boxHeight;
				yOffset=-boxHeight;
			} else {
				// use defaults of top left
			}
			
			// what if text size exceeds image size?
			if (x<0) 
				x=0;
			if (y<0)
				y=0;

			for (String s : texts) {
				drawStringInBox(g,s,x, y, boxWidth, boxHeight, font, Color.BLACK, Color.WHITE);
				y+=yOffset;
			}
		}
		return image;
	}
	
	
	private static void drawStringInBox(Graphics2D g, String text, int boxX, int boxY, int boxWidth, int boxHeight, Font font, Color boxColor, Color textColor) {
	// create box with background colour to place text in
		g.setColor(boxColor);
		g.fillRect(boxX, boxY, boxWidth, boxHeight);
		
		// set font and colour
		g.setFont(font);
		g.setBackground(boxColor);
		g.setColor(textColor);
		
	//render text
		g.drawString(text, boxX + 1, boxY + boxHeight -4);		
	}
	
}