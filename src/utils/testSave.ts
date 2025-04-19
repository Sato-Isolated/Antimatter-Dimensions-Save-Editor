import { SaveService } from '../services/SaveService';
import { AntimatterDimensionsStruct } from '../Struct';

/**
 * Function that tests if the decrypted save matches the expected one
 * This function validates that the decryption/encryption process works correctly
 * @param encryptedSave The encrypted save to test
 * @param jsonReference The reference JSON file containing the expected structure
 * @returns An object containing the test result and any differences
 */
export const testSaveData = (
  encryptedSave: string, 
  jsonReference: string
): { 
  success: boolean, 
  errors: string[],
  decryptedData: AntimatterDimensionsStruct | null 
} => {
  // Default result
  const result = {
    success: false,
    errors: [] as string[],
    decryptedData: null as AntimatterDimensionsStruct | null
  };

  try {
    // Decrypt the save
    const decryptedData = SaveService.decrypt(encryptedSave);
    
    if (!decryptedData) {
      result.errors.push('The save could not be decrypted');
      return result;
    }
    
    // Convert the JSON reference to an object
    let referenceData;
    try {
      referenceData = JSON.parse(jsonReference);
    } catch (error) {
      result.errors.push(`Error parsing reference file: ${error}`);
      return result;
    }
    
    // Keep the decrypted data for reference
    result.decryptedData = decryptedData.data as AntimatterDimensionsStruct;
    
    // Compare the main properties
    const checkProperties = (
      decrypted: any, 
      reference: any, 
      path = ''
    ): void => {
      // Check top-level properties
      const decryptedKeys = Object.keys(decrypted);
      const referenceKeys = Object.keys(reference);
      
      // Check if properties are missing in the decrypted data
      const missingKeys = referenceKeys.filter(key => !decryptedKeys.includes(key));
      if (missingKeys.length > 0) {
        missingKeys.forEach(key => {
          result.errors.push(`Missing property: ${path ? path + '.' : ''}${key}`);
        });
      }
      
      // Check if types match for common properties
      for (const key of referenceKeys) {
        if (decryptedKeys.includes(key)) {
          const decryptedValue = decrypted[key];
          const referenceValue = reference[key];
          const currentPath = path ? `${path}.${key}` : key;
          
          // Check if types are consistent
          if (typeof decryptedValue !== typeof referenceValue) {
            result.errors.push(`Incorrect type for ${currentPath}: expected ${typeof referenceValue}, got ${typeof decryptedValue}`);
          } 
          // If both are objects, check recursively
          else if (
            typeof decryptedValue === 'object' && 
            decryptedValue !== null && 
            referenceValue !== null && 
            !Array.isArray(decryptedValue) &&
            !Array.isArray(referenceValue)
          ) {
            checkProperties(decryptedValue, referenceValue, currentPath);
          }
        }
      }
    };
    
    // Start recursive verification
    checkProperties(decryptedData, referenceData);
    
    // If no errors were found, the test is successful
    result.success = result.errors.length === 0;
    
  } catch (error) {
    result.errors.push(`Error during test: ${error}`);
  }
  
  return result;
};

/**
 * Function that specifically checks the Reality section
 * @param decryptedSave The decrypted save
 * @returns An object containing detected issues in the Reality section
 */
export const checkRealitySection = (
  decryptedSave: AntimatterDimensionsStruct
): { 
  issues: string[] 
} => {
  const issues: string[] = [];
  
  // Check reality-specific properties
  if (decryptedSave.realities === undefined) {
    issues.push('The "realities" property is missing');
  } else if (typeof decryptedSave.realities !== 'number') {
    issues.push(`The "realities" property is of type ${typeof decryptedSave.realities} instead of number`);
  }
  
  if (decryptedSave.partSimulatedReality === undefined) {
    issues.push('The "partSimulatedReality" property is missing');
  } else if (typeof decryptedSave.partSimulatedReality !== 'number') {
    issues.push(`The "partSimulatedReality" property is of type ${typeof decryptedSave.partSimulatedReality} instead of number`);
  }
  
  if (!decryptedSave.reality) {
    issues.push('The "reality" property is missing');
  } else {
    // Check reality properties
    const reality = decryptedSave.reality;
    
    if (reality.realityMachines === undefined) {
      issues.push('The "reality.realityMachines" property is missing');
    } else if (typeof reality.realityMachines !== 'string') {
      issues.push(`The "reality.realityMachines" property is of type ${typeof reality.realityMachines} instead of string`);
    }
    
    if (reality.imaginaryMachines === undefined) {
      issues.push('The "reality.imaginaryMachines" property is missing');
    } else if (typeof reality.imaginaryMachines !== 'number') {
      issues.push(`The "reality.imaginaryMachines" property is of type ${typeof reality.imaginaryMachines} instead of number`);
    }
    
    if (reality.upgradeBits === undefined) {
      issues.push('The "reality.upgradeBits" property is missing');
    } else if (typeof reality.upgradeBits !== 'number') {
      issues.push(`The "reality.upgradeBits" property is of type ${typeof reality.upgradeBits} instead of number`);
    }
    
    if (reality.rebuyables === undefined) {
      issues.push('The "reality.rebuyables" property is missing');
    } else if (typeof reality.rebuyables !== 'object') {
      issues.push(`The "reality.rebuyables" property is of type ${typeof reality.rebuyables} instead of object`);
    }
  }
  
  return { issues };
}; 