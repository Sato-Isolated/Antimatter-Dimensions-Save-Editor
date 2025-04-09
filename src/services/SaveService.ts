/**
 * Service for managing Antimatter Dimensions saves
 * Adapted from GameSaveSerializer.js
 */

// Declare pako which is imported via an external script
declare const pako: {
  deflate: (data: string | Uint8Array, options?: { to?: string }) => Uint8Array;
  inflate: (data: Uint8Array, options?: { to?: string }) => string | Uint8Array;
};

/**
 * Type for decrypted save data
 */
export interface SaveData {
  [key: string]: any;
  gameVersion?: string;
  antimatter?: number | string;
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
  };
  
  private static endingString = {
    savefile: "EndOfSavefile",
    "automator script": "EndOfAutomatorScript",
    "automator data": "EndOfAutomatorData",
    "glyph filter": "EndOfGlyphFilter",
  };
  
  private static version = "AAB";
  
  private static steps = [
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
  
  private static getSteps(type: string, version: string) {
    return this.steps
      .filter(i => (!i.condition) || i.condition(version))
      .concat({
        encode: (x: string): string => `${SaveService.startingString[type as keyof typeof SaveService.startingString] + SaveService.version}${x}`,
        decode: (x: string): string => x.slice(SaveService.startingString[type as keyof typeof SaveService.startingString].length + 3)
      });
  }
  
  // Custom implementation to handle transformations
  private static encodeText(text: string, type: string): string {
    let result: any = text;
    const steps = this.getSteps(type, this.version);
    
    for (const step of steps) {
      result = step.encode(result, type);
    }
    
    return result as string;
  }
  
  private static decodeText(text: string, type: string): string {
    if (text.startsWith(this.startingString[type as keyof typeof SaveService.startingString])) {
      const len = this.startingString[type as keyof typeof SaveService.startingString].length;
      const version = text.slice(len, len + 3);
      const steps = this.getSteps(type, version);
      
      let result: any = text;
      for (let i = steps.length - 1; i >= 0; i--) {
        result = steps[i].decode(result, type);
      }
      
      return result as string;
    }
    return atob(text);
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
   * Encrypts a save object
   * @param saveData Object to encrypt
   * @returns Encoded string or null if failed
   */
  static encrypt(saveData: SaveData): string | null {
    try {
      const json = JSON.stringify(saveData, this.jsonConverter);
      return this.encodeText(json, "savefile");
    } catch (error) {
      console.error('Error during encryption:', error);
      return null;
    }
  }

  /**
   * Decrypts an encoded save
   * @param encodedSaveData Encoded character string
   * @returns Decoded JSON object or null if failed
   */
  static decrypt(encodedSaveData: string): SaveData | null {
    if (typeof encodedSaveData !== "string") return null;
    
    try {
      // Clean the save from unwanted characters
      const cleanedData = encodedSaveData.trim().replace(/\\r/g, '');
      
      const json = this.decodeText(cleanedData, "savefile");
      return JSON.parse(json, (k, v) => (v === "Infinity" ? Infinity : v));
    } catch (error) {
      console.error('Error during decryption:', error);
      return null;
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