/**
 * Service for managing Antimatter Dimensions saves
 * Adapted from GameSaveSerializer.js
 */

// Declare pako which is imported via an external script
declare const pako: {
  deflate: (data: string | Uint8Array, options?: { to?: string }) => Uint8Array;
  inflate: (data: Uint8Array, options?: { to?: string }) => string | Uint8Array;
  gzip: (data: string | Uint8Array, options?: { to?: string }) => Uint8Array;
  ungzip: (data: Uint8Array, options?: { to?: string }) => string | Uint8Array;
};

/**
 * Type for decrypted save data
 */
export interface SaveData {
  [key: string]: any;
  gameVersion?: string;
  antimatter?: number | string;
}

/**
 * SaveType enumeration for distinguishing between PC and Android saves
 */
export enum SaveType {
  PC = "pc",
  Android = "android"
}

// Types for transformation steps
type EncodeFunction<T, U> = (input: T, type?: string) => U;
type DecodeFunction<T, U> = (input: T, type?: string) => U;

interface EncodingStep<T, U> {
  encode: EncodeFunction<T, U>;
  decode: DecodeFunction<U, T>;
  condition?: (version: string) => boolean;
}

/**
 * Service for save operations
 * Based on the original GameSaveSerializer
 */
export class SaveService {
  private static encoder = new TextEncoder();
  private static decoder = new TextDecoder();
  
  private static startingString = {
    savefile: "AntimatterDimensionsSavefileFormat",
    "automator script": "AntimatterDimensionsAutomatorScriptFormat",
    "automator data": "AntimatterDimensionsAutomatorDataFormat",
    "glyph filter": "AntimatterDimensionsGlyphFilterFormat",
    "android": "AntimatterDimensionsAndroidSaveFormat"
  };
  
  private static endingString = {
    savefile: "EndOfSavefile",
    "automator script": "EndOfAutomatorScript",
    "automator data": "EndOfAutomatorData",
    "glyph filter": "EndOfGlyphFilter",
    "android": "EndOfSavefile"
  };
  
  private static version = {
    pc: "AAB",
    android: "AAA"
  };

  private static pcSteps: EncodingStep<any, any>[] = [
    { 
      encode: (x: string): Uint8Array => SaveService.encoder.encode(x), 
      decode: (x: Uint8Array): string => SaveService.decoder.decode(x) 
    },
    { 
      encode: (x: Uint8Array): Uint8Array => pako.deflate(x) as Uint8Array, 
      decode: (x: Uint8Array): Uint8Array => pako.inflate(x) as Uint8Array 
    },
    {
      encode: (x: Uint8Array): string => Array.from(x).map(i => String.fromCharCode(i)).join(""),
      decode: (x: string): Uint8Array => Uint8Array.from(Array.from(x).map(i => i.charCodeAt(0)))
    },
    { 
      encode: (x: string): string => btoa(x), 
      decode: (x: string): string => atob(x) 
    },
    {
      encode: (x: string): string => x.replace(/=+$/gu, "").replace(/0/gu, "0a").replace(/\+/gu, "0b").replace(/\//gu, "0c"),
      decode: (x: string): string => x.replace(/0b/gu, "+").replace(/0c/gu, "/").replace(/0a/gu, "0")
    },
    {
      encode: (x: string, type: string): string => x + SaveService.endingString[type as keyof typeof SaveService.endingString],
      decode: (x: string, type: string): string => x.slice(0, x.length - SaveService.endingString[type as keyof typeof SaveService.endingString].length),
      condition: (version: string): boolean => version >= "AAB"
    }
  ];

  private static androidSteps: EncodingStep<any, any>[] = [
    { 
      encode: (x: string): Uint8Array => SaveService.encoder.encode(x), 
      decode: (x: Uint8Array): string => SaveService.decoder.decode(x) 
    },
    { 
      encode: (x: Uint8Array): Uint8Array => pako.gzip(x) as Uint8Array, 
      decode: (x: Uint8Array): Uint8Array => pako.ungzip(x) as Uint8Array 
    },
    {
      encode: (x: Uint8Array): string => Array.from(x).map(i => String.fromCharCode(i)).join(""),
      decode: (x: string): Uint8Array => Uint8Array.from(Array.from(x).map(i => i.charCodeAt(0)))
    },
    { 
      encode: (x: string): string => btoa(x), 
      decode: (x: string): string => atob(x) 
    },
    {
      encode: (x: string): string => x.replace(/=+$/gu, "").replace(/0/gu, "0a").replace(/\+/gu, "0b").replace(/\//gu, "0c"),
      decode: (x: string): string => x.replace(/0b/gu, "+").replace(/0c/gu, "/").replace(/0a/gu, "0")
    },
    {
      encode: (x: string, type: string): string => x + SaveService.endingString[type as keyof typeof SaveService.endingString],
      decode: (x: string, type: string): string => x.slice(0, x.length - SaveService.endingString[type as keyof typeof SaveService.endingString].length)
    }
  ];
  
  private static getSteps(type: string, version: string, saveType: SaveType = SaveType.PC) {
    const steps = saveType === SaveType.Android ? this.androidSteps : this.pcSteps;
    
    const filteredSteps = steps
      .filter(i => (!i.condition) || i.condition(version));
    
    const startKey = saveType === SaveType.Android ? "android" : type;
    const versionValue = saveType === SaveType.Android ? this.version.android : this.version.pc;
    
    return filteredSteps.concat({
      encode: (x: string): string => `${SaveService.startingString[startKey as keyof typeof SaveService.startingString] + versionValue}${x}`,
      decode: (x: string): string => x.slice(SaveService.startingString[startKey as keyof typeof SaveService.startingString].length + 3)
    });
  }
  
  // Custom implementation to handle transformations
  private static encodeText(text: string, type: string, saveType: SaveType = SaveType.PC): string {
    let result: any = text;
    const steps = this.getSteps(type, saveType === SaveType.Android ? this.version.android : this.version.pc, saveType);
    
    for (const step of steps) {
      result = step.encode(result, type);
    }
    
    return result as string;
  }
  
  private static decodeText(text: string, type: string): { decoded: string, saveType: SaveType } {
    // Detect save type
    let saveType = SaveType.PC;
    let actualType = type;
    
    if (text.startsWith(this.startingString.android)) {
      saveType = SaveType.Android;
      actualType = "android";
    }
    
    if (text.startsWith(this.startingString[actualType as keyof typeof SaveService.startingString])) {
      const len = this.startingString[actualType as keyof typeof SaveService.startingString].length;
      const version = text.slice(len, len + 3);
      const steps = this.getSteps(actualType, version, saveType);
      
      let result: any = text;
      for (let i = steps.length - 1; i >= 0; i--) {
        result = steps[i].decode(result, actualType);
      }
      
      return { decoded: result as string, saveType };
    }
    
    // Fallback for old format
    return { decoded: atob(text), saveType: SaveType.PC };
  }
  
  private static jsonConverter(key: string, value: any): any {
    if (value === Infinity) {
      return "Infinity";
    }
    if (value instanceof Set) {
      return Array.from(value.keys());
    }
    return value;
  }

  /**
   * Detects the save type from an encoded save string
   * @param encodedSaveData Encoded save string
   * @returns SaveType enum value
   */
  static detectSaveType(encodedSaveData: string): SaveType {
    if (typeof encodedSaveData !== "string") return SaveType.PC;
    
    // Clean the save from unwanted characters
    const cleanedData = encodedSaveData.trim().replace(/\\r/g, '');
    
    if (cleanedData.startsWith(this.startingString.android)) {
      return SaveType.Android;
    }
    
    return SaveType.PC;
  }

  /**
   * Encrypts a save object
   * @param saveData Object to encrypt
   * @param saveType Type of save format to use
   * @returns Encoded string or null if failed
   */
  static encrypt(saveData: SaveData, saveType: SaveType = SaveType.PC): string | null {
    try {
      const json = JSON.stringify(saveData, this.jsonConverter);
      return this.encodeText(json, "savefile", saveType);
    } catch (error) {
      console.error('Error during encryption:', error);
      return null;
    }
  }

  /**
   * Decrypts an encoded save
   * @param encodedSaveData Encoded character string
   * @returns Decoded JSON object, save type, and null if failed
   */
  static decrypt(encodedSaveData: string): { data: SaveData | null, saveType: SaveType } {
    if (typeof encodedSaveData !== "string") return { data: null, saveType: SaveType.PC };
    
    try {
      // Clean the save from unwanted characters
      const cleanedData = encodedSaveData.trim().replace(/\\r/g, '');
      
      const { decoded, saveType } = this.decodeText(cleanedData, "savefile");
      return { 
        data: JSON.parse(decoded, (k, v) => (v === "Infinity" ? Infinity : v)),
        saveType
      };
    } catch (error) {
      console.error('Error during decryption:', error);
      return { data: null, saveType: SaveType.PC };
    }
  }

  /**
   * Validates if a save has the correct format
   * This validation is basic and accepts any save that is an object
   */
  static validateSave(saveData: SaveData): boolean {
    // Simply check that we have an object and not null
    if (!saveData || typeof saveData !== 'object' || Array.isArray(saveData)) {
      console.error('Save is not a valid object');
      return false;
    }
    
    return true;
  }
} 