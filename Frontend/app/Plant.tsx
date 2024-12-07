import { Text, View, StyleSheet, Image, ScrollView, Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import { ValuesContext } from './ValuesContext'; // Import the context
import { LineChart } from 'react-native-chart-kit';
// Define the type for the sensor data
type SensorData = {
    moisture: number;
    temperature: number;
    humidity: number;
};
//npm install react-native-chart-kit
//npm install react-native-svg




export default function Index() {


    const {moisture, temperature, humidity} = useContext(ValuesContext)!;
    const [min_moisture, max_moisture] = moisture.split(',').map(Number);
    const [min_temperature, max_temperature] = temperature.split(',').map(Number);
    const [min_humidity, max_humidity] = humidity.split(',').map(Number);

    const [sensorData, setSensorData] = useState<SensorData | null>(null);

    const [tempdataList, settempDataList] = useState<number[]>([]);
    const [moistdataList, setmoistDataList] = useState<number[]>([]);
    const [humiddataList, sethumidDataList] = useState<number[]>([]);


    const screenWidth = Dimensions.get('window').width
    const tempdata = {
        labels: ['Time'],
        datasets: [{
          data: tempdataList,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,// optional
          strokeWidth: 2 // optional,
          
        }]
    }
    const moistdata = {
        labels: ['Time'],
        datasets: [{
          data: moistdataList,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,// optional
          strokeWidth: 2 // optional,
          
        }]
    }
    const humiddata = {
        labels: ['Time'],
        datasets: [{
          data: humiddataList,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,// optional
          strokeWidth: 2 // optional,
          
        }]
    }


    const tempchartConfig = {
        backgroundGradientFrom: '#f7ab2e',
        backgroundGradientTo: '#f7ab2e',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2 // optional, default 3
    }

    const moistchartConfig = {
        backgroundGradientFrom: '#f7ab2e',
        backgroundGradientTo: '#f7ab2e',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2 // optional, default 3
    }

    const humidchartConfig = {
        backgroundGradientFrom: '#92ff80',
        backgroundGradientTo: '#92ff80',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2 // optional, default 3
    }

    // function useQueue() {
    //     const [queue, setQueue] = useState([]);
      
    //     const enqueue = (item) => {
    //       setQueue([...queue, item]);
    //     };
      
    //     const dequeue = () => {
    //       if (queue.length === 0) {
    //         return null;
    //       }
      
    //       const [first, ...rest] = queue;
    //       setQueue(rest);
    //       return first;
    //     };
      
    //     return { queue, enqueue, dequeue };
    //   }

    const createwarning = (text: string) => (
        <View style={styles.warning}>
          <Text style={styles.warningText}>{text}</Text>
        </View>
      );



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/sensor-data');
                const data: SensorData = await response.json();
                console.log("Data received in fetchData:", data);
                setSensorData(data);
                if (data?.temperature === undefined) return; // Ensure temperature exists
    
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
            {moisture != "" && temperature != "" && humidity != "" ? (
                <View style = {styles.container}>
                    <Image style = {styles.plantImage} source={require('@/assets/images/basic_plant.png')}/>
                    <Text style={styles.temp_text}>
                            Temperature: {sensorData?.temperature ?? 'Loading...'}°C
                        </Text>
                    {max_temperature < (sensorData?.temperature ?? Infinity) && createwarning(`Warning: Temperature exceeds max value ${max_temperature}`)}
                    {min_temperature > (sensorData?.temperature ?? -Infinity) && createwarning(`Warning: Temperature is under min value ${min_temperature}`)}
                    <Text style={styles.humid_text}>
                            Humidity: {sensorData?.humidity ?? 'Loading...'}
                    </Text>
                    {max_humidity < (sensorData?.humidity ?? Infinity) && createwarning(`Warning: Humidity exceeds max value ${max_humidity}`)}
                    {min_humidity > (sensorData?.humidity ?? -Infinity) && createwarning(`Warning: Humidity is under min value ${min_humidity}`)}
                    
                   
                        
                    <Text style={styles.moist_text}>
                        Moisture: {sensorData?.moisture ?? 'Loading...'}%
                    </Text>

                    {max_moisture < (sensorData?.moisture ?? Infinity) && createwarning(`Warning: Moisture exceeds max value ${max_moisture}`)}
                    {min_moisture > (sensorData?.moisture ?? -Infinity) && createwarning(`Warning: Moisture is under min value ${min_moisture}`)} 
                    
                    {/* <Text>Moisture: {moisture}</Text>
                    <Text>Temperature: {temperature}°C</Text>
                    <Text>Humidity: {humidity}%</Text> */}

                    <View style = {{marginTop: 20}}>
                        <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>Temperature</Text>
                        <LineChart
                            key = "temperature"
                            data={tempdata}
                            width={screenWidth}
                            height={220}
                            chartConfig={tempchartConfig}
                            yAxisSuffix="°C"
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                              }}
                        />

                        <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>Moisture</Text>
                        <LineChart
                            key = "moisture"
                            data={moistdata}
                            width={screenWidth}
                            height={220}
                            chartConfig={moistchartConfig}
                            yAxisSuffix="°C"
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                              }}
                        />

                        <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>Humidity</Text>
                        <LineChart
                            key = "humidity"
                            data={humiddata}
                            width={screenWidth}
                            height={220}
                            chartConfig={humidchartConfig}
                            yAxisSuffix="°C"
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                              }}
                        />
                    </View>



                </View>


            ) : (
                <Text style = {styles.message}>Start inputting values to get started</Text>
            )}
            </ScrollView>
        </View>
        // <View style={styles.container}>
        //     {moisture == "" && temperature == "" && humidity == "" && (
        //         <Text style = {styles.message}>Start inputting values to get started</Text>
        //     )}
        // </View>
        // <View style={styles.container}>
        //     <Text style={styles.text}>
        //       Thrive! - The Plant Health Monitor
        //     </Text>
        //     <Text style={styles.text}>
        //         Moisture: {sensorData?.moisture ?? 'Loading...'}
        //     </Text>
        //     <Text style={styles.text}>
        //         Temperature: {sensorData?.temperature ?? 'Loading...'}
        //     </Text>
        //     <Text style={styles.text}>
        //         Humidity: {sensorData?.humidity ?? 'Loading...'}
        //     </Text>


        //     <Text>Input Moisture: {moisture}</Text>
        //     <Text>Input Temperature: {temperature}</Text>
        //     <Text>Input Humidity: {humidity}</Text>
        // </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //justifyContent: 'center',
        //alignItems: 'center',
        padding: 10,
        backgroundColor: '#f9f1c8',
        
    },
    humid_text: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#16e476',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'left'
    },
    moist_text: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#9c5d0f',
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
    warning: {
        backgroundColor: 'red', 
        padding: 10,
        borderRadius: 5, 
        marginBottom: 10, 
        alignSelf: 'stretch', 
    },
    warningText: {
        color: 'white', // White text for contrast
        fontSize: 16, // Readable font size
        textAlign: 'center', // Center-align text
        fontWeight: 'bold', // Makes text bold
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
