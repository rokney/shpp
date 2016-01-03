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
                DataOutputStream out = new DataOutputStream(socket.getOutputStream());
                String temp;
                while((temp = reader.readLine())!= null) {
                    System.out.println(temp);
                    if(temp.isEmpty()){
                        break;
                    }
                }
                out.writeBytes("HTTP/1.0 200 OK");
                out.writeBytes("Content-Type: text/html");
                out.writeBytes("Server: Test");
                out.writeBytes("");
                out.writeBytes("<H1>Welcome to the temporary HTTP-server</H1>");

                out.flush();
                socket.close();
            }
        }catch(Exception e){
            System.out.println(e);
        }
    }
}

