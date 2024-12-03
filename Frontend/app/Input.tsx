import React, {useContext, useState} from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { ValuesContext } from './ValuesContext';
export default function Input() {

    const { setValues } = useContext(ValuesContext)!;
    const [moisture, setmoisture] = useState('');
    const [temperature, settemperature] = useState('');
    const [humidity, sethumidity] = useState('');
    const [storedValue, setStoredValue] = useState('');

    const handleStoreValues = () => {
        setStoredValue(`Text 1: ${moisture}, Text 2: ${temperature}, Text 3: ${humidity}`);
        setValues({ moisture, temperature, humidity });
    };


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

            
            <Text style={[styles.titleText,{color: '#9c5d0f'}]}>
                Moisture
            </Text>
            {/* <Text style={styles.recommend}>
                (Recommended: 21%)
            </Text> */}
            {renderButtonGroup(
                'Moisture',
                [
                { label: 'Low', value: '20,40' },
                { label: 'Medium', value: '40,60' },
                { label: 'High', value: '60,70' },
                ],
                moisture,
                setmoisture
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
                { label: 'Low', value: '15' },
                { label: 'Medium', value: '25' },
                { label: 'High', value: '35' },
                ],
                temperature,
                settemperature
            )}
            <Text style={[styles.titleText,{color: '#16e476'}]}>
                Humidity
            </Text>
            {/* <Text style={styles.recommend}>
                (Recommended: 26)
            </Text> */}
            {renderButtonGroup(
                'Humidity',
                [
                { label: 'Low', value: '40' },
                { label: 'Medium', value: '50' },
                { label: 'High', value: '60' },
                ],
                humidity,
                sethumidity
            )}

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleStoreValues} 
                testID="storeButton" // Optional ID for testing
            >
                <Text style={styles.buttonText}>Store Values</Text>
            </TouchableOpacity>

            {/* {storedValue && (
                <Text style={styles.storedText}>
                    Stored Values: {storedValue}
                </Text>
            )} */}
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
        marginTop: 20,
        fontSize: 16,
        
        
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
        backgroundColor: '#14e42b', 
        paddingVertical: 10,
        paddingHorizontal: 20,
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
        backgroundColor: '#9c5d0f',
        padding: 15,
        borderRadius: 5,
      },
    storeButtonText: {
        color: '#fff',
        fontSize: 16,
      },
    selectedButton: {
        backgroundColor: '#9c5d0f',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 5,
    },
});
