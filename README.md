# THRIVE - The Plant Health Monitor

### Created by Katelyn Wang and Kyle Reid
*Project in IoT (CS 147), Fall 2024*

An IoT system and application that collects soil moisture, temperature, and humidity data from your plant and notifies when your plant needs care.

## Frontend
Contains the frontend code for the application. The app is created using **React Native** with an **Express.js** server.

### Setup
1. Navigate to the `Frontend/` folder.
2. Run `npm install` or `yarn install` to install dependences for the app.
3. Navigate to the `Frontend/server` folder.
4. Run `npm install` or `yarn install` to install dependencies for the server.

### To Run
1. In `Frontend/` run this to start the React Native application on http://localhost:8081:
   ```
   npm run start
   ```
2. In a separate terminal, navigate to `Frontend/server` and run this to start the server on port 3000:
   ```
   node server.js
   ```

3. To test sending data, send a GET request in your browser using http://localhost:3000/sensor-data?moisture=12&temperature=34&humidity=56 and check the React Native app to see if the values are displayed.

## PlatformIO
Contains the embedded code for the hardware that collects soil moisture, temperature, and humidity data from the plant and sends it to the server.

### Setup
1. Navigate to the `platformio/` folder.
2. Make sure the dependencies in platformio.ini are installed.
3. Add the server's IP address to the code in `src/main.cpp`.

### To Run
1. Build the project.
2. Upload to the ESP32.
3. Run the project (serial monitor).
