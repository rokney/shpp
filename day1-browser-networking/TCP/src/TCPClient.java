import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetAddress;
import java.net.Socket;

/**
 * Simple TCP Client
 */
public class TCPClient {
    public static void main(String[] args) {
        if(args.length != 2){
            System.out.println("usage: java TCPClient host port");
            return;
        }
        try{
            InetAddress IPAddress = InetAddress.getByName(args[0]);
            int port = Integer.parseInt(args[1]);
            Socket socket = new Socket(IPAddress, port);
            String message = getLine();
            sendMessageToServer(socket, message);
            getMessageFromServerAndDisplay(socket);
            socket.close();
        }catch(Exception e){
            System.out.println(e);
        }
    }

    public static String getLine() throws IOException {
        System.out.print("Enter a message: ");
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        return reader.readLine();
    }

    public static void sendMessageToServer(Socket socket, String message) throws IOException {
        DataOutputStream sendToServer = new DataOutputStream(socket.getOutputStream());
        sendToServer.writeBytes(message + '\n');
        sendToServer.flush();
    }

    public static void getMessageFromServerAndDisplay(Socket socket) throws IOException {
        BufferedReader receiveFromServer = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        System.out.println("From server: " + receiveFromServer.readLine());
    }
}
