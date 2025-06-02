const API_BASE_URL = 'http://100.78.1.8:3000'; 

export interface SoilData {
  carbonContent: number;
  ph: number;
  electricalConductivity: number;
  phosphorus: number;
  nitrogen: number;
  potassium: number;
  elevation: number;
}

export const fetchSoilData = async (): Promise<SoilData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/soil-data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const rawData = await response.json();
    
    // Map and format the data
    return {
      carbonContent: Number(rawData.carbonContent.toFixed(3)),
      ph: rawData.pH_H2O,
      electricalConductivity: rawData.EC,
      phosphorus: rawData.P,
      nitrogen: rawData.N,
      potassium: rawData.K,
      elevation: rawData.Elev
    };
  } catch (error) {
    console.error('Error fetching soil data:', error);
    throw error;
  }
}; 

