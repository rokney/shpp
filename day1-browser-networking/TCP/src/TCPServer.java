import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Date;
import java.util.logging.Logger;

/**
 * Simple TCP server
 */
public class TCPServer implements Runnable{
    private static Logger log = Logger.getLogger(TCPServer.class.getName());

    Socket socket;
    TCPServer(Socket socket){
        this.socket = socket;
    }

    public static void main(String[] args) {
        if(args.length != 1){
            System.out.println("usage: java TCPServer port");
            return;
        }
        try{
            int port = Integer.parseInt(args[0]);
            ServerSocket serverSocket = new ServerSocket(port);
            System.out.println("Server is started. Waiting for a client...");
            while(true) {
                Socket socket = serverSocket.accept();
                displayInfo(socket);
                new Thread(new TCPServer(socket)).start();
            }
        }catch (Exception e){
            System.out.println(e);
        }
    }

    public static void displayInfo(Socket socket){
        System.out.println("Got a client...");
        System.out.println("Address: " + socket.getInetAddress());
        System.out.println("Port: " + socket.getPort());
        System.out.println("Date: " + new Date());
    }

    public static void displayInfo(String message){
        System.out.println("Message: " + message);
    }

    public static String getMessage(Socket socket) throws IOException {
        BufferedReader receiveFromClient = new BufferedReader(new InputStreamReader(socket.getInputStream()));
        return receiveFromClient.readLine();
    }

    public static void sendMessageToClient(Socket socket, String message) throws IOException {
        DataOutputStream sendToClient = new DataOutputStream(socket.getOutputStream());
        sendToClient.writeBytes(message);
        sendToClient.flush();
    }

    @Override
    public void run() {
        String message = null;
        try {
            message = getMessage(socket);
            displayInfo(message);
            sendMessageToClient(socket, message);
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        log.info("Close connection...");
    }
}
