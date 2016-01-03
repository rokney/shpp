import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 *
 */
public class HTTPClient {
    public static void main(String[] args) {
        if(args.length != 1){
            System.out.println("usage: java HTTPClient url");
            return;
        }
        try{
            URL url = new URL(args[0]);
            HttpURLConnection conect = (HttpURLConnection)url.openConnection();
            conect.setDoInput(true);
            conect.setDoOutput(true);
            conect.setRequestMethod("POST");
            conect.setUseCaches(true);
            String message = "Hello";
            byte[] sendData = message.getBytes();
            conect.setRequestProperty("Content-length", String.valueOf(sendData.length));
            conect.setRequestProperty("Content-type", "text/html");
            OutputStream out = conect.getOutputStream();
            out.write(sendData);
            out.flush();
            out.close();
            System.out.println("Method: " + conect.getRequestMethod());
            System.out.println("Code: " + conect.getResponseCode());
            System.out.println("Message: " + conect.getResponseMessage());
            conect.disconnect();
        }catch(Exception e){
            System.out.println(e);
        }
    }
}
