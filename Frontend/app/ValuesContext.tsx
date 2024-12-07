import React, { createContext, useState, ReactNode } from 'react';
import { MOISTURE_RANGES, TEMP_RANGES, HUMIDITY_RANGES } from '@/constants';

// Define the context's shape
type ValuesContextType = {
  moistureRange: string;
  temperatureRange: string;
  humidityRange: string;
  setValues: (values: any) => void;
};

export const ValuesContext = createContext<ValuesContextType>({
  moistureRange: MOISTURE_RANGES.medium,
  temperatureRange: TEMP_RANGES.medium,
  humidityRange: HUMIDITY_RANGES.medium,
  setValues: () => {},
});

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