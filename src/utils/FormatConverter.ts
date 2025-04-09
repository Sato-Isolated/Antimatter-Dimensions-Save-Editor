/**
 * Utilities for converting between PC and Android number formats
 * PC format uses scientific notation strings like "1e+1500"
 * Android format uses {mantissa: number, exponent: number} objects
 */

/**
 * Represents a big number in Android format
 */
export interface AndroidBigNumber {
  mantissa: number;
  exponent: number;
}

/**
 * Converts a PC format string to Android format object
 * @param pcValue String in scientific notation (e.g., "1e+1500")
 * @returns AndroidBigNumber object with mantissa and exponent
 */
export function pcToAndroid(pcValue: string): AndroidBigNumber {
  if (!pcValue || pcValue === '0' || pcValue === '') {
    return { mantissa: 0, exponent: 0 };
  }

  try {
    // Handle special case for Infinity
    if (pcValue === 'Infinity') {
      return { mantissa: 1, exponent: 309 }; // Representation of a very large number
    }

    // Parse scientific notation
    const match = pcValue.match(/^([0-9.]+)e\+?(.+)$/);
    
    if (match) {
      const mantissa = parseFloat(match[1]);
      const exponent = parseInt(match[2], 10);
      return { mantissa, exponent };
    }
    
    // If the string doesn't have scientific notation
    const num = parseFloat(pcValue);
    if (isNaN(num)) {
      return { mantissa: 0, exponent: 0 };
    }
    
    if (num === 0) {
      return { mantissa: 0, exponent: 0 };
    }
    
    // Convert regular number to mantissa/exponent format
    const exponent = Math.floor(Math.log10(Math.abs(num)));
    const mantissa = num / Math.pow(10, exponent);
    
    return { mantissa, exponent };
  } catch (e) {
    console.error('Error converting PC to Android format:', e);
    return { mantissa: 0, exponent: 0 };
  }
}

/**
 * Converts an Android format object to PC format string
 * @param androidValue AndroidBigNumber object
 * @returns String in scientific notation (e.g., "1e+1500")
 */
export function androidToPc(androidValue: AndroidBigNumber): string {
  if (!androidValue) {
    return '0';
  }
  
  try {
    const { mantissa, exponent } = androidValue;
    
    // Handle special cases
    if (mantissa === 0) {
      return '0';
    }
    
    if (exponent >= 309) {
      return 'Infinity';
    }
    
    // Format as scientific notation
    return `${mantissa}e+${exponent}`;
  } catch (e) {
    console.error('Error converting Android to PC format:', e);
    return '0';
  }
}

/**
 * Checks if a value is in Android big number format
 */
export function isAndroidBigNumber(value: any): value is AndroidBigNumber {
  return (
    typeof value === 'object' && 
    value !== null &&
    'mantissa' in value && 
    'exponent' in value &&
    typeof value.mantissa === 'number' &&
    typeof value.exponent === 'number'
  );
} 