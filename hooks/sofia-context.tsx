import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WisdomFlowerParams {
  I: number;
  II: number;
  III: number;
  IV: number;
  V: number;
  A: number;
  B: number;
  C: number;
  D: number;
  spirit_line: {
    "20_40": number;
    "40_60": number;
    "60_plus": number;
  };
  matter_line: {
    "20_40": number;
    "40_60": number;
    "60_plus": number;
  };
  connection: {
    "20_40": number;
    "40_60": number;
    "60_plus": number;
  };
}

export interface SavedProfile {
  id: string;
  name: string;
  birthdate: Date;
  wisdomFlowerParams: WisdomFlowerParams;
  age: number;
  createdAt: Date;
}

export interface SavedRecipe {
  id: string;
  profileId: string;
  profileName: string;
  recipeName: string;
  createdAt: Date;
  ingredients: {
    parameter: string;
    energy: string;
    mainOil: string;
    additionalOils: string[];
    drops: number;
  }[];
}

export const [SofiaContext, useSofiaContext] = createContextHook(() => {
  const [answers, setAnswersState] = useState<string[]>([]);
  const [recommendedRecipe, setRecommendedRecipe] = useState<string>('');
  const [birthdate, setBirthdateState] = useState<Date | null>(null);
  const [wisdomFlowerParams, setWisdomFlowerParamsState] = useState<WisdomFlowerParams | null>(null);
  const [age, setAge] = useState<number>(0);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUsedBirthdate, setLastUsedBirthdate] = useState<Date | null>(null);

  const setAnswers = useCallback((newAnswers: string[], recipe: string) => {
    setAnswersState(newAnswers);
    setRecommendedRecipe(recipe);
  }, []);

  const setBirthdate = useCallback((date: Date) => {
    setBirthdateState(date);
    setLastUsedBirthdate(date);
    // Calculate age
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthYear = date.getFullYear();
    const calculatedAge = currentYear - birthYear;
    setAge(calculatedAge);
  }, []);

  const setWisdomFlowerParams = useCallback((params: WisdomFlowerParams) => {
    setWisdomFlowerParamsState(params);
  }, []);

  // Load saved data on initialization
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const profilesData = await AsyncStorage.getItem('sofia_profiles');
        const recipesData = await AsyncStorage.getItem('sofia_recipes');
        
        if (profilesData) {
          const profiles = JSON.parse(profilesData).map((profile: any) => ({
            ...profile,
            birthdate: new Date(profile.birthdate),
            createdAt: new Date(profile.createdAt)
          }));
          setSavedProfiles(profiles);
        }
        
        if (recipesData) {
          const recipes = JSON.parse(recipesData).map((recipe: any) => ({
            ...recipe,
            createdAt: new Date(recipe.createdAt)
          }));
          setSavedRecipes(recipes);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSavedData();
  }, []);

  const saveProfile = useCallback(async (name: string, birthdate: Date, wisdomFlowerParams: WisdomFlowerParams, age: number) => {
    try {
      const newProfile: SavedProfile = {
        id: Date.now().toString(),
        name,
        birthdate,
        wisdomFlowerParams,
        age,
        createdAt: new Date()
      };
      
      const updatedProfiles = [...savedProfiles, newProfile];
      setSavedProfiles(updatedProfiles);
      
      await AsyncStorage.setItem('sofia_profiles', JSON.stringify(updatedProfiles));
      return newProfile;
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }, [savedProfiles]);

  const deleteProfile = useCallback(async (profileId: string) => {
    try {
      console.log('Deleting profile with ID:', profileId);
      const updatedProfiles = savedProfiles.filter(profile => profile.id !== profileId);
      const updatedRecipes = savedRecipes.filter(recipe => recipe.profileId !== profileId);
      
      console.log('Updated profiles count:', updatedProfiles.length);
      console.log('Updated recipes count:', updatedRecipes.length);
      
      setSavedProfiles(updatedProfiles);
      setSavedRecipes(updatedRecipes);
      
      await AsyncStorage.setItem('sofia_profiles', JSON.stringify(updatedProfiles));
      await AsyncStorage.setItem('sofia_recipes', JSON.stringify(updatedRecipes));
      
      console.log('Profile deleted successfully');
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }, [savedProfiles, savedRecipes]);

  const saveRecipe = useCallback(async (profileId: string, profileName: string, recipeName: string, ingredients: SavedRecipe['ingredients']) => {
    try {
      const newRecipe: SavedRecipe = {
        id: Date.now().toString(),
        profileId,
        profileName,
        recipeName,
        createdAt: new Date(),
        ingredients
      };
      
      const updatedRecipes = [...savedRecipes, newRecipe];
      setSavedRecipes(updatedRecipes);
      
      await AsyncStorage.setItem('sofia_recipes', JSON.stringify(updatedRecipes));
      return newRecipe;
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw error;
    }
  }, [savedRecipes]);

  const deleteRecipe = useCallback(async (recipeId: string) => {
    try {
      console.log('Deleting recipe with ID:', recipeId);
      const updatedRecipes = savedRecipes.filter(recipe => recipe.id !== recipeId);
      console.log('Updated recipes count:', updatedRecipes.length);
      
      setSavedRecipes(updatedRecipes);
      
      await AsyncStorage.setItem('sofia_recipes', JSON.stringify(updatedRecipes));
      console.log('Recipe deleted successfully');
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }, [savedRecipes]);

  const loadProfile = useCallback((profile: SavedProfile) => {
    setBirthdateState(profile.birthdate);
    setWisdomFlowerParamsState(profile.wisdomFlowerParams);
    setAge(profile.age);
  }, []);

  const clearAllData = useCallback(async () => {
    try {
      console.log('Clearing all data...');
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('sofia_profiles');
      await AsyncStorage.removeItem('sofia_recipes');
      
      // Clear state
      setSavedProfiles([]);
      setSavedRecipes([]);
      setAnswersState([]);
      setRecommendedRecipe('');
      setBirthdateState(null);
      setWisdomFlowerParamsState(null);
      setAge(0);
      setLastUsedBirthdate(null);
      
      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }, []);

  return useMemo(() => ({
    answers,
    recommendedRecipe,
    birthdate,
    wisdomFlowerParams,
    age,
    savedProfiles,
    savedRecipes,
    isLoading,
    lastUsedBirthdate,
    setAnswers,
    setBirthdate,
    setWisdomFlowerParams,
    saveProfile,
    deleteProfile,
    saveRecipe,
    deleteRecipe,
    loadProfile,
    clearAllData,
  }), [
    answers,
    recommendedRecipe,
    birthdate,
    wisdomFlowerParams,
    age,
    savedProfiles,
    savedRecipes,
    isLoading,
    lastUsedBirthdate,
    setAnswers,
    setBirthdate,
    setWisdomFlowerParams,
    saveProfile,
    deleteProfile,
    saveRecipe,
    deleteRecipe,
    loadProfile,
    clearAllData,
  ]);
});