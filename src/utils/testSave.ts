import { SaveService } from '../services/SaveService';
import { AntimatterDimensionsStruct } from '../Struct';

// Define progression stages
type ProgressionStage = 'early' | 'infinity' | 'eternity' | 'reality';

/**
 * Determines the progression stage of a save based on its properties
 * @param saveData The decrypted save data
 * @returns The detected progression stage
 */
const determineProgressionStage = (saveData: AntimatterDimensionsStruct): ProgressionStage => {
  // Reality stage: has reality property and realities > 0, or has celestials/glyphs
  if (
    (saveData.reality && (
      (saveData.realities && saveData.realities > 0) ||
      (saveData.reality.realityMachines && saveData.reality.realityMachines !== '0') ||
      Object.keys(saveData.reality).length > 5
    )) ||
    saveData.celestials ||
    (saveData as any).blackHole ||  // Using any since blackHole exists but may not be in type
    (saveData.reality && (saveData.reality as any).glyphs)
  ) {
    return 'reality';
  }
  
  // Eternity stage: has eternity points, eternities, or eternity-related properties
  if (
    (saveData.eternityPoints && saveData.eternityPoints !== '0') ||
    (saveData.eternities && saveData.eternities !== '0') ||
    (saveData.eternity && Object.keys(saveData.eternity).length > 0) ||
    (saveData as any).timestudy ||  // Using any since timestudy may not be in unified type
    saveData.dilation ||
    ((saveData as any).timeShards && (saveData as any).timeShards !== '0') ||
    ((saveData as any).totalTickGained && (saveData as any).totalTickGained > 0)
  ) {
    return 'eternity';
  }
  
  // Infinity stage: has infinity points, infinities, break property, or replicanti
  if (
    saveData.break === true || 
    (saveData.infinityPoints && saveData.infinityPoints !== '0') ||
    (saveData.infinities && saveData.infinities !== '0') ||
    (saveData.infinitiesBanked && saveData.infinitiesBanked !== '0') ||
    (saveData.infinityPower && saveData.infinityPower !== '0') ||
    saveData.infinityUpgrades?.length > 0 ||
    saveData.replicanti ||
    (saveData.IPMultPurchases && saveData.IPMultPurchases > 0) ||
    ((saveData as any).partInfinityPoint && (saveData as any).partInfinityPoint > 0)
  ) {
    return 'infinity';
  }
  
  // Early game: no major progression milestones
  return 'early';
};

/**
 * Gets the required properties for each progression stage
 * @param stage The progression stage
 * @returns Array of required property paths
 */
const getRequiredPropertiesByStage = (stage: ProgressionStage): string[] => {
  const baseProperties = [
    'antimatter',
    'dimensions',
    'dimensions.antimatter',
    'buyUntil10',
    'sacrificed',
    'achievementBits',
    'secretAchievementBits',
    'challenge',
    'challenge.normal',
    'auto',
    'dimensionBoosts',
    'galaxies',
    'news',
    'lastUpdate',
    'secretUnlocks',
    'records',
    'records.totalAntimatter',
    'records.bestInfinityTime',
    'version',
    'IPMultPurchases'
  ];

  const infinityProperties = [
    ...baseProperties,
    'infinityPoints',
    'infinities',
    'infinitiesBanked',
    'infinityPower',
    'infinityUpgrades',
    'infinityRebuyables',
    'break',
    'challenge.infinity',
    'infinity',
    'partInfinityPoint',
    'partInfinitied',
    'dimensions.infinity',
    'auto.bigCrunch',
    'auto.infinityDims',
    'replicanti',
    'replicanti.amount',
    'replicanti.unl'
    // Note: advanced replicanti properties like 'timer' are conditional
  ];

  const eternityProperties = [
    ...infinityProperties,
    'eternityPoints',
    'eternities',
    'eternityUpgrades',
    'epmultUpgrades',
    'timeShards',
    'totalTickGained',
    'totalTickBought',
    'timestudy',
    'timestudy.theorem',
    'eternityChalls',
    'respec',
    'eterc8ids',
    'eterc8repl',
    'challenge.eternity',
    'eternity',
    'dimensions.time',
    'auto.timeDims',
    'auto.timeTheorems',
    'dilation'
    // Note: detailed timestudy properties are conditional
  ];

  const realityProperties = [
    ...eternityProperties,
    'reality',
    'reality.realityMachines',
    'reality.imaginaryMachines',
    'reality.upgradeBits',
    'reality.rebuyables',
    'realities',
    'partSimulatedReality',
    'celestials',
    // Note: Most advanced reality properties are conditional
    // 'speedrun', 'blackHole', etc. are only added if unlocked
    'isGameEnd',
    'tutorialState',
    'tutorialActive',
    'options',
    'IAP',
    'tabNotifications',
    'triggeredTabNotificationBits'
  ];

  switch (stage) {
    case 'early':
      return baseProperties;
    case 'infinity':
      return infinityProperties;
    case 'eternity':
      return eternityProperties;
    case 'reality':
      return realityProperties;
    default:
      return baseProperties;
  }
};

/**
 * Checks if a property is relevant for the current progression stage
 * @param propertyPath The property path to check
 * @param stage The current progression stage
 * @returns Whether the property should be validated
 */
const isPropertyRelevantForStage = (propertyPath: string, stage: ProgressionStage): boolean => {
  const requiredProperties = getRequiredPropertiesByStage(stage);
  
  // Check if the property or its parent path is required
  return requiredProperties.some(required => 
    propertyPath.startsWith(required) || required.startsWith(propertyPath)
  );
};

/**
 * Creates a stage-appropriate reference template from a full endgame save
 * This filters out properties that shouldn't exist at the current stage
 * @param fullReference The complete endgame reference
 * @param stage The progression stage to create template for
 * @returns Filtered reference appropriate for the stage
 */
const createStageAppropriateReference = (fullReference: any, stage: ProgressionStage): any => {
  const requiredProperties = getRequiredPropertiesByStage(stage);
  const stageReference: any = {};
  
  // Helper function to recursively filter properties
  const filterProperties = (source: any, target: any, currentPath = '') => {
    if (typeof source !== 'object' || source === null || Array.isArray(source)) {
      return source;
    }
    
    for (const key in source) {
      const propertyPath = currentPath ? `${currentPath}.${key}` : key;
      
      // Check if this property should exist at the current stage
      if (isPropertyRelevantForStage(propertyPath, stage)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          target[key] = {};
          filterProperties(source[key], target[key], propertyPath);
        } else {
          target[key] = source[key];
        }
      }
    }
  };
  
  filterProperties(fullReference, stageReference);
  return stageReference;
};

/**
 * Determines if a property should exist based on progression milestones
 * This provides more intelligent validation beyond just stage-based filtering
 * @param propertyPath The property path to check
 * @param saveData The save data to analyze
 * @param stage The current progression stage
 * @returns Whether the property is expected to exist
 */
const shouldPropertyExist = (propertyPath: string, saveData: AntimatterDimensionsStruct, stage: ProgressionStage): boolean => {
  // Always validate core properties (but not all sub-properties)
  const coreProperties = ['antimatter', 'dimensions.antimatter', 'version', 'lastUpdate'];
  if (coreProperties.some(core => propertyPath === core)) {
    return true;
  }
  
  // Special case: detailed records properties only exist after significant progression
  if (propertyPath.startsWith('records.')) {
    // Basic records always exist
    const basicRecords = ['records.totalAntimatter', 'records.bestInfinityTime'];
    if (basicRecords.includes(propertyPath)) {
      return true;
    }
    
    // Advanced records only exist after hitting those milestones
    if (propertyPath.includes('lastTenInfinities') || propertyPath.includes('InfinityTime')) {
      return (saveData.infinities && typeof saveData.infinities === 'string' && parseInt(saveData.infinities) >= 10) ||
             (saveData.break === true && saveData.infinityPoints && saveData.infinityPoints !== '0');
    }
    
    if (propertyPath.includes('lastTenEternities') || propertyPath.includes('EternityTime')) {
      return ((saveData as any).eternities && typeof (saveData as any).eternities === 'string' && parseInt((saveData as any).eternities) >= 10) ||
             ((saveData as any).eternityPoints && (saveData as any).eternityPoints !== '0');
    }
    
    if (propertyPath.includes('lastTenRealities') || propertyPath.includes('RealityTime')) {
      return (saveData.realities && saveData.realities >= 10);
    }
    
    // Other advanced records
    if (propertyPath.includes('Challenge') || propertyPath.includes('challenge')) {
      return stage !== 'early';
    }
    
    return false; // Most detailed records are optional
  }
  
  // Speedrun properties only exist if speedrun is unlocked
  if (propertyPath.startsWith('speedrun.')) {
    if (propertyPath === 'speedrun.isUnlocked' || propertyPath === 'speedrun.isActive') {
      return stage === 'reality'; // Basic speedrun properties exist in reality
    }
    // Advanced speedrun properties only if actually speedrunning
    const speedrun = (saveData as any).speedrun;
    return speedrun && speedrun.isUnlocked === true;
  }
  
  // Replicanti sub-properties only exist if replicanti is unlocked
  if (propertyPath.startsWith('replicanti.')) {
    if (propertyPath === 'replicanti.amount' || propertyPath === 'replicanti.unl') {
      return stage === 'infinity' || stage === 'eternity' || stage === 'reality';
    }
    // Advanced replicanti properties only if unlocked
    return saveData.replicanti && (saveData.replicanti as any).unl === true;
  }
  
  // Time study properties only exist if eternity is reached
  if (propertyPath.startsWith('timestudy.')) {
    const eternityPoints = (saveData as any).eternityPoints;
    return eternityPoints && eternityPoints !== '0';
  }
  
  // Dilation properties only exist if dilation is unlocked
  if (propertyPath.startsWith('dilation.')) {
    return (saveData.dilation && Object.keys(saveData.dilation).length > 0);
  }
  
  // Celestials properties only exist if reality is reached and celestials unlocked
  if (propertyPath.startsWith('celestials.')) {
    return saveData.realities && saveData.realities > 0;
  }
  
  // Black hole properties only exist if black holes are unlocked
  if (propertyPath.startsWith('blackHole') || propertyPath.includes('blackHole')) {
    return saveData.realities && saveData.realities > 0 && 
           (saveData as any).blackHole && Array.isArray((saveData as any).blackHole);
  }
  
  // Stage-specific logic for major properties
  switch (stage) {
    case 'early':
      // Early game - only basic properties should exist
      const earlyGameProperties = [
        'antimatter', 'dimensions', 'version', 'lastUpdate', 'buyUntil10', 'sacrificed',
        'achievementBits', 'secretAchievementBits', 'challenge.normal', 'auto',
        'dimensionBoosts', 'galaxies', 'news', 'secretUnlocks', 'IPMultPurchases'
      ];
      return earlyGameProperties.some(prop => propertyPath.startsWith(prop));
      
    case 'infinity':
      // Infinity stage - check if infinity was actually reached
      if (propertyPath.includes('infinity') && !propertyPath.includes('eternity') && !propertyPath.includes('reality')) {
        return saveData.break === true || 
               (saveData.infinityPoints && saveData.infinityPoints !== '0') ||
               (saveData.infinities && saveData.infinities !== '0');
      }
      if (propertyPath.startsWith('replicanti')) {
        return saveData.break === true;
      }
      return isPropertyRelevantForStage(propertyPath, stage) && !propertyPath.includes('eternity') && !propertyPath.includes('reality');
      
    case 'eternity':
      // Eternity stage - check if eternity was actually reached
      if (propertyPath.includes('eternity') || propertyPath.includes('timestudy') || propertyPath.includes('dilation')) {
        const eternityPoints = (saveData as any).eternityPoints;
        return eternityPoints && eternityPoints !== '0';
      }
      return isPropertyRelevantForStage(propertyPath, stage) && !propertyPath.includes('reality');
      
    case 'reality':
      // Reality stage - most properties can exist, but still check for specific unlocks
      if (propertyPath.includes('reality') || propertyPath.includes('celestials') || propertyPath.includes('glyphs')) {
        return (saveData.realities && saveData.realities > 0) ||
               (saveData.reality && Object.keys(saveData.reality).length > 0);
      }
      return isPropertyRelevantForStage(propertyPath, stage);
      
    default:
      return isPropertyRelevantForStage(propertyPath, stage);
  }
};

/**
 * Function that tests if the decrypted save matches the expected structure
 * This function validates that the decryption/encryption process works correctly
 * Now with adaptive validation based on progression stage
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
  warnings: string[],
  progressionStage: ProgressionStage,
  decryptedData: AntimatterDimensionsStruct | null 
} => {
  // Default result with new fields
  const result = {
    success: false,
    errors: [] as string[],
    warnings: [] as string[],
    progressionStage: 'early' as ProgressionStage,
    decryptedData: null as AntimatterDimensionsStruct | null
  };

  try {
    // Decrypt the save
    const decryptedData = SaveService.decrypt(encryptedSave);
    
    if (!decryptedData || !decryptedData.data) {
      result.errors.push('The save could not be decrypted');
      return result;
    }
    
    // Convert the JSON reference to an object
    let fullReference;
    try {
      fullReference = JSON.parse(jsonReference);
    } catch (error) {
      result.errors.push(`Error parsing reference file: ${error}`);
      return result;
    }
    
    // Keep the decrypted data for reference
    result.decryptedData = decryptedData.data as AntimatterDimensionsStruct;
    
    // Determine the progression stage of the save
    result.progressionStage = determineProgressionStage(result.decryptedData);
    
    // Create a stage-appropriate reference template
    const stageReference = createStageAppropriateReference(fullReference, result.progressionStage);
    
    // Add informational message about the detected stage
    result.warnings.push(`Detected progression stage: ${result.progressionStage}`);
    
    // Adaptive property checking based on progression stage
    const checkProperties = (
      decrypted: any, 
      reference: any, 
      path = ''
    ): void => {
      // Check for null/undefined objects
      if (!decrypted || !reference) return;
      
      // For arrays, just check if they exist and have correct type
      if (Array.isArray(reference)) {
        if (!Array.isArray(decrypted)) {
          const propertyPath = path || 'root';
          if (shouldPropertyExist(propertyPath, result.decryptedData!, result.progressionStage)) {
            result.errors.push(`Property ${propertyPath} should be an array`);
          }
        }
        return;
      }
      
      // Handle primitive types
      if (typeof reference !== 'object' || reference === null) {
        if (typeof decrypted !== typeof reference) {
          const propertyPath = path || 'root';
          if (shouldPropertyExist(propertyPath, result.decryptedData!, result.progressionStage)) {
            result.errors.push(`Property ${propertyPath} has incorrect type: expected ${typeof reference}, got ${typeof decrypted}`);
          }
        }
        return;
      }
      
      // Check top-level properties for objects
      const decryptedKeys = Object.keys(decrypted);
      const referenceKeys = Object.keys(reference);
        // Check if critical properties are missing in the decrypted data
      const missingKeys = referenceKeys.filter(key => !decryptedKeys.includes(key));
      if (missingKeys.length > 0) {
        missingKeys.forEach(key => {
          const propertyPath = path ? `${path}.${key}` : key;
          
          // Check if this property should exist at the current stage
          if (shouldPropertyExist(propertyPath, result.decryptedData!, result.progressionStage)) {
            // Further check if it's truly required or just expected
            const isCriticalProperty = [
              'antimatter', 'dimensions', 'version', 'lastUpdate'
            ].some(critical => propertyPath.startsWith(critical) && !propertyPath.includes('.'));
            
            if (isCriticalProperty) {
              result.errors.push(`Missing critical property: ${propertyPath}`);
            } else {
              result.warnings.push(`Missing expected property: ${propertyPath} (may indicate incomplete save)`);
            }
          } else {
            // Property exists in reference but not expected at this stage
            const isAdvancedFeature = [
              'lastTenInfinities', 'lastTenEternities', 'lastTenRealities',
              'speedrun.milestones', 'replicanti.timer', 'celestials.',
              'blackHole', 'glyphs', 'dilation.', 'timestudy.'
            ].some(advanced => propertyPath.includes(advanced));
            
            if (isAdvancedFeature) {
              // Don't even warn about advanced features not yet unlocked
              return;
            } else {
              result.warnings.push(`Property not yet available: ${propertyPath} (will unlock later in progression)`);
            }
          }
        });
      }
      
      // Check for extra properties that shouldn't exist at this stage
      const extraKeys = decryptedKeys.filter(key => !referenceKeys.includes(key));
      if (extraKeys.length > 0) {
        extraKeys.forEach(key => {
          const propertyPath = path ? `${path}.${key}` : key;
          if (!shouldPropertyExist(propertyPath, result.decryptedData!, result.progressionStage)) {
            result.warnings.push(`Unexpected property for ${result.progressionStage} stage: ${propertyPath}`);
          }
        });
      }
      
      // Check common properties recursively
      for (const key of referenceKeys) {
        if (decryptedKeys.includes(key)) {
          const decryptedValue = decrypted[key];
          const referenceValue = reference[key];
          const currentPath = path ? `${path}.${key}` : key;
          
          // Only validate properties relevant to current stage
          if (shouldPropertyExist(currentPath, result.decryptedData!, result.progressionStage)) {
            // Recursive check for objects
            if (
              typeof decryptedValue === 'object' && 
              decryptedValue !== null && 
              typeof referenceValue === 'object' &&
              referenceValue !== null &&
              !Array.isArray(decryptedValue) &&
              !Array.isArray(referenceValue)
            ) {
              checkProperties(decryptedValue, referenceValue, currentPath);
            }
            // Type checking for primitives
            else if (typeof decryptedValue !== typeof referenceValue) {
              result.errors.push(`Incorrect type for ${currentPath}: expected ${typeof referenceValue}, got ${typeof decryptedValue}`);
            }
          }
        }
      }
    };
    
    // Start recursive verification with stage-appropriate reference
    checkProperties(result.decryptedData, stageReference);
    
    // Add summary information
    const totalProperties = getRequiredPropertiesByStage(result.progressionStage).length;
    result.warnings.push(`Validating ${totalProperties} properties for ${result.progressionStage} stage`);
    
    // If no errors were found, the test is successful
    result.success = result.errors.length === 0;
    
    if (result.success) {
      result.warnings.push('Save structure validation successful!');
    } else {
      result.warnings.push(`Found ${result.errors.length} structural issues`);
    }
    
  } catch (error) {
    result.errors.push(`Error during test: ${error}`);
  }
  
  return result;
};

/**
 * Function that specifically checks the Reality section
 * Now with adaptive validation - only validates if the save has reached Reality stage
 * @param decryptedSave The decrypted save
 * @returns An object containing detected issues in the Reality section
 */
export const checkRealitySection = (
  decryptedSave: AntimatterDimensionsStruct
): { 
  issues: string[];
  warnings: string[];
  progressionStage: ProgressionStage;
} => {
  const issues: string[] = [];
  const warnings: string[] = [];
  const progressionStage = determineProgressionStage(decryptedSave);
  
  // Only validate reality properties if the save has reached Reality stage
  if (progressionStage !== 'reality') {
    warnings.push(`Reality section validation skipped - save is at ${progressionStage} stage`);
    return { issues, warnings, progressionStage };
  }
  
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
  
  return { issues, warnings, progressionStage };
}; 