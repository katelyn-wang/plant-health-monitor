#include <ArduinoJson.h>
#include <WiFi.h>
#include <HttpClient.h>
#include "nvs.h"
#include "nvs_flash.h"
#include "DHT20.h"

#define BLUE_PIN 33   // moisture
#define RED_PIN 25    // temperature
#define GREEN_PIN 26 // humidity

/* 
 * ADD THE SERVER'S IP ADDRESS HERE!
 */
const char* serverIP =   // "xxx.xxx.xxx.xxx"; 

char ssid[50]; // your network SSID (name)
char pass[50]; // your network password (use for WPA, or use as key for WEP)

const int soilMoisturePin = A0;
int soilMoistureValue;
float moisture;

// const int uvSensorPin = A0; // change pin
// int uvSensorValue;
// float uvIndex;

DHT20 DHT;
float temp;
float humidity;

// Number of milliseconds to wait without receiving any data before we give up
const int kNetworkTimeout = 30 * 1000;
// Number of milliseconds to wait if no data is available before trying again
const int kNetworkDelay = 1000;

// Values for the ideal sensor ranges
float minMoisture = 20;
float maxMoisture = 40;
float minTemp = 20;
float maxTemp = 29;
float minHumidity = 40;
float maxHumidity = 60;

void nvs_access()
{
  // Initialize NVS
  esp_err_t err = nvs_flash_init();
  if (err == ESP_ERR_NVS_NO_FREE_PAGES ||
      err == ESP_ERR_NVS_NEW_VERSION_FOUND)
  {
    // NVS partition was truncated and needs to be erased
    // Retry nvs_flash_init
    ESP_ERROR_CHECK(nvs_flash_erase());
    err = nvs_flash_init();
  }
  ESP_ERROR_CHECK(err);
  // Open
  Serial.printf("\n");
  Serial.printf("Opening Non-Volatile Storage (NVS) handle... ");
  nvs_handle_t my_handle;
  err = nvs_open("storage", NVS_READWRITE, &my_handle);
  if (err != ESP_OK)
  {
    Serial.printf("Error (%s) opening NVS handle!\n", esp_err_to_name(err));
  }
  else
  {
    Serial.printf("Done\n");
    Serial.printf("Retrieving SSID/PASSWD\n");
    size_t ssid_len;
    size_t pass_len;
    err = nvs_get_str(my_handle, "ssid", ssid, &ssid_len);
    err |= nvs_get_str(my_handle, "pass", pass, &pass_len);
    switch (err)
    {
    case ESP_OK:

      Serial.printf("Done\n");
      // Serial.printf("SSID = %s\n", ssid);
      // Serial.printf("PASSWD = %s\n", pass);
      break;
    case ESP_ERR_NVS_NOT_FOUND:
      Serial.printf("The value is not initialized yet!\n");
      break;
    default:
      Serial.printf("Error (%s) reading!\n", esp_err_to_name(err));
    }
  }
  // Close
  nvs_close(my_handle);
}

void setup()
{
  // put your setup code here, to run once:
  Serial.begin(9600);

  delay(1000);
  // Retrieve SSID/PASSWD from flash before anything else
  nvs_access();
  // We start by connecting to a WiFi network
  delay(1000);
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, pass);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.println("MAC address: ");
  Serial.println(WiFi.macAddress());

  pinMode(BLUE_PIN, OUTPUT);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);

  // Set up temp/humidity sensor
  Wire.begin(); //  ESP32 default pins 21 22
  if (!DHT.begin())
  {
    Serial.println("Couldn't find DHT20 sensor");
    while (1)
      ;
  }
  Serial.println("DHT20 sensor initialized");
}

void loop()
{
  int err = 0;
  WiFiClient c;
  HttpClient http(c);
  String jsonResponse = "";

  // GET request to /sensor-ranges to update the min and max sensor values
  if (WiFi.status() == WL_CONNECTED) {
    err = 0;
    err = http.get(serverIP, 3000, "/sensor-ranges", NULL);

    if (err == 0)
    {
      Serial.println("startedRequest ok");
      err = http.responseStatusCode();
      if (err >= 0)
      {
        Serial.print("Got status code: ");
        Serial.println(err);
        // Usually you'd check that the response code is 200 or a
        // similar "success" code (200-299) before carrying on,
        // but we'll print out whatever response we get
        err = http.skipResponseHeaders();
        if (err >= 0)
        {
          int bodyLen = http.contentLength();
          Serial.print("Content length is: ");
          Serial.println(bodyLen);
          Serial.println();
          Serial.println("Body returned follows:");
          // Now we've got to the body, so we can print it out
          unsigned long timeoutStart = millis();
          char c;
          // Whilst we haven't timed out & haven't reached the end of the body
          while ((http.connected() || http.available()) &&
                ((millis() - timeoutStart) < kNetworkTimeout))
          {
            if (http.available())
            {
              c = http.read();
              jsonResponse += c;
              // Print out this character
              Serial.print(c);
              bodyLen--;
              // We read something, reset the timeout counter
              timeoutStart = millis();
            }
            else
            {
              // We haven't got any data, so let's pause to allow some to arrive
              delay(kNetworkDelay);
            }
          }

          Serial.println();

          // Parse the JSON to extract min and max values for sensor ranges
          StaticJsonDocument<256> doc;
          DeserializationError error = deserializeJson(doc, jsonResponse);

          if (error) {
            Serial.print("Failed to parse JSON: ");
            Serial.println(error.c_str());
          }
          else {
            // Update the min and max values
            minMoisture = atof(doc["moisture"]["min"]);
            maxMoisture = atof(doc["moisture"]["max"]);
            minTemp = atof(doc["temperature"]["min"]);
            maxTemp = atof(doc["temperature"]["max"]);
            minHumidity = atof(doc["humidity"]["min"]);
            maxHumidity = atof(doc["humidity"]["max"]);
          }

        }
        else
        {
          Serial.print("Failed to skip response headers: ");
          Serial.println(err);
        }
      }
      else
      {
        Serial.print("Getting response failed: ");
        Serial.println(err);
      }
    }
    else
    {
      Serial.print("Connect failed: ");
      Serial.println(err);
    }
    http.stop();

    Serial.println();

  }


  // Read the moisture, temperature, and humidity data from the sensors

  soilMoistureValue = analogRead(soilMoisturePin);
  moisture = 100 - ((soilMoistureValue / 4095.00) * 100);

  Serial.print("Moisture: ");
  Serial.print(moisture);
  Serial.println("%");

  // uvSensorValue = analogRead(uvSensorPin);
  // Serial.println(uvSensorValue);
  // uvIndex = uvSensorValue * (3.3 / 1023); // change 3.3 to 5 if voltage is different

  // Serial.print("UV Index: ");
  // Serial.println(uvIndex);

  DHT.read();
  temp = static_cast<float>(DHT.getTemperature());
  humidity = static_cast<float>(DHT.getHumidity());

  Serial.print("Temperature: ");
  Serial.print(temp, 1);
  Serial.println(" Celsius");
  Serial.print("Humidity: ");
  Serial.print(humidity, 1);
  Serial.println();

  // If moisture is out of the ideal range, light up the Blue LED
  if (moisture < minMoisture || moisture > maxMoisture) {
    digitalWrite(BLUE_PIN, HIGH);
  }
  else {
    digitalWrite(BLUE_PIN, LOW);
  }

  // If temperature is out of the ideal range, light up the Red LED
  if (temp < minTemp || temp > maxTemp){
    digitalWrite(RED_PIN, HIGH);
  }
  else {
    digitalWrite(RED_PIN, LOW);
  }

  // If humidity is out of the ideal range, light up the Green LED
  if (humidity < minHumidity || humidity > maxHumidity) {
    digitalWrite(GREEN_PIN, HIGH);
  }
  else {
    digitalWrite(GREEN_PIN, LOW);
  }


  // Send sensor data to the backend server

  if (WiFi.status() == WL_CONNECTED) 
  {
    String params = "/sensor-data?moisture=" 
      + String(moisture) + "&temperature=" + String(DHT.getTemperature()) 
      + "&humidity=" + String(DHT.getHumidity());
    
    err = 0;

    err = http.get(serverIP, 3000, params.c_str(), NULL);
    
    if (err == 0)
    {
      Serial.println("startedRequest ok");
      err = http.responseStatusCode();
      if (err >= 0)
      {
        Serial.print("Got status code: ");
        Serial.println(err);
        // Usually you'd check that the response code is 200 or a
        // similar "success" code (200-299) before carrying on,
        // but we'll print out whatever response we get
        err = http.skipResponseHeaders();
        if (err >= 0)
        {
          int bodyLen = http.contentLength();
          Serial.print("Content length is: ");
          Serial.println(bodyLen);
          Serial.println();
          Serial.println("Body returned follows:");
          // Now we've got to the body, so we can print it out
          unsigned long timeoutStart = millis();
          char c;
          // Whilst we haven't timed out & haven't reached the end of the body
          while ((http.connected() || http.available()) &&
                ((millis() - timeoutStart) < kNetworkTimeout))
          {
            if (http.available())
            {
              c = http.read();
              // Print out this character
              Serial.print(c);
              bodyLen--;
              // We read something, reset the timeout counter
              timeoutStart = millis();
            }
            else
            {
              // We haven't got any data, so let's pause to allow some to arrive
              delay(kNetworkDelay);
            }
          }
        }
        else
        {
          Serial.print("Failed to skip response headers: ");
          Serial.println(err);
        }
      }
      else
      {
        Serial.print("Getting response failed: ");
        Serial.println(err);
      }
    }
    else
    {
      Serial.print("Connect failed: ");
      Serial.println(err);
    }
    http.stop();
  }

  Serial.println();
  delay(2000);

}
