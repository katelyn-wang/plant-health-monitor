import { Text, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from 'react';

// Define the type for the sensor data
type SensorData = {
    moisture: number;
    temperature: number;
    humidity: number;
};

export default function Index() {

  const [sensorData, setSensorData] = useState<SensorData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/sensor-data');
                const data: SensorData = await response.json();
                console.log("Data received in fetchData:", data);
                setSensorData(data);
            } catch (error) {
                console.error('Error fetching sensor data:', error);
            }
        };

        // Fetch data every 5 seconds
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
              Thrive! - The Plant Health Monitor
            </Text>
            <Text style={styles.text}>
                Moisture: {sensorData?.moisture ?? 'Loading...'}
            </Text>
            <Text style={styles.text}>
                Temperature: {sensorData?.temperature ?? 'Loading...'}
            </Text>
            <Text style={styles.text}>
                Humidity: {sensorData?.humidity ?? 'Loading...'}
            </Text>
        </View>
    );

}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  text: {
      fontSize: 20,
      marginBottom: 10,
  },
});
