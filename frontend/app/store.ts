import { create } from "zustand";

type StepState = {
  step: number;
  setStep: (step: number) => void;
};

export const useStepStore = create<StepState>((set) => ({
  step: 1,
  setStep: (step: number) => set({ step }),
}));

//Handling Eligibility Form Data

type FileDetails = {
    id: number;
    name: string;
    size: string;
    type: string;
  };

type FormData = {
  name: string;
  country: string;
  caseId?: string;
  description: string;
  rejectionHistory: string;
  appealAttempts: number;
};

type FormStore = {
  formData: FormData;
  uploadedFiles: FileDetails[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void; // Centralized handleChange function
  addFiles: (newFiles: FileDetails[]) => void; // Add files to the store
  removeFile: (id: number) => void; // Remove a file by ID
};

export const useFormStore = create<FormStore>((set) => ({
  formData: {
    name: "",
    country: "",
    caseId: "",
    description: "",
    rejectionHistory: "",
    appealAttempts: 0,
  },
  uploadedFiles: [], // Initialize the files array
  handleChange: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      formData: {
        ...state.formData,
        [name]: value, // Dynamically update the field based on `name`
      },
    }));
  },

  // Add files to the store
  addFiles: (newFiles) =>
    set((state) => ({
        uploadedFiles: [...state.uploadedFiles, ...newFiles], // Append new files to the existing array
    })),

  // Remove a file by its unique ID
  removeFile: (id) =>
    set((state) => ({
        uploadedFiles: state.uploadedFiles.filter((file) => file.id !== id), // Filter out the file with the given ID
    })),
}));



type EligibilityState = {
  eligibilityData: any;
  setEligibilityData: (data: any) => void;
};

export const useEligibilityStore = create<EligibilityState>((set) => ({
  eligibilityData: null,
  setEligibilityData: (data) => set({ eligibilityData: data }),
}));



////////////////


// Define the schema for form data
type Data = {
  complainant: {
    firstName: string;
    familyName: string;
    dob: string;
    nationality: string;
    email: string;
    phone: string;
    address: string;
  };
  victim: {
    firstName: string;
    familyName: string;
    dob: string;
    nationality: string;
  };
  anonymizationPreference: boolean;
  countriesInvolved: {
    countries: string;
  }
  priorSubmissions: {
    hasSubmitted: boolean;
    details: string;
  };
  interimMeasures: {
    isRequesting: boolean;
    details: string;
  };
  facts: string;
  lawyer: {
    firstName: string;
    familyName: string;
    email: string;
    phone: string;
    address: string;
  };
  feedback:{
    content: string;
  }
};

// Define the Zustand store
type DataStore = {
  Data: Data;
  updateField: (
    section: keyof Data,
    field: string,
    value: string | boolean | string[]
  ) => void;
  // resetForm: () => void;
};

export const useDataStore = create<DataStore>((set) => ({
 Data: {
    complainant: {
      firstName: "",
      familyName: "",
      dob: "",
      nationality: "",
      email: "",
      phone: "",
      address: "",
    },
    victim: {
      firstName: "",
      familyName: "",
      dob: "",
      nationality: "",
    },
    anonymizationPreference: true,
    countriesInvolved: {
      countries: "",
    },
    priorSubmissions: {
      hasSubmitted: false,
      details: "",
    },
    interimMeasures: {
      isRequesting: false,
      details: "",
    },
    facts: "",
    lawyer: {
      firstName: "",
      familyName: "",
      email: "",
      phone: "",
      address: "",
    },
    feedback:{
      content: "",
    }
  },


    updateField: (section, field, value) =>
      set((state) => {
      
        // Check if the section is an object
        if (typeof state.Data[section] === "object" && !Array.isArray(state.Data[section])) {
          return {
            Data: {
              ...state.Data,
              [section]: {
                ...state.Data[section],
                [field]: value,
              },
            },
          };
        } else {
          // For non-object fields (e.g., strings, arrays)
          return {
            Data: {
              ...state.Data,
              [section]: value,
            },
          };
        }
      }),
    

  // resetForm: () =>
  //   set(() => ({
  //     Data: {
  //       complainant: {
  //         firstName: "",
  //         familyName: "",
  //         dob: "",
  //         nationality: "",
  //         email: "",
  //         phone: "",
  //         address: "",
  //       },
  //       victim: {
  //         firstName: "",
  //         familyName: "",
  //         dob: "",
  //         nationality: "",
  //       },
  //       anonymizationPreference: false,
  //       countriesInvolved: {
  //         countries: ""
  //       },
  //       priorSubmissions: {
  //         hasSubmitted: false,
  //         details: "",
  //       },
  //       interimMeasures: {
  //         isRequesting: false,
  //         details: "",
  //       },
  //       facts: "",
  //       lawyer: {
  //         firstName: "",
  //         familyName: "",
  //         email: "",
  //         phone: "",
  //         address: "",
  //       },
  //     },
  //   })),
}));


type ResultState = {
  resultData: any;
  setResultData: (data: any) => void;
};

export const useResultStore = create<ResultState>((set) => ({
  resultData: null,
  setResultData: (data) => set({ resultData: data }),
}));
