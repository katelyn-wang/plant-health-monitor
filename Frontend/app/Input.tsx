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

    return (
        <View style={styles.container}>

            
            <Text style={[styles.titleText,{color: '#9c5d0f'}]}>
                Mositure
            </Text>
            <Text style={styles.recommend}>
                (Recommended: 21%)
            </Text>
            <TextInput
                placeholder="Enter moisture..."
                value={moisture}
                onChangeText={setmoisture}
                style={styles.input}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
            />
            
            <Text style={[styles.titleText,{color: '#c61b48'}]}>
                Temperature
            </Text>
            <Text style={styles.recommend}>
                (Recommended: 45)
            </Text>
            <TextInput
                placeholder="Enter temperature..."
                value={temperature}
                onChangeText={settemperature}
                style={styles.input}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
            />
            <Text style={[styles.titleText,{color: '#16e476'}]}>
                Humidity
            </Text>
            <Text style={styles.recommend}>
                (Recommended: 26)
            </Text>
            <TextInput
                placeholder="Enter humidity..."
                value={humidity}
                onChangeText={sethumidity}
                style={styles.input}
                placeholderTextColor="rgba(0, 0, 0, 0.3)"
            />

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleStoreValues} 
                testID="storeButton" // Optional ID for testing
            >
                <Text style={styles.buttonText}>Store Values</Text>
            </TouchableOpacity>

            {storedValue && (
                <Text style={styles.storedText}>
                    Stored Values: {storedValue}
                </Text>
            )}
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
        paddingBottom: 6
           
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
});
