import { SaveService, SaveType } from '../services/SaveService';
import { AntimatterDimensionsStruct } from '../Struct';
import {
  SaveFieldDefinition,
  SaveFieldKind,
  readFieldValue,
  resolveFieldPath,
  saveEditorFields,
} from '../core/save/fieldRegistry';

// Define progression stages
type ProgressionStage = 'early' | 'infinity' | 'eternity' | 'reality';

const isDecimalObject = (value: unknown): value is { mantissa: number; exponent: number } => {
  return typeof value === 'object'
    && value !== null
    && 'mantissa' in value
    && 'exponent' in value;
};

const hasProgressValue = (value: unknown): boolean => {
  if (value === undefined || value === null) {
    return false;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value !== '0' && value !== '';
  }

  if (typeof value === 'number') {
    return value > 0;
  }

  if (isDecimalObject(value)) {
    return value.mantissa !== 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return false;
};

const detectSchemaFromSaveData = (saveData: AntimatterDimensionsStruct): SaveType => {
  return 'brake' in (saveData as unknown as object) ? SaveType.Android : SaveType.PC;
};

const bigNumberPattern = /^-?\d+(\.\d+)?(e[+-]?\d+)?$/i;

const getExpectedFieldKind = (field: SaveFieldDefinition, saveType: SaveType): SaveFieldKind => {
  return field.platformKinds?.[saveType] ?? field.kind;
};

const isBigNumberNode = (value: unknown): boolean => {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  if (typeof value === 'string') {
    return value === 'Infinity' || bigNumberPattern.test(value.trim());
  }

  return isDecimalObject(value)
    && Number.isFinite(value.mantissa)
    && Number.isInteger(value.exponent);
};

const isFieldNodeTypeCompatible = (value: unknown, kind: SaveFieldKind): boolean => {
  if (kind === 'boolean') {
    return typeof value === 'boolean';
  }

  if (kind === 'number' || kind === 'integer') {
    return typeof value === 'number';
  }

  return isBigNumberNode(value);
};

const describeNodeType = (value: unknown): string => {
  if (Array.isArray(value)) {
    return 'array';
  }

  if (value === null) {
    return 'null';
  }

  return typeof value;
};

export const compareRegisteredFieldNodes = (
  saveData: AntimatterDimensionsStruct,
  referenceData: AntimatterDimensionsStruct,
  saveType: SaveType
): {
  success: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  for (const field of saveEditorFields) {
    const actualPath = resolveFieldPath(saveData as never, field, saveType);
    const referencePath = resolveFieldPath(referenceData as never, field, saveType);
    const actualValue = readFieldValue(saveData as never, field, saveType);
    const referenceValue = readFieldValue(referenceData as never, field, saveType);
    const expectedKind = getExpectedFieldKind(field, saveType);

    if (referenceValue === undefined) {
      errors.push(
        `${field.label} reference node missing at ${referencePath}`
      );
      continue;
    }

    if (actualValue === undefined) {
      errors.push(
        `${field.label} node missing at ${actualPath} (reference ${referencePath})`
      );
      continue;
    }

    if (!isFieldNodeTypeCompatible(actualValue, expectedKind)) {
      errors.push(
        `${field.label} node type mismatch at ${actualPath} (reference ${referencePath}): expected ${expectedKind}, got ${describeNodeType(actualValue)}`
      );
    }
  }

  return {
    success: errors.length === 0,
    errors,
  };
};

/**
 * Determines the progression stage of a save based on its properties
 * @param saveData The decrypted save data
 * @returns The detected progression stage
 */
const determineProgressionStage = (saveData: AntimatterDimensionsStruct, saveType: SaveType): ProgressionStage => {
  const breakInfinityEnabled = saveType === SaveType.Android ? (saveData as any).brake === true : saveData.break === true;

  // Reality stage: has reality property and realities > 0, or has celestials/glyphs
  if (
    (saveData.reality && (
      hasProgressValue(saveData.realities) ||
      hasProgressValue(saveData.reality.realityMachines) ||
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
    hasProgressValue((saveData as any).eternityPoints) ||
    hasProgressValue((saveData as any).eternities) ||
    (saveData.eternity && Object.keys(saveData.eternity).length > 0) ||
    (saveData as any).timestudy ||  // Using any since timestudy may not be in unified type
    saveData.dilation ||
    hasProgressValue((saveData as any).timeShards) ||
    hasProgressValue((saveData as any).totalTickGained)
  ) {
    return 'eternity';
  }
  
  // Infinity stage: has infinity points, infinities, break property, or replicanti
  if (
    breakInfinityEnabled || 
    hasProgressValue((saveData as any).infinityPoints) ||
    hasProgressValue((saveData as any).infinities) ||
    hasProgressValue((saveData as any).infinitiesBanked) ||
    hasProgressValue((saveData as any).infinityPower) ||
    saveData.infinityUpgrades?.length > 0 ||
    saveData.replicanti ||
    hasProgressValue((saveData as any).IPMultPurchases) ||
    hasProgressValue((saveData as any).ipMultUpgrades) ||
    hasProgressValue((saveData as any).partInfinityPoint)
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
const getRequiredPropertiesByStage = (stage: ProgressionStage, saveType: SaveType): string[] => {
  const pcBaseProperties = [
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

  const pcInfinityProperties = [
    ...pcBaseProperties,
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

  const pcEternityProperties = [
    ...pcInfinityProperties,
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

  const pcRealityProperties = [
    ...pcEternityProperties,
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

  const androidBaseProperties = [
    'antimatter',
    'dimensions',
    'dimensions.antimatter',
    'buyUntil10',
    'matter',
    'achievementBits',
    'secretAchievementBits',
    'challenge',
    'challenge.normal',
    'auto',
    'dimensionBoosts',
    'galaxies',
    'news',
    'lastUpdate',
    'records',
    'records.totalAntimatter',
    'version',
    'brake'
  ];

  const androidInfinityProperties = [
    ...androidBaseProperties,
    'infinityPoints',
    'infinities',
    'infinityPower',
    'infinity',
    'infinity.break',
    'infinity.upgrades',
    'infinityUpgradeBits',
    'ipMultUpgrades',
    'partInfinityPoint',
    'partInfinitied',
    'replicanti',
    'replicanti.amount',
    'replicanti.unl'
  ];

  const androidEternityProperties = [
    ...androidInfinityProperties,
    'eternityPoints',
    'eternities',
    'timeShards',
    'epMultUpgrades',
    'eternityUpgradeBits',
    'dilation'
  ];

  const androidRealityProperties = [
    ...androidEternityProperties,
    'realities',
    'reality',
    'reality.realityMachines',
    'reality.imaginaryMachines',
    'reality.upgradeBits',
    'reality.upgradeRequirementBits',
    'reality.partEternitied',
    'reality.partSimulated',
    'celestials',
    'isGameEnd',
    'tutorialState',
    'tutorialActive',
    'options',
    'IAP',
    'tabNotifications',
    'triggeredTabNotificationBits'
  ];

  const baseProperties = saveType === SaveType.Android ? androidBaseProperties : pcBaseProperties;
  const infinityProperties = saveType === SaveType.Android ? androidInfinityProperties : pcInfinityProperties;
  const eternityProperties = saveType === SaveType.Android ? androidEternityProperties : pcEternityProperties;
  const realityProperties = saveType === SaveType.Android ? androidRealityProperties : pcRealityProperties;

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
const isPropertyRelevantForStage = (propertyPath: string, stage: ProgressionStage, saveType: SaveType): boolean => {
  const requiredProperties = getRequiredPropertiesByStage(stage, saveType);
  
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
const createStageAppropriateReference = (fullReference: any, stage: ProgressionStage, saveType: SaveType): any => {
  const stageReference: any = {};
  
  // Helper function to recursively filter properties
  const filterProperties = (source: any, target: any, currentPath = '') => {
    if (typeof source !== 'object' || source === null || Array.isArray(source)) {
      return source;
    }
    
    for (const key in source) {
      const propertyPath = currentPath ? `${currentPath}.${key}` : key;
      
      // Check if this property should exist at the current stage
      if (isPropertyRelevantForStage(propertyPath, stage, saveType)) {
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
const shouldPropertyExist = (propertyPath: string, saveData: AntimatterDimensionsStruct, stage: ProgressionStage, saveType: SaveType): boolean => {
  // Always validate core properties (but not all sub-properties)
  const coreProperties = saveType === SaveType.Android
    ? ['antimatter', 'dimensions.antimatter', 'version', 'lastUpdate', 'brake']
    : ['antimatter', 'dimensions.antimatter', 'version', 'lastUpdate'];
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
            return hasProgressValue((saveData as any).infinities) ||
              (saveType === SaveType.Android ? (saveData as any).brake === true : saveData.break === true);
    }
    
    if (propertyPath.includes('lastTenEternities') || propertyPath.includes('EternityTime')) {
            return hasProgressValue((saveData as any).eternities) ||
              hasProgressValue((saveData as any).eternityPoints);
    }
    
    if (propertyPath.includes('lastTenRealities') || propertyPath.includes('RealityTime')) {
            return hasProgressValue((saveData as any).realities);
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
      return saveType === SaveType.PC && stage === 'reality';
    }
    // Advanced speedrun properties only if actually speedrunning
    const speedrun = (saveData as any).speedrun;
    return saveType === SaveType.PC && speedrun && speedrun.isUnlocked === true;
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
    return hasProgressValue(eternityPoints);
  }
  
  // Dilation properties only exist if dilation is unlocked
  if (propertyPath.startsWith('dilation.')) {
    return (saveData.dilation && Object.keys(saveData.dilation).length > 0);
  }
  
  // Celestials properties only exist if reality is reached and celestials unlocked
  if (propertyPath.startsWith('celestials.')) {
    return hasProgressValue((saveData as any).realities);
  }
  
  // Black hole properties only exist if black holes are unlocked
  if (propertyPath.startsWith('blackHole') || propertyPath.includes('blackHole')) {
    return hasProgressValue((saveData as any).realities) && 
           (saveData as any).blackHole && Array.isArray((saveData as any).blackHole);
  }
  
  // Stage-specific logic for major properties
  switch (stage) {
    case 'early':
      // Early game - only basic properties should exist
      const earlyGameProperties = [
        ...getRequiredPropertiesByStage('early', saveType)
      ];
      return earlyGameProperties.some(prop => propertyPath.startsWith(prop));
      
    case 'infinity':
      // Infinity stage - check if infinity was actually reached
      if (propertyPath.includes('infinity') && !propertyPath.includes('eternity') && !propertyPath.includes('reality')) {
        return (saveType === SaveType.Android ? (saveData as any).brake === true : saveData.break === true) || 
               hasProgressValue((saveData as any).infinityPoints) ||
               hasProgressValue((saveData as any).infinities);
      }
      if (propertyPath.startsWith('replicanti')) {
        return saveType === SaveType.Android ? (saveData as any).brake === true : saveData.break === true;
      }
      return isPropertyRelevantForStage(propertyPath, stage, saveType) && !propertyPath.includes('eternity') && !propertyPath.includes('reality');
      
    case 'eternity':
      // Eternity stage - check if eternity was actually reached
      if (propertyPath.includes('eternity') || propertyPath.includes('timestudy') || propertyPath.includes('dilation')) {
        const eternityPoints = (saveData as any).eternityPoints;
        return hasProgressValue(eternityPoints);
      }
      return isPropertyRelevantForStage(propertyPath, stage, saveType) && !propertyPath.includes('reality');
      
    case 'reality':
      // Reality stage - most properties can exist, but still check for specific unlocks
      if (propertyPath.includes('reality') || propertyPath.includes('celestials') || propertyPath.includes('glyphs')) {
        return hasProgressValue((saveData as any).realities) ||
               (saveData.reality && Object.keys(saveData.reality).length > 0);
      }
      return isPropertyRelevantForStage(propertyPath, stage, saveType);
      
    default:
      return isPropertyRelevantForStage(propertyPath, stage, saveType);
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
    const saveType = decryptedData.saveType;
    result.progressionStage = determineProgressionStage(result.decryptedData, saveType);
    
    // Create a stage-appropriate reference template
    const stageReference = createStageAppropriateReference(fullReference, result.progressionStage, saveType);
    
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
          if (shouldPropertyExist(propertyPath, result.decryptedData!, result.progressionStage, saveType)) {
            result.errors.push(`Property ${propertyPath} should be an array`);
          }
        }
        return;
      }
      
      // Handle primitive types
      if (typeof reference !== 'object' || reference === null) {
        if (typeof decrypted !== typeof reference) {
          const propertyPath = path || 'root';
          if (shouldPropertyExist(propertyPath, result.decryptedData!, result.progressionStage, saveType)) {
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
          if (shouldPropertyExist(propertyPath, result.decryptedData!, result.progressionStage, saveType)) {
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
          if (!shouldPropertyExist(propertyPath, result.decryptedData!, result.progressionStage, saveType)) {
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
          if (shouldPropertyExist(currentPath, result.decryptedData!, result.progressionStage, saveType)) {
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
    const totalProperties = getRequiredPropertiesByStage(result.progressionStage, saveType).length;
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
  const saveType = detectSchemaFromSaveData(decryptedSave);
  const progressionStage = determineProgressionStage(decryptedSave, saveType);
  const partSimulatedReality = saveType === SaveType.Android
    ? (decryptedSave.reality as any)?.partSimulated
    : (decryptedSave as any).partSimulatedReality;
  
  // Only validate reality properties if the save has reached Reality stage
  if (progressionStage !== 'reality') {
    warnings.push(`Reality section validation skipped - save is at ${progressionStage} stage`);
    return { issues, warnings, progressionStage };
  }
  
  // Check reality-specific properties
  if (decryptedSave.realities === undefined) {
    issues.push('The "realities" property is missing');
  } else if (typeof decryptedSave.realities !== 'number' && !isDecimalObject(decryptedSave.realities)) {
    issues.push(`The "realities" property is of type ${typeof decryptedSave.realities} instead of number`);
  }
  
  if (partSimulatedReality === undefined) {
    issues.push(`The "${saveType === SaveType.Android ? 'reality.partSimulated' : 'partSimulatedReality'}" property is missing`);
  } else if (typeof partSimulatedReality !== 'number') {
    issues.push(`The "${saveType === SaveType.Android ? 'reality.partSimulated' : 'partSimulatedReality'}" property is of type ${typeof partSimulatedReality} instead of number`);
  }
  
  if (!decryptedSave.reality) {
    issues.push('The "reality" property is missing');
  } else {
    // Check reality properties
    const reality = decryptedSave.reality;
    
    if (reality.realityMachines === undefined) {
      issues.push('The "reality.realityMachines" property is missing');
    } else if (typeof reality.realityMachines !== 'string' && !isDecimalObject(reality.realityMachines)) {
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
