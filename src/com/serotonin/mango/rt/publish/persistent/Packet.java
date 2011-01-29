package com.serotonin.mango.rt.publish.persistent;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.Charset;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.commons.pool.BasePoolableObjectFactory;
import org.apache.commons.pool.ObjectPool;
import org.apache.commons.pool.impl.GenericObjectPool;

import com.serotonin.ShouldNeverHappenException;
import com.serotonin.io.StreamUtils;
import com.serotonin.util.queue.ByteQueue;
import com.serotonin.web.i18n.LocalizableMessage;
import com.serotonin.web.i18n.LocalizableMessageParseException;

public class Packet {
    private static final Log LOG = LogFactory.getLog(Packet.class);
    private static final Charset CHARSET = Charset.forName("UTF-8");

    public static final byte[] EMPTY = new byte[0];
    public static final byte[] ONE = new byte[] { 1 };

    static final ObjectPool packetPool = new GenericObjectPool(new BasePoolableObjectFactory() {
        @Override
        public Object makeObject() {
            return new Packet();
        }
    }, 1000);

    public static Packet readPacketNoBlock(InputStream in) throws IOException, PersistentAbortException {
        if (in.available() > 0)
            return readPacket(in);
        return null;
    }

    public static Packet readPacket(InputStream in) throws IOException, PersistentAbortException {
        int length = StreamUtils.read4ByteSigned(in);
        if (length > 100000)
            // An unlikely length.
            LOG.error("Reading very long packet: " + length);

        Packet packet;
        try {
            packet = (Packet) packetPool.borrowObject();
        }
        catch (Exception e) {
            throw new ShouldNeverHappenException(e);
        }
        packet.type = StreamUtils.readByte(in);
        try {
            packet.payload.read(in, length);
        }
        catch (OutOfMemoryError e) {
            throw new ShouldNeverHappenException("OOM trying to read packet of length " + length);
        }

        if (packet.type == ABORT) {
            String message = packet.popString();
            try {
                throw new PersistentAbortException(LocalizableMessage.deserialize(message));
            }
            catch (LocalizableMessageParseException e) {
                throw new PersistentAbortException(new LocalizableMessage("common.default", message));
            }
        }

        return packet;
    }

    public static Packet borrowPacket(byte type, ByteQueue payload) {
        try {
            Packet packet = (Packet) packetPool.borrowObject();
            packet.type = type;
            packet.payload.push(payload);
            return packet;
        }
        catch (Exception e) {
            throw new ShouldNeverHappenException(e);
        }
    }

    public static void writePacket(OutputStream out, Packet packet) throws IOException {
        writeHeader(out, packet.type, packet.payload.size());
        packet.payload.write(out);
    }

    public static void writePacket(OutputStream out, byte type, byte[] payload) throws IOException {
        writeHeader(out, type, payload.length);
        out.write(payload);
    }

    public static void writePacket(OutputStream out, byte type, ByteQueue payload) throws IOException {
        writeHeader(out, type, payload.size());
        payload.write(out);
    }

    private static void writeHeader(OutputStream out, byte type, int length) throws IOException {
        StreamUtils.write4ByteSigned(out, length);
        StreamUtils.writeByte(out, type);
    }

    public static void pushString(ByteQueue queue, String s) {
        byte[] b = s.getBytes(CHARSET);
        queue.pushU2B(b.length);
        queue.push(b);
    }

    public static void pushLong(ByteQueue queue, long l) {
        queue.pushU4B(l >> 32);
        queue.pushU4B(l);
    }

    public static void pushDouble(ByteQueue queue, double d) {
        pushLong(queue, Double.doubleToLongBits(d));
    }

    public static final byte VERSION = 0;
    public static final byte AUTH_KEY = 1;
    public static final byte POINT = 2;
    public static final byte DATA = 3;
    public static final byte CLOSE = 4;
    public static final byte ABORT = 5;
    public static final byte TEST = 6;
    public static final byte RANGE_COUNT = 7;
    public static final byte POINT_UPDATE = 8;

    private byte type;
    private final ByteQueue payload = new ByteQueue();

    public byte getType() {
        return type;
    }

    public ByteQueue getPayload() {
        return payload;
    }

    public String popString() {
        return payload.popString(payload.popU2B(), CHARSET);
    }

    public long popLong() {
        return (payload.popU4B() << 32) | payload.popU4B();
    }

    public double popDouble() {
        return Double.longBitsToDouble(popLong());
    }

    public void release() {
        payload.clear();
        try {
            packetPool.returnObject(this);
        }
        catch (Exception e) {
            throw new ShouldNeverHappenException(e);
        }
    }
}
