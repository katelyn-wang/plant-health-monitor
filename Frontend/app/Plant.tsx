import { Text, View, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import { ValuesContext } from './ValuesContext'; // Import the context
import { LineChart } from 'react-native-chart-kit';
import { SERVER_IP } from "@/constants";

// Define the type for the sensor data
type SensorData = {
    moisture: number;
    temperature: number;
    humidity: number;
};


export default function Plant() {


    const {moistureRange, temperatureRange, humidityRange} = useContext(ValuesContext)!;
    const [min_moisture, max_moisture] = moistureRange.split(',').map(Number);
    const [min_temperature, max_temperature] = temperatureRange.split(',').map(Number);
    const [min_humidity, max_humidity] = humidityRange.split(',').map(Number);

    const [sensorData, setSensorData] = useState<SensorData | null>(null);

    const [tempdataList, settempDataList] = useState<number[]>([]);
    const [moistdataList, setmoistDataList] = useState<number[]>([]);
    const [humiddataList, sethumidDataList] = useState<number[]>([]);


    const screenWidth = Dimensions.get('window').width
    const tempdata = {
        labels: ['Time'],
        datasets: [{
          data: tempdataList,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 2
          
        }]
    }
    const moistdata = {
        labels: ['Time'],
        datasets: [{
          data: moistdataList,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 2
          
        }]
    }
    const humiddata = {
        labels: ['Time'],
        datasets: [{
          data: humiddataList,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          strokeWidth: 2
          
        }]
    }


    const chartConfig = {
        backgroundGradientFrom: '#d4a15f',
        backgroundGradientTo: '#f5d5a2',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2
    }

    const createwarning = (text: string) => (
        <View style={styles.warning}>
          <Text style={styles.warningText}>{text}</Text>
        </View>
    );



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://${SERVER_IP}:3000/sensor-data`);
                const data: SensorData = await response.json();
                console.log("Data received in fetchData:", data);
                
                if (data?.temperature === undefined || data?.temperature === null) {
                    console.log("Received null data");
                    return; // Ensure temperature exists
                }

                setSensorData(data);
    
                settempDataList((prevList) => {
                const updatedList = [...prevList, data?.temperature]; // Add new value
                if (updatedList.length > 6) {
                    updatedList.shift(); // Remove the oldest value if the list exceeds 6
                }
                //console.log(updatedList);
                return updatedList;
                });

                sethumidDataList((prevList) => {
                const updatedList = [...prevList, data?.humidity]; // Add new value
                if (updatedList.length > 6) {
                    updatedList.shift(); // Remove the oldest value if the list exceeds 6
                }
                //console.log(updatedList);
                return updatedList;
                });

                setmoistDataList((prevList) => {
                const updatedList = [...prevList, data?.moisture]; // Add new value
                if (updatedList.length > 6) {
                    updatedList.shift(); // Remove the oldest value if the list exceeds 6
                }
                //console.log(updatedList);
                return updatedList;
                });

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
            <ScrollView>
            {moistureRange != "" && temperatureRange != "" && humidityRange != "" ? (
                <View style = {styles.container}>
                    <Image style = {styles.plantImage} source={require('@/assets/images/basic_plant.png')}/>

                    <Text style={styles.moist_text}>
                        Moisture: {sensorData?.moisture ?? 'Loading...'}%
                    </Text>
                    {max_moisture < (sensorData?.moisture ?? -Infinity) && createwarning(`Warning: Moisture exceeds ideal max (${max_moisture}%)`)}
                    {min_moisture > (sensorData?.moisture ?? Infinity) && createwarning(`Warning: Moisture below ideal min (${min_moisture})%`)} 
                    
                    <Text style={styles.temp_text}>
                            Temperature: {sensorData?.temperature ?? 'Loading...'}°C
                        </Text>
                    {max_temperature < (sensorData?.temperature ?? -Infinity) && createwarning(`Warning: Temperature exceeds ideal max (${max_temperature}°C)`)}
                    {min_temperature > (sensorData?.temperature ?? Infinity) && createwarning(`Warning: Temperature below ideal min (${min_temperature}°C)`)}
                    
                    <Text style={styles.humid_text}>
                            Humidity: {sensorData?.humidity ?? 'Loading...'}%
                    </Text>
                    {max_humidity < (sensorData?.humidity ?? -Infinity) && createwarning(`Warning: Humidity exceeds ideal max (${max_humidity}%)`)}
                    {min_humidity > (sensorData?.humidity ?? Infinity) && createwarning(`Warning: Humidity below ideal min (${min_humidity}%)`)}
                    

                    {/* Only Render the plots if data has been received */}
                    {sensorData && (
                    <View>
                        <View style = {{marginTop: 20}}>
                            <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>Moisture</Text>
                            <LineChart
                                key = "moisture"
                                data={moistdata}
                                width={screenWidth}
                                height={220}
                                chartConfig={chartConfig}
                                yAxisSuffix="°C"
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                }}
                            />
                        </View>
                        
                        <View style = {{marginTop: 20}}>
                            <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>Temperature</Text>
                            <LineChart
                                key = "temperature"
                                data={tempdata}
                                width={screenWidth}
                                height={220}
                                chartConfig={chartConfig}
                                yAxisSuffix="°C"
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                }}
                            />
                        </View>

                        <View style = {{marginTop: 20}}>
                            <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>Humidity</Text>
                            <LineChart
                                key = "humidity"
                                data={humiddata}
                                width={screenWidth}
                                height={220}
                                chartConfig={chartConfig}
                                yAxisSuffix="°C"
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                }}
                            />
                        </View>
                    </View>
                    )}


                </View>


            ) : (
                <Text style = {styles.message}>Start inputting values to get started</Text>
            )}
            </ScrollView>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f9f1c8',
        
    },
    moist_text: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#49a3c4',
        marginBottom: 10,
        textAlign: 'left'
    },
    temp_text: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#c61b48',
        marginTop: 10,
        textAlign: 'left'
    },
    humid_text: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#57a630',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'left'
    },
    warning: {
        backgroundColor: 'red', 
        padding: 10,
        borderRadius: 5, 
        marginBottom: 10, 
        alignSelf: 'stretch', 
    },
    warningText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    text: {
      fontSize: 20,
      marginBottom: 10,
    },
    message: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "#155d37"
    },
    plantImage: {
        width: 250,
        height: 250, 
        resizeMode: 'contain',
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 20,
        
    }
});
