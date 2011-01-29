package com.serotonin.mango.rt.dataSource.persistent;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketTimeoutException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.serotonin.mango.Common;
import com.serotonin.mango.db.dao.DataPointDao;
import com.serotonin.mango.db.dao.PointValueDao;
import com.serotonin.mango.rt.dataImage.DataPointRT;
import com.serotonin.mango.rt.dataImage.PointValueTime;
import com.serotonin.mango.rt.dataImage.types.AlphanumericValue;
import com.serotonin.mango.rt.dataImage.types.BinaryValue;
import com.serotonin.mango.rt.dataImage.types.ImageValue;
import com.serotonin.mango.rt.dataImage.types.MangoValue;
import com.serotonin.mango.rt.dataImage.types.MultistateValue;
import com.serotonin.mango.rt.dataImage.types.NumericValue;
import com.serotonin.mango.rt.dataSource.EventDataSource;
import com.serotonin.mango.rt.publish.persistent.Packet;
import com.serotonin.mango.rt.publish.persistent.PersistentAbortException;
import com.serotonin.mango.rt.publish.persistent.PersistentProtocolException;
import com.serotonin.mango.vo.DataPointVO;
import com.serotonin.mango.vo.dataSource.persistent.PersistentDataSourceVO;
import com.serotonin.mango.vo.dataSource.persistent.PersistentPointLocatorVO;
import com.serotonin.mango.vo.event.PointEventDetectorVO;
import com.serotonin.util.SerializationHelper;
import com.serotonin.util.StringUtils;
import com.serotonin.util.queue.ByteQueue;
import com.serotonin.web.i18n.LocalizableMessage;

public class PersistentDataSourceRT extends EventDataSource implements Runnable {
    public static final int DATA_SOURCE_EXCEPTION_EVENT = 1;

    final Log log = LogFactory.getLog(PersistentDataSourceRT.class);
    final PersistentDataSourceVO vo;
    volatile ServerSocket serverSocket;
    final Map<String, DataPointRT> pointXids = new ConcurrentHashMap<String, DataPointRT>();
    final List<ConnectionHandler> connectionHandlers = new CopyOnWriteArrayList<ConnectionHandler>();

    public PersistentDataSourceRT(PersistentDataSourceVO vo) {
        super(vo);
        this.vo = vo;
    }

    //
    //
    // Lifecycle
    //
    @Override
    public void initialize() {
        super.initialize();

        try {
            serverSocket = new ServerSocket(vo.getPort());
            serverSocket.setSoTimeout(2000);

            returnToNormal(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis());
        }
        catch (IOException e) {
            serverSocket = null;
            raiseEvent(DATA_SOURCE_EXCEPTION_EVENT, System.currentTimeMillis(), true, new LocalizableMessage(
                    "event.initializationError", e.getMessage()));
        }
    }

    @Override
    public void terminate() {
        super.terminate();

        // Stop the server socket
        if (serverSocket != null) {
            try {
                serverSocket.close();
            }
            catch (IOException e) {
                // Ignore
            }
            serverSocket = null;
        }
    }

    @Override
    public void joinTermination() {
        super.joinTermination();

        while (!connectionHandlers.isEmpty()) {
            try {
                Thread.sleep(500);
            }
            catch (InterruptedException e) {
                // no op
            }
        }
    }

    @Override
    public void beginPolling() {
        if (serverSocket != null)
            new Thread(this, "Persistent TCP data source").start();
    }

    @Override
    public void addDataPoint(DataPointRT dataPoint) {
        super.addDataPoint(dataPoint);
        pointXids.put(dataPoint.getVO().getXid(), dataPoint);
    }

    @Override
    public void removeDataPoint(DataPointRT dataPoint) {
        super.removeDataPoint(dataPoint);
        pointXids.remove(dataPoint.getVO().getXid());
    }

    public void run() {
        try {
            while (serverSocket != null) {
                try {
                    Socket socket = serverSocket.accept();
                    log.info("Received socket from " + socket.getRemoteSocketAddress());
                    ConnectionHandler ch = new ConnectionHandler(socket);
                    connectionHandlers.add(ch);
                    Common.timer.execute(ch);
                }
                catch (SocketTimeoutException e) {
                    // no op
                }
            }
        }
        catch (IOException e) {
            // ignore
        }
    }

    class ConnectionHandler implements Runnable {
        private final Socket socket;
        private InputStream in;
        private OutputStream out;
        private final ByteQueue writeBuffer = new ByteQueue();
        private final List<String> indexedXids = new ArrayList<String>();
        final PointValueDao pointValueDao = new PointValueDao();

        public ConnectionHandler(Socket socket) {
            this.socket = socket;
        }

        public void run() {
            try {
                runImpl();
            }
            catch (IOException e) {
                log.warn("Connection handler exception", e);
            }
            catch (PersistentProtocolException e) {
                try {
                    Packet.pushString(writeBuffer, e.getMessage());
                    Packet.writePacket(out, Packet.ABORT, writeBuffer);
                    log.warn("Connection handler exception", e);
                    sleepImpl();
                }
                catch (IOException e1) {
                    log.warn("Connection handler exception", e1);
                }
            }
            catch (DoAbortException e) {
                try {
                    Packet.pushString(writeBuffer, e.getLocalizableMessage().serialize());
                    Packet.writePacket(out, Packet.ABORT, writeBuffer);
                    sleepImpl();
                }
                catch (IOException e1) {
                    log.warn("Connection handler exception", e1);
                }
            }
            catch (PersistentAbortException e) {
                log.warn("Connection handler exception", e);
            }
            finally {
                connectionHandlers.remove(this);
                try {
                    socket.close();
                }
                catch (IOException e) {
                    log.warn("Connection handler exception", e);
                }
            }
        }

        private void sleepImpl() {
            try {
                Thread.sleep(5000);
            }
            catch (InterruptedException e1) {
                // no op
            }
        }

        private void runImpl() throws IOException, PersistentProtocolException, PersistentAbortException,
                DoAbortException {
            socket.setSoTimeout(5000);
            in = socket.getInputStream();
            out = socket.getOutputStream();

            //
            // Version
            Packet packet = Packet.readPacket(in);
            if (packet.getType() != Packet.VERSION)
                throw new PersistentProtocolException("Expected version, got " + packet.getType());
            if (packet.getPayload().pop() != 1)
                throw new PersistentProtocolException("Expected version 1, got something else");
            packet.release();

            // Version response
            Packet.writePacket(out, Packet.VERSION, Packet.ONE);

            //
            // Authentication key
            packet = Packet.readPacket(in);
            if (packet.getType() != Packet.AUTH_KEY)
                throw new PersistentProtocolException("Expected auth key, got " + packet.getType());
            String authKey = packet.popString();
            if (!authKey.equals(vo.getAuthorizationKey()))
                throw new DoAbortException(new LocalizableMessage("event.persistent.authKey"));
            packet.release();

            // Authentication key response
            Packet.writePacket(out, Packet.AUTH_KEY, Packet.EMPTY);

            //
            // Points
            while (true) {
                packet = Packet.readPacket(in);
                try {
                    if (packet.getType() != Packet.POINT)
                        throw new PersistentProtocolException("Expected points, got " + packet.getType());

                    if (packet.getPayload().size() == 0)
                        // The end
                        break;

                    String xid = packet.popString();
                    indexedXids.add(xid);
                    ensurePoint(xid, packet.getPayload().popAll());
                    Packet.writePacket(out, Packet.POINT, Packet.EMPTY);
                }
                finally {
                    packet.release();
                }
            }

            // Points response
            Packet.writePacket(out, Packet.POINT, Packet.EMPTY);

            //
            // Data
            ByteQueue payload;
            DataPointRT point;
            int dataType;
            MangoValue value;
            int imageType;
            byte[] imageData;
            long time;

            while (serverSocket != null) {
                try {
                    packet = Packet.readPacket(in);
                }
                catch (SocketTimeoutException e) {
                    continue;
                }

                try {
                    if (packet.getType() == Packet.CLOSE)
                        break;

                    if (packet.getType() == Packet.TEST)
                        continue;

                    if (packet.getType() == Packet.RANGE_COUNT) {
                        Common.timer.execute(new RangeCountHandler(packet, out));
                        continue;
                    }

                    if (packet.getType() == Packet.POINT_UPDATE) {
                        int index = packet.getPayload().popU2B();
                        ensurePoint(indexedXids.get(index), packet.getPayload().popAll());
                        continue;
                    }

                    if (packet.getType() != Packet.DATA)
                        throw new PersistentProtocolException("Expected data, got " + packet.getType());

                    payload = packet.getPayload();
                    point = getIndexedPoint(payload.popU2B());
                    if (point == null)
                        // Point is not enabled.
                        continue;

                    dataType = payload.popU1B();
                    switch (dataType) {
                    case 1:
                        value = new BinaryValue(payload.pop() != 0);
                        break;
                    case 2:
                        value = new MultistateValue(payload.popS4B());
                        break;
                    case 3:
                        value = new NumericValue(packet.popDouble());
                        break;
                    case 4:
                        value = new AlphanumericValue(packet.popString());
                        break;
                    case 5:
                        imageType = payload.popS4B();
                        imageData = new byte[payload.popS4B()];
                        payload.pop(imageData);
                        value = new ImageValue(imageData, imageType);
                        break;
                    default:
                        throw new PersistentProtocolException("Unknown data type: " + dataType);
                    }

                    time = packet.popLong();

                    // Save the value.
                    point.updatePointValue(new PointValueTime(value, time));
                }
                finally {
                    packet.release();
                }
            }
        }

        private DataPointVO unserialize(byte[] serializedData) throws DoAbortException {
            try {
                return (DataPointVO) SerializationHelper.readObjectFromArray(serializedData);
            }
            catch (Exception e) {
                throw new DoAbortException(new LocalizableMessage("event.persistent.pointDeserialization",
                        e.getMessage()));
            }
        }

        private void ensurePoint(String xid, byte[] serializedData) throws DoAbortException {
            DataPointVO newDpvo = unserialize(serializedData);

            // Check if the point is already in the list of loaded points.
            DataPointRT dprt = pointXids.get(xid);

            if (dprt != null) {
                // Already exists. Check that the data types match.
                if (dprt.getVO().getPointLocator().getDataTypeId() != newDpvo.getPointLocator().getDataTypeId()) {
                    // Data type mismatch. Abort
                    LocalizableMessage lm = new LocalizableMessage("event.persistent.dataTypeMismatch", xid,
                            newDpvo.getDataTypeMessage(), dprt.getVO().getDataTypeMessage());
                    throw new DoAbortException(lm);
                }

                // We're good.
                updatePoint(dprt.getVO(), newDpvo);
                return;
            }

            // Doesn't exist in the RT list. Check if it exists at all.
            DataPointVO oldDpvo = new DataPointDao().getDataPoint(xid);

            if (oldDpvo != null) {
                // The point exists. Make sure it belongs to this data source.
                if (oldDpvo.getDataSourceId() != vo.getId())
                    // Wrong data source.
                    throw new DoAbortException(new LocalizableMessage("event.persistent.dataSourceMismatch", xid));

                // The point is disabled (because otherwise it would be in the RT list).
                updatePoint(oldDpvo, newDpvo);
            }
            else {
                // The point does not exist. Create it.
                newDpvo.setId(Common.NEW_ID);
                newDpvo.setXid(xid);
                newDpvo.setDataSourceId(vo.getId());
                newDpvo.setEnabled(true);
                newDpvo.setPointFolderId(0);
                newDpvo.setEventDetectors(new ArrayList<PointEventDetectorVO>());
                newDpvo.setLoggingType(DataPointVO.LoggingTypes.ALL);
                PersistentPointLocatorVO locator = new PersistentPointLocatorVO();
                locator.setDataTypeId(newDpvo.getPointLocator().getDataTypeId());
                newDpvo.setPointLocator(locator);
                Common.ctx.getRuntimeManager().saveDataPoint(newDpvo);
            }
        }

        private void updatePoint(DataPointVO oldDpvo, DataPointVO newDpvo) {
            if (PersistentDataSourceRT.this.vo.isAcceptPointUpdates()) {
                boolean changed = false;

                // Check the name
                if (!StringUtils.isEqual(oldDpvo.getName(), newDpvo.getName())) {
                    oldDpvo.setName(newDpvo.getName());
                    changed = true;
                }
                // ... and the engineering unit
                else if (oldDpvo.getEngineeringUnits() != newDpvo.getEngineeringUnits()) {
                    oldDpvo.setEngineeringUnits(newDpvo.getEngineeringUnits());
                    changed = true;
                }

                // The only other attribute we might be interested in updating are the text renderer and the 
                // chart renderer. Maybe later.

                if (changed)
                    Common.ctx.getRuntimeManager().saveDataPoint(oldDpvo);
            }
        }

        DataPointRT getIndexedPoint(int index) {
            try {
                return pointXids.get(indexedXids.get(index));
            }
            catch (IndexOutOfBoundsException e) {
                log.error("Received invalid point index: " + index);
                return null;
            }
        }

        class RangeCountHandler implements Runnable {
            private final int requestId;
            private final int index;
            private final long from;
            private final long to;
            private final OutputStream out;

            RangeCountHandler(Packet packet, OutputStream out) {
                requestId = packet.getPayload().popU3B();
                index = packet.getPayload().popU2B();
                from = packet.popLong();
                to = packet.popLong();
                this.out = out;
            }

            public void run() {
                long result;

                DataPointRT dprt = getIndexedPoint(index);
                if (dprt == null)
                    result = -1;
                else {
                    result = pointValueDao.dateRangeCount(dprt.getId(), from, to);
                }

                ByteQueue queue = new ByteQueue();
                queue.pushU3B(requestId);
                Packet.pushLong(queue, result);

                try {
                    synchronized (out) {
                        Packet.writePacket(out, Packet.RANGE_COUNT, queue);
                    }
                }
                catch (IOException e) {
                    // no op
                }
            }
        }
    }
}
