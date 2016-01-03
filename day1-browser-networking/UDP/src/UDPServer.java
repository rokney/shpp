import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.nio.charset.Charset;
import java.util.Date;
import java.util.logging.Logger;

/**
 * Simple UDP Server
 */
public class UDPServer {
    private final static int PACKET_SIZE = 256;
    private static Logger log = Logger.getLogger(UDPServer.class.getName());

    public static void main(String[] args) throws IOException{
        if(args.length != 1){
            System.out.println("usage: java UDPServer port");
            return;
        }
        try {
            int port = Integer.parseInt(args[0]);
            DatagramSocket socket = new DatagramSocket(port);
            System.out.println("The server has started....");
            while (true) {
                byte[] receiveData = new byte[PACKET_SIZE];
                DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
                socket.receive(receivePacket);
                displayInfo(receivePacket);
                socket.send(receivePacket);

                log.info("Close connection");
            }
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public static void displayInfo(DatagramPacket packet){
        System.out.println("Received: ");
        System.out.println("IP Address: " + packet.getAddress());
        System.out.println("Port: " + packet.getPort());
        System.out.println("Date: " + new Date());
        System.out.println("Message: "+ new String(packet.getData()));
    }
}
