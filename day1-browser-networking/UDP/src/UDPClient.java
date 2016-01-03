import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.charset.Charset;

/**
 * Simple UDP Client
 */
public class UDPClient {
    private final static int PACKET_SIZE = 256;

    public static void main(String[] args){
        if(args.length != 2){
            System.out.println("usage: java UDPClient host port");
            return;
        }
        try{
            DatagramSocket socket = new DatagramSocket();
            InetAddress IPAddress = InetAddress.getByName(args[0]);
            int port = Integer.parseInt(args[1]);
            byte[] sendData = getData();
            byte[] receiveData = new byte[PACKET_SIZE];

            DatagramPacket sendPacket = new DatagramPacket(sendData, sendData.length, IPAddress, port);
            socket.send(sendPacket);

            DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
            socket.receive(receivePacket);

            System.out.println("From Server: " + new String(sendPacket.getData()));
            socket.close();
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public static byte [] getData() throws IOException{
        System.out.print("Enter a message: ");
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        return reader.readLine().getBytes();
    }
}
