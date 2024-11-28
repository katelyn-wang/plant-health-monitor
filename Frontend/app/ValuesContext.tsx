import React, { createContext, useState, ReactNode } from 'react';

// Define the context's shape
type ValuesContextType = {
  moisture: string;
  temperature: string;
  humidity: string;
  setValues: (values: any) => void;
};

// Create the context with an undefined initial value
export const ValuesContext = createContext<ValuesContextType | undefined>(undefined);

export const ValuesProvider = ({ children }: { children: ReactNode }) => {
  const [moisture, setMoisture] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');

  // Function to update all values at once
  const setValues = (values: any) => {
    setMoisture(values.moisture);
    setTemperature(values.temperature);
    setHumidity(values.humidity);
  };

  return (
    <ValuesContext.Provider value={{ moisture, temperature, humidity, setValues }}>
      {children}
    </ValuesContext.Provider>
  );
};
