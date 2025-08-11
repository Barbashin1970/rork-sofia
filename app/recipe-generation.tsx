import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flower2, ArrowRight, Droplets, Clock, Heart, Save, X, LogOut } from 'lucide-react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useSofiaContext } from '@/hooks/sofia-context';
import { oilsData, recipesData } from '@/constants/oils-data';

interface RecipeIngredient {
  parameter: string;
  parameterName: string;
  value: number;
  energy: string;
  mainOil: string;
  additionalOils: string[];
  drops: number;
}

export default function RecipeGenerationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { recommendedRecipe, wisdomFlowerParams, age, savedProfiles, saveRecipe, saveProfile, birthdate } = useSofiaContext();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaveOptions, setShowSaveOptions] = useState<boolean>(false);
  const [newProfileName, setNewProfileName] = useState<string>('');
  
  const selectedRecipe = params.selectedRecipe as string || recommendedRecipe;
  const profileName = params.profileName as string;
  const viewExisting = params.viewExisting === 'true';
  const isFromQuestionnaire = !profileName && !viewExisting; // Coming from questionnaire flow

  const recipeData = useMemo(() => {
    if (!selectedRecipe || !wisdomFlowerParams) return null;

    let actualRecipeName = selectedRecipe;
    
    // Handle age-specific recipes
    if (selectedRecipe === 'Аромат предназначения') {
      if (age >= 60) {
        actualRecipeName = 'Аромат предназначения';
      } else if (age >= 40) {
        actualRecipeName = 'Аромат предназначения';
      } else {
        actualRecipeName = 'Аромат предназначения';
      }
    }

    const recipe = recipesData[actualRecipeName];
    if (!recipe) return null;

    const ingredients: RecipeIngredient[] = [];
    let totalDrops = 0;

    recipe.parameters.forEach(param => {
      let value: number;
      let parameterName: string;

      if (param === 'spirit_line') {
        if (age >= 60) {
          value = wisdomFlowerParams.spirit_line["60_plus"];
          parameterName = 'Линия духа 60+';
        } else if (age >= 40) {
          value = wisdomFlowerParams.spirit_line["40_60"];
          parameterName = 'Линия духа 40-60';
        } else {
          value = wisdomFlowerParams.spirit_line["20_40"];
          parameterName = 'Линия духа 20-40';
        }
      } else if (param === 'matter_line') {
        if (age >= 60) {
          value = wisdomFlowerParams.matter_line["60_plus"];
          parameterName = 'Линия материи 60+';
        } else if (age >= 40) {
          value = wisdomFlowerParams.matter_line["40_60"];
          parameterName = 'Линия материи 40-60';
        } else {
          value = wisdomFlowerParams.matter_line["20_40"];
          parameterName = 'Линия материи 20-40';
        }
      } else if (param === 'connection') {
        if (age >= 60) {
          value = wisdomFlowerParams.connection["60_plus"];
          parameterName = 'Соединение 60+';
        } else if (age >= 40) {
          value = wisdomFlowerParams.connection["40_60"];
          parameterName = 'Соединение 40-60';
        } else {
          value = wisdomFlowerParams.connection["20_40"];
          parameterName = 'Соединение 20-40';
        }
      } else {
        value = wisdomFlowerParams[param as keyof typeof wisdomFlowerParams] as number;
        parameterName = param;
      }

      const oilData = oilsData[value];
      if (oilData) {
        const drops = Math.min(oilData.recommendedDrops, 2); // Max 2 drops per oil for blend
        ingredients.push({
          parameter: param,
          parameterName,
          value,
          energy: oilData.energy,
          mainOil: oilData.mainOil,
          additionalOils: oilData.additionalOils,
          drops,
        });
        totalDrops += drops;
      }
    });

    return {
      recipe,
      ingredients,
      totalDrops,
    };
  }, [selectedRecipe, wisdomFlowerParams, age]);



  const handleSaveRecipe = async () => {
    if (!recipeData || !wisdomFlowerParams) return;
    
    if (isFromQuestionnaire) {
      // Check if profile with this birthdate already exists
      const existingProfile = savedProfiles.find(p => 
        birthdate && p.birthdate.getTime() === birthdate.getTime()
      );
      
      if (existingProfile) {
        // Add recipe to existing profile
        await saveRecipeToProfile(existingProfile.id, existingProfile.name);
      } else {
        // Show modal to create new profile
        setShowSaveOptions(true);
      }
    } else {
      // Save to current profile
      const currentProfile = savedProfiles.find(p => p.name === profileName);
      if (currentProfile) {
        await saveRecipeToProfile(currentProfile.id, currentProfile.name);
      }
    }
  };

  const saveRecipeToProfile = async (profileId: string, profileName: string) => {
    if (!recipeData) return;
    
    setIsSaving(true);
    try {
      const ingredientsForSaving = recipeData.ingredients.map(ingredient => ({
        parameter: ingredient.parameterName,
        energy: ingredient.energy,
        mainOil: ingredient.mainOil,
        additionalOils: ingredient.additionalOils,
        drops: ingredient.drops,
      }));
      
      await saveRecipe(
        profileId,
        profileName,
        recipeData.recipe.name,
        ingredientsForSaving
      );
      
      Alert.alert(
        'Рецепт сохранён',
        `Рецепт "${recipeData.recipe.name}" успешно сохранён для профиля "${profileName}"!`,
        [{ text: 'OK', onPress: () => {
          console.log('Navigating to my-recipes after recipe save');
          router.replace('/my-recipes');
        }}]
      );
    } catch {
      Alert.alert('Ошибка', 'Не удалось сохранить рецепт');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewProfile = async () => {
    if (!newProfileName.trim()) {
      Alert.alert('Ошибка', 'Введите имя профиля');
      return;
    }

    if (!birthdate || !wisdomFlowerParams || !recipeData) {
      Alert.alert('Ошибка', 'Данные для создания профиля не найдены');
      return;
    }

    setIsSaving(true);
    try {
      // Create new profile
      const newProfile = await saveProfile(newProfileName.trim(), birthdate, wisdomFlowerParams, age);
      
      // Save recipe to new profile
      await saveRecipeToProfile(newProfile.id, newProfile.name);
      
      setShowSaveOptions(false);
      setNewProfileName('');
      
      // Navigate to my recipes page
      console.log('Navigating to my-recipes after profile creation');
      router.replace('/my-recipes');
    } catch {
      Alert.alert('Ошибка', 'Не удалось создать профиль и сохранить рецепт');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinish = () => {
    if (isFromQuestionnaire) {
      // Show save options or go to my recipes
      Alert.alert(
        'Сохранить рецепт?',
        'Хотите сохранить этот рецепт для дальнейшего использования?',
        [
          { 
            text: 'Выйти без сохранения', 
            style: 'cancel',
            onPress: () => {
              console.log('Navigating to home without saving');
              router.replace('/');
            }
          },
          {
            text: 'Сохранить рецепт',
            onPress: handleSaveRecipe
          }
        ]
      );
    } else {
      console.log('Navigating to home from finish');
      router.replace('/');
    }
  };

  if (!recipeData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Создаю ваш персональный рецепт...</Text>
      </View>
    );
  }

  const { recipe, ingredients, totalDrops } = recipeData;

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Персональный рецепт',
          headerStyle: { backgroundColor: '#f8f4f0' },
          headerTintColor: '#8b7355',
        }} 
      />
      <LinearGradient
        colors={['#f8f4f0', '#e8ddd4']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerCard}>
            <Flower2 size={48} color="#d4af37" />
            <Text style={styles.title}>Ваша персональная аромасмесь</Text>
            <Text style={styles.recipeName}>&ldquo;{recipe.name}&rdquo;</Text>
            <Text style={styles.subtitle}>{recipe.purpose}</Text>
          </View>

          <View style={styles.recipeCard}>
            <Text style={styles.sectionTitle}>Состав смеси</Text>
            <Text style={styles.recipeDescription}>
              Рецепт смеси &ldquo;{recipe.name}&rdquo; состоит из параметров {recipe.parameters.join(', ')}, 
              рассчитанных индивидуально по вашему Цветку Мудрости:
            </Text>
            
            {ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientCard}>
                <View style={styles.ingredientHeader}>
                  <Text style={styles.ingredientParameter}>
                    {ingredient.parameterName} ({ingredient.value})
                  </Text>
                  <View style={styles.energyBadge}>
                    <Text style={styles.energyText}>{ingredient.energy}</Text>
                  </View>
                </View>
                <View style={styles.oilInfo}>
                  <Droplets size={16} color="#8b7355" />
                  <Text style={styles.oilName}>{ingredient.mainOil}</Text>
                  <Text style={styles.dropsText}>— {ingredient.drops} капли</Text>
                </View>
                <Text style={styles.additionalOils}>
                  Дополнительные: {ingredient.additionalOils.join(', ')}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.instructionsCard}>
            <Text style={styles.sectionTitle}>Рецепт для флакона 5 мл</Text>
            
            <View style={styles.baseOilSection}>
              <Text style={styles.baseOilTitle}>Базовое масло:</Text>
              <Text style={styles.baseOilText}>~5 мл (миндальное, жожоба или виноградной косточки)</Text>
            </View>

            <View style={styles.essentialOilsSection}>
              <Text style={styles.essentialOilsTitle}>Эфирные масла (всего {totalDrops} капель):</Text>
              {ingredients.map((ingredient, index) => (
                <Text key={index} style={styles.oilInstruction}>
                  • {ingredient.mainOil}: {ingredient.drops} капли
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.usageCard}>
            <Text style={styles.sectionTitle}>Применение</Text>
            
            <View style={styles.usageMethod}>
              <Clock size={20} color="#8b7355" />
              <Text style={styles.usageTitle}>Когда использовать:</Text>
            </View>
            <Text style={styles.usageText}>{recipe.whenToUse}</Text>

            <View style={styles.usageMethod}>
              <Heart size={20} color="#8b7355" />
              <Text style={styles.usageTitle}>Как помогает:</Text>
            </View>
            <Text style={styles.usageText}>{recipe.helps}</Text>

            <View style={styles.ritualSection}>
              <Text style={styles.ritualTitle}>Ритуал применения:</Text>
              <Text style={styles.ritualText}>
                • Используйте смесь ежедневно утром или вечером{"\n"}
                • Наносите на запястья, шею и зону солнечного сплетения{"\n"}
                • Сопровождайте ритуал применением аффирмаций или медитацией{"\n"}
                • Ведите дневник ощущений: фиксируйте мысли, сны и изменения в состоянии
              </Text>
            </View>
          </View>

          <View style={styles.safetyCard}>
            <Text style={styles.safetyTitle}>⚠️ Важные рекомендации по безопасности</Text>
            <Text style={styles.safetyText}>
              • Никогда не наносите чистые эфирные масла на кожу, всегда разбавляйте базовым маслом{"\n"}
              • Проводите тест на индивидуальную реакцию (на сгибе локтя){"\n"}
              • Не применяйте при беременности без консультации со специалистом{"\n"}
              • Рецепт носит информационный характер и не заменяет медицинскую консультацию
            </Text>
          </View>

          <View style={styles.alternativesCard}>
            <Text style={styles.sectionTitle}>Варианты использования</Text>
            <Text style={styles.alternativesText}>
              • Ингаляционный карандаш для портативного использования{"\n"}
              • Аромамедальон для постоянного ношения{"\n"}
              • Аромакамень для локального применения{"\n"}
              • Аромадиффузор для ароматизации помещения{"\n"}
              • При неприятии какого-либо масла замените на дополнительное из той же группы энергий
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            {(profileName && !viewExisting) || isFromQuestionnaire ? (
              <TouchableOpacity 
                style={[styles.saveButton, isSaving && styles.disabledButton]} 
                onPress={handleSaveRecipe}
                disabled={isSaving}
              >
                <LinearGradient
                  colors={isSaving ? ['#ccc', '#aaa'] : ['#d4af37', '#b8941f']}
                  style={styles.buttonGradient}
                >
                  <Save size={20} color="white" />
                  <Text style={styles.buttonText}>
                    {isSaving ? 'Сохраняю...' : 'Сохранить рецепт'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : null}
            
            <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
              <LinearGradient
                colors={['#8b7355', '#6d5a42']}
                style={styles.buttonGradient}
              >
                {isFromQuestionnaire ? (
                  <>
                    <LogOut size={20} color="white" />
                    <Text style={styles.buttonText}>Завершить</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.buttonText}>Завершить</Text>
                    <ArrowRight size={20} color="white" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Save Options Modal */}
        <Modal
          visible={showSaveOptions}
          transparent
          animationType="fade"
          onRequestClose={() => setShowSaveOptions(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Создать новый профиль</Text>
                <TouchableOpacity onPress={() => setShowSaveOptions(false)}>
                  <X size={24} color="#8b7355" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalDescription}>
                Для сохранения рецепта создайте профиль с вашими данными:
              </Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Имя профиля</Text>
                <TextInput
                  style={styles.textInput}
                  value={newProfileName}
                  onChangeText={setNewProfileName}
                  placeholder="Например: Виктор, Мама, Сын"
                  placeholderTextColor="#999"
                />
              </View>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]} 
                  onPress={() => {
                    setShowSaveOptions(false);
                    console.log('Navigating to home from modal');
                    router.replace('/');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Не сохранять</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.confirmButton, isSaving && styles.disabledButton]} 
                  onPress={handleCreateNewProfile}
                  disabled={isSaving}
                >
                  <Text style={styles.confirmButtonText}>
                    {isSaving ? 'Создаю...' : 'Создать и сохранить'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#8b7355',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  recipeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#d4af37',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#5a4a3a',
    lineHeight: 22,
    textAlign: 'center',
  },
  recipeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 16,
    textAlign: 'center',
  },
  recipeDescription: {
    fontSize: 15,
    color: '#5a4a3a',
    lineHeight: 22,
    marginBottom: 16,
  },
  ingredientCard: {
    backgroundColor: 'rgba(139, 115, 85, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.1)',
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientParameter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b7355',
    flex: 1,
  },
  energyBadge: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  energyText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  oilInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  oilName: {
    fontSize: 16,
    color: '#8b7355',
    fontWeight: '600',
    flex: 1,
  },
  dropsText: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: '500',
  },
  additionalOils: {
    fontSize: 12,
    color: '#5a4a3a',
    fontStyle: 'italic',
  },
  instructionsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  baseOilSection: {
    marginBottom: 16,
  },
  baseOilTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 4,
  },
  baseOilText: {
    fontSize: 14,
    color: '#5a4a3a',
  },
  essentialOilsSection: {
    marginBottom: 16,
  },
  essentialOilsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 8,
  },
  oilInstruction: {
    fontSize: 14,
    color: '#5a4a3a',
    marginBottom: 4,
  },
  usageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  usageMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b7355',
  },
  usageText: {
    fontSize: 14,
    color: '#5a4a3a',
    lineHeight: 20,
    marginBottom: 16,
  },
  ritualSection: {
    marginTop: 8,
  },
  ritualTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 8,
  },
  ritualText: {
    fontSize: 14,
    color: '#5a4a3a',
    lineHeight: 20,
  },
  safetyCard: {
    backgroundColor: 'rgba(255, 248, 220, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 12,
  },
  safetyText: {
    fontSize: 14,
    color: '#5a4a3a',
    lineHeight: 20,
  },
  alternativesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  alternativesText: {
    fontSize: 14,
    color: '#5a4a3a',
    lineHeight: 20,
  },
  buttonsContainer: {
    gap: 16,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  finishButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  disabledButton: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8b7355',
  },
  modalDescription: {
    fontSize: 16,
    color: '#5a4a3a',
    lineHeight: 22,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8b7355',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#8b7355',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});