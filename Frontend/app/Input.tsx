import React, {useContext, useState} from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import { ValuesContext } from './ValuesContext';
import { SERVER_IP, MOISTURE_RANGES, TEMP_RANGES, HUMIDITY_RANGES } from '../constants';

export default function Input() {

    
    const { setValues } = useContext(ValuesContext)!;
    const [moistureRange, setmoistureRange] = useState(MOISTURE_RANGES.medium);
    const [temperatureRange, settemperatureRange] = useState(TEMP_RANGES.medium);
    const [humidityRange, sethumidityRange] = useState(HUMIDITY_RANGES.medium);
    const [storedValue, setStoredValue] = useState('');

    const handleStoreValues = () => {
        setStoredValue(`\nMoisture: [${moistureRange}]%, \nTemperature: [${temperatureRange}]°C, \nHumidity: [${humidityRange}]%`);
        setValues({ moistureRange, temperatureRange, humidityRange });
        updateSensorRanges();
    };

    const updateSensorRanges = async () => {

        var [min_moisture, max_moisture] = moistureRange.split(',').map(String);
        var [min_temperature, max_temperature] = temperatureRange.split(',').map(String);
        var [min_humidity, max_humidity] = humidityRange.split(',').map(String);

        try {
            const response = await fetch(`http://${SERVER_IP}:3000/update-sensor-ranges`, {
              method: 'POST', // HTTP method
              headers: {
                'Content-Type': 'application/json', // Set content type
              },
              body: JSON.stringify({
                moisture: { min: min_moisture, max: max_moisture },
                temperature: { min: min_temperature, max: max_temperature },
                humidity: { min: min_humidity, max: max_humidity }, 
              }),
            });
      
            const data = await response.json(); // Parse the JSON response
      
            if (response.ok) {
              console.log('Response:', data);
            } else {
              console.log('Error', `Failed to send data: ${data.message || 'Unknown error'}`);
            }
          } catch (error) {
            console.error('Error:', error);
          }
    }


    const renderButtonGroup = (title: string, options: { label: string; value: string }[], selectedValue: string, setValue: React.Dispatch<React.SetStateAction<string>>) => (
        <View style={styles.group}>
          <View style={styles.buttonContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.button, selectedValue === option.value && styles.selectedButton]}
                onPress={() => setValue(option.value)}
              >
                <Text style={styles.buttonText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.selectedValue}>Selected {title}: {selectedValue || 'None'}</Text>
        </View>
      );



    return (
        <View style={styles.container}>
            <ScrollView>
            
                <Text style={[styles.titleText,{color: '#49a3c4'}]}>
                    Moisture (%)
                </Text>
                {/* <Text style={styles.recommend}>
                    (Recommended: 21%)
                </Text> */}
                {renderButtonGroup(
                    'Moisture',
                    [
                    { label: 'Low', value: MOISTURE_RANGES.low },
                    { label: 'Medium', value: MOISTURE_RANGES.medium },
                    { label: 'High', value: MOISTURE_RANGES.high },
                    ],
                    moistureRange,
                    setmoistureRange
                )}
                
                <Text style={[styles.titleText,{color: '#c61b48'}]}>
                    Temperature (°C)
                </Text>
                {/* <Text style={styles.recommend}>
                    (Recommended: 45)
                </Text> */}
                {renderButtonGroup(
                    'Temperature',
                    [
                    { label: 'Low', value: TEMP_RANGES.low },
                    { label: 'Medium', value: TEMP_RANGES.medium },
                    { label: 'High', value: TEMP_RANGES.high },
                    ],
                    temperatureRange,
                    settemperatureRange
                )}
                <Text style={[styles.titleText,{color: '#57a630'}]}>
                    Humidity (%)
                </Text>
                {/* <Text style={styles.recommend}>
                    (Recommended: 26)
                </Text> */}
                {renderButtonGroup(
                    'Humidity',
                    [
                    { label: 'Low', value: HUMIDITY_RANGES.low },
                    { label: 'Medium', value: HUMIDITY_RANGES.medium },
                    { label: 'High', value: HUMIDITY_RANGES.high },
                    ],
                    humidityRange,
                    sethumidityRange
                )}

                <TouchableOpacity 
                    style={styles.storeButton} 
                    onPress={handleStoreValues} 
                    testID="storeButton" // Optional ID for testing
                >
                    <Text style={styles.buttonText}>Store Values</Text>
                </TouchableOpacity>

                {storedValue && (
                    <Text style={styles.storedText}>
                        {storedValue}
                    </Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f1c8'
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0,
        marginBottom: 20,
        paddingLeft: 8,
        width: '100%',
        backgroundColor: '#ffffff',
        
        
    },
    storedText: {
        marginTop: 0,
        fontSize: 16,
        textAlign: 'center',
        
    },
    titleText: {
        marginTop: 20,
        fontSize: 32,
        fontWeight: 'bold',
          
    },
    recommend: {
        paddingBottom: 5
           
    },
    group: {
        marginBottom: 0,
        width: '100%',
    },
    button: {
        backgroundColor: '#9c5d0f', 
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    selectedValue: {
        fontSize: 18,
        marginVertical: 10,
        color: 'black',
    },
    storeButton: {
        backgroundColor: '#523209',
        padding: 10,
        borderRadius: 5,
        marginTop: 30,
    },
    storeButtonText: {
        color: '#fff',
        fontSize: 16,
      },
    selectedButton: {
        backgroundColor: '#63cf2d',
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 5,
    },
});
