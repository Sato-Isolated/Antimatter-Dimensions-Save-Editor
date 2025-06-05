import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { SaveService, SaveType } from "../services/SaveService";
import { testSaveData, checkRealitySection } from "../utils/testSave";

// Interface for save context
export interface SaveContextType {
  originalSaveData: any;
  modifiedSaveData: any;
  encryptedSave: string;
  rawSaveData: string;
  encodedOutputData: string;
  isLoaded: boolean;
  saveType: SaveType;
  testResults: { success: boolean; errors: string[] } | null;
  errorMessage: string | null;
  decryptSave: () => void;
  encryptSave: () => string;
  updateSaveData: (path: string, value: any) => void;
  setRawSaveData: (data: string) => void;
  testSave: () => void;
}

// Creation of context with default values
const SaveContext = createContext<SaveContextType>({
  originalSaveData: null,
  modifiedSaveData: null,
  encryptedSave: "",
  rawSaveData: "",
  encodedOutputData: "",
  isLoaded: false,
  saveType: SaveType.PC,
  testResults: null,
  errorMessage: null,
  decryptSave: () => {},
  encryptSave: () => "",
  updateSaveData: () => {},
  setRawSaveData: () => {},
  testSave: () => {},
});

// Custom hook to use the save context
export const useSave = () => useContext(SaveContext);

// Props for the context provider
interface SaveProviderProps {
  children: ReactNode;
}

// Save context provider
export const SaveProvider: React.FC<SaveProviderProps> = ({ children }) => {
  // State to store save data
  const [originalSaveData, setOriginalSaveData] = useState<any>(null);
  const [modifiedSaveData, setModifiedSaveData] = useState<any>(null);
  const [encryptedSave, setEncryptedSave] = useState<string>("");
  const [rawSaveData, setRawSaveData] = useState<string>("");
  const [encodedOutputData, setEncodedOutputData] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [saveType, setSaveType] = useState<SaveType>(SaveType.PC);
  const [testResults, setTestResults] = useState<{
    success: boolean;
    errors: string[];
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Function to decrypt a save
  const decryptSave = () => {
    try {
      // Use rawSaveData as the input
      const encryptedSaveData = rawSaveData;

      // Reset errors
      setErrorMessage(null);

      // Detect save type first
      const detectedSaveType = SaveService.detectSaveType(encryptedSaveData);
      setSaveType(detectedSaveType);

      // Decrypt the save
      const decryptResult = SaveService.decrypt(encryptedSaveData);

      if (
        !decryptResult.data ||
        !SaveService.validateSave(decryptResult.data)
      ) {
        console.error("Save data is invalid or corrupted");
        setErrorMessage("Save data is invalid or corrupted");
        setIsLoaded(false);
        return;
      }

      // Update states
      setOriginalSaveData(decryptResult.data);
      setModifiedSaveData(decryptResult.data);
      setEncryptedSave(encryptedSaveData);
      setIsLoaded(true);

      console.log(
        `Save decrypted successfully (${decryptResult.saveType}):`,
        decryptResult.data
      );
    } catch (error) {
      console.error("Error decrypting save:", error);
      setErrorMessage(`Error decrypting save: ${error}`);
      setIsLoaded(false);
    }
  };

  // Function to encrypt a save
  const encryptSave = (): string => {
    try {
      // Reset errors
      setErrorMessage(null);

      if (!modifiedSaveData) {
        console.error("No save data to encrypt");
        setErrorMessage("No save data to encrypt");
        return "";
      }

      // Encrypt the modified save using the detected save type
      const encrypted = SaveService.encrypt(modifiedSaveData, saveType);
      if (!encrypted) {
        console.error("Encryption failed");
        setErrorMessage("Encryption failed");
        return "";
      }

      setEncryptedSave(encrypted);
      setEncodedOutputData(encrypted);

      console.log(`Save encrypted successfully as ${saveType} format`);
      return encrypted;
    } catch (error) {
      console.error("Error encrypting save:", error);
      setErrorMessage(`Error encrypting save: ${error}`);
      return "";
    }
  };

  // Function to test the save
  const testSave = async () => {
    if (!modifiedSaveData) {
      setTestResults({
        success: false,
        errors: ["No save to test"],
      });
      return;
    }

    try {
      // Get content of save.json file
      let saveJsonContent = "";

      // In a web environment, use fetch
      try {
        const response = await fetch("./pc.json");
        if (response.ok) {
          saveJsonContent = await response.text();
        } else {
          throw new Error(`Error retrieving pc.json file: ${response.status}`);
        }
      } catch (fetchError) {
        console.error("Error with fetch, trying with import:", fetchError);

        // If fetch fails, try another approach
        try {
          const saveJsonModule = await import("../../pc.json");
          saveJsonContent = JSON.stringify(saveJsonModule.default);
        } catch (importError) {
          setTestResults({
            success: false,
            errors: [`Unable to load pc.json file: ${importError}`],
          });
          return;
        }
      }

      // Encrypt the modified data
      const encrypted = SaveService.encrypt(modifiedSaveData);
      if (!encrypted) {
        setTestResults({
          success: false,
          errors: ["Failed to encrypt data"],
        });
        return;
      }

      // Test the data
      const results = testSaveData(encrypted, saveJsonContent);

      // Specifically check the Reality section
      const realityCheck = checkRealitySection(modifiedSaveData);

      // Combine the results
      setTestResults({
        success: results.success && realityCheck.issues.length === 0,
        errors: [...results.errors, ...realityCheck.issues],
      });

      // Display results in console for debugging
      console.log("Test results:", {
        generalResults: results,
        realityCheck: realityCheck,
      });
    } catch (error) {
      setTestResults({
        success: false,
        errors: [`Error during test: ${error}`],
      });
    }
  };

  // Function to update save data
  const updateSaveData = (path: string, value: any) => {
    if (!modifiedSaveData) return;

    // Deep copy of modified data
    const updatedData = JSON.parse(JSON.stringify(modifiedSaveData));

    // If the path is empty, replace all data
    if (!path) {
      setModifiedSaveData(value);
      return;
    }

    // Update the specified path
    try {
      // Split path by dots
      const parts = path.split(".");

      // Navigate through the tree up to the second-to-last element
      let current = updatedData;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];

        // Handle array indexing
        if (part.includes("[") && part.includes("]")) {
          const arrayName = part.substring(0, part.indexOf("["));
          const indexStr = part.substring(
            part.indexOf("[") + 1,
            part.indexOf("]")
          );
          const index = parseInt(indexStr, 10);

          // Create the array if it doesn't exist
          if (!current[arrayName]) {
            current[arrayName] = [];
          }

          // Create intermediate objects if needed
          if (!current[arrayName][index]) {
            current[arrayName][index] = {};
          }

          current = current[arrayName][index];
        } else {
          // For regular object properties
          // Create intermediate objects if needed
          if (!current[part]) {
            current[part] = {};
          }

          current = current[part];
        }
      }

      // Update the final value
      const lastPart = parts[parts.length - 1];

      // Handle array indexing for the last part
      if (lastPart.includes("[") && lastPart.includes("]")) {
        const arrayName = lastPart.substring(0, lastPart.indexOf("["));
        const indexStr = lastPart.substring(
          lastPart.indexOf("[") + 1,
          lastPart.indexOf("]")
        );
        const index = parseInt(indexStr, 10);

        // Create the array if it doesn't exist
        if (!current[arrayName]) {
          current[arrayName] = [];
        }

        // Update the specific array element
        current[arrayName][index] = value;
      } else {
        // For regular object properties
        current[lastPart] = value;
      }

      // Update state
      setModifiedSaveData(updatedData);
    } catch (error) {
      console.error(`Error updating save data at path ${path}:`, error);
    }
  };

  // Provide the context to child components
  return (
    <SaveContext.Provider
      value={{
        originalSaveData,
        modifiedSaveData,
        encryptedSave,
        rawSaveData,
        encodedOutputData,
        isLoaded,
        saveType,
        testResults,
        errorMessage,
        decryptSave,
        encryptSave,
        updateSaveData,
        setRawSaveData,
        testSave,
      }}
    >
      {children}
    </SaveContext.Provider>
  );
};

export default SaveContext;
