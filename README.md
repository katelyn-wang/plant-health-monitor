# THRIVE - The Plant Health Monitor

### Created by Katelyn Wang and Kyle Reid
*Project in IoT (CS 147), Fall 2024*

An IoT system and application that collects soil moisture, temperature, and humidity data from your plant and notifies when your plant needs care.

## Frontend
Contains the frontend code for the application. The app is created using **React Native** with an **Express.js** server.

### Setup
1. Navigate to the `Frontend/` folder.
2. Run `npm install` or `yarn install` to install dependences for the **app**.
3. Navigate to the `Frontend/server` folder.
4. Run `npm install` or `yarn install` to install dependencies for the **server**.
5. **Change the server IP address** in `Frontend/constants.ts` to the IP address of where your server is hosted (ex. AWS instance public IP)

### To Run
1. In `Frontend/` start the React Native application on web or mobile

   - Web: run the command below to open the app on `http://{FRONTEND_IP}:8081` with FRONTEND_IP as wherever you're running the app (ex. AWS instance IP or localhost): 
   ```
   npm run start
   ```
   - Mobile: download the Expo Go app on iOS or Android, run the command below in `Frontend/`, and scan the QR code in the terminal to open the app on your phone:
   ```
   npx expo start
   ```

2. In a separate terminal where your server is hosted, navigate to `Frontend/server` and run this to start the server on port 3000:
   ```
   node server.js
   ```

3. To test sending data, send a GET request in your browser using `http://{SERVER_IP}:3000/sensor-data?moisture=12&temperature=34&humidity=56` and check the React Native app to see if the values are displayed.

4. To test setting sensor ranges, send a POST request with min and max values for the different sensors:
   ```
   curl -X POST -H "Content-Type: application/json" -d '{"moisture": { "min": "20", "max":"40"}, "temperature": {"min": "20", "max": "40"}, "humidity": {"min":"40", "max":"60"}}' http://{SERVER_IP}:3000/update-sensor-ranges
   ```

NOTE: Replace `{SERVER_IP}` with the the IP of where your server is hosted (ex. AWS instance or localhost).

## PlatformIO
Contains the embedded code for the hardware that collects soil moisture, temperature, and humidity data from the plant and sends it to the server.

### Hardware Parts / Setup
- Soil Moisture Sensor
   - [Amazon - HiLetgo Arduino Soil Moisture Sensor](https://www.amazon.com/HiLetgo-Moisture-Automatic-Watering-Arduino)
   - Connected to A0 (pin 36)
- Humidity and Temperature Sensor
   - [Sparkfun DHT20](https://www.sparkfun.com/products/18364)
   - Standard I2C Protocol ([datasheet](https://cdn.sparkfun.com/assets/8/a/1/5/0/DHT20.pdf))
- Three LEDs
   - Blue LED (moisture) - pin 33
   - Red LED (temperature) - pin 25
   - Green LED (humidity) - pin 26
- ESP32 - LilyGO TTGO
   - [Amazon LILYGO ESP32](https://www.amazon.com/LILYGO-T-Display-Arduino-Development-CH9102F/dp/B099MPFJ9M/?th=1)

### Code Setup
1. Write the SSID and password for your Wifi/hotspot to the ESP32.
2. Navigate to the `platformio/` project folder using the PlatformIO extention in VSCode.
3. Make sure the dependencies in platformio.ini are installed.
4. ❗**Add the server's IP address to the code at the top of** `src/main.cpp`. 

### To Run
1. Build the project.
2. Upload to the ESP32.
3. Run the project (serial monitor).
