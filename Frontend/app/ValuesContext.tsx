import React, { createContext, useState, ReactNode } from 'react';
import { MOISTURE_RANGES, TEMP_RANGES, HUMIDITY_RANGES } from '@/constants';

// Define the context's shape
type ValuesContextType = {
  moistureRange: string;
  temperatureRange: string;
  humidityRange: string;
  setValues: (values: any) => void;
};

// Create the context with an undefined initial value
export const ValuesContext = createContext<ValuesContextType | undefined>(undefined);

export const ValuesProvider = ({ children }: { children: ReactNode }) => {
  const [moistureRange, setMoistureRange] = useState(MOISTURE_RANGES.medium);
  const [temperatureRange, setTemperatureRange] = useState(TEMP_RANGES.medium);
  const [humidityRange, setHumidityRange] = useState(HUMIDITY_RANGES.medium);

  // Function to update all values at once
  const setValues = (values: any) => {
    setMoistureRange(values.moistureRange);
    setTemperatureRange(values.temperatureRange);
    setHumidityRange(values.humidityRange);
  };

  return (
    <ValuesContext.Provider value={{ moistureRange, temperatureRange, humidityRange, setValues }}>
      {children}
    </ValuesContext.Provider>
  );
};

export default ValuesProvider;