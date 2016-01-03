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
            conect.setDoOutput(true);
            conect.setDoInput(true);
            conect.setRequestMethod("POST");
            conect.setUseCaches(false);
            String message = "Hello";
            byte[] sendData = message.getBytes();
            conect.setRequestProperty("Content-length", String.valueOf(sendData.length));
            conect.setRequestProperty("Content-type", "text/html");
            OutputStream out = conect.getOutputStream();
            out.write(sendData);
            out.flush();
            BufferedReader in = new BufferedReader(new InputStreamReader(conect.getInputStream()));
            String result;
            while((result = in.readLine()) != null){
                System.out.println(result);
                if(result.isEmpty()){
                    break;
                }
            }
            conect.disconnect();
        }catch(Exception e){
            System.out.println(e);
        }
    }
}
