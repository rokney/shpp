import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;

/**
 *
*/
public class HTTPServer {
    public static void main(String[] args) {
        if(args.length != 1){
            System.out.println("usage: java HTTPServer port");
            return;
        }
        try{
            int port = Integer.parseInt(args[0]);
            ServerSocket serverSocket = new ServerSocket(port);
            System.out.println("Server is started...");
            while(true){
                Socket socket = serverSocket.accept();
                BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                String temp;
                while((temp = reader.readLine())!= null) {
                    if(temp.isEmpty()){
                        break;
                    }
                    System.out.println(temp);
                }
                socket.close();
                System.out.println("Close connection...");
            }
        }catch(Exception e){
            System.out.println(e);
        }
    }
}

