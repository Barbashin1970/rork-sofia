import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Modal, TextInput, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Plus, User, Calendar, Eye, X, BookOpen, Droplets } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSofiaContext, SavedProfile } from '@/hooks/sofia-context';
import { recipesData } from '@/constants/oils-data';

export default function MyRecipesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { savedProfiles, savedRecipes, deleteProfile, deleteRecipe, loadProfile, lastUsedBirthdate, saveProfile } = useSofiaContext();
  const [showAddProfile, setShowAddProfile] = useState<boolean>(false);
  const [newProfileName, setNewProfileName] = useState<string>('');
  const [newProfileDate, setNewProfileDate] = useState<string>('');
  const [selectedProfile, setSelectedProfile] = useState<SavedProfile | null>(null);
  const [showRecipeSelector, setShowRecipeSelector] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'profiles' | 'recipes'>('profiles');

  const handleBack = () => {
    router.back();
  };

  const handleAddProfile = () => {
    // Pre-fill with last used birthdate if available
    if (lastUsedBirthdate) {
      const day = lastUsedBirthdate.getDate().toString().padStart(2, '0');
      const month = (lastUsedBirthdate.getMonth() + 1).toString().padStart(2, '0');
      const year = lastUsedBirthdate.getFullYear().toString();
      setNewProfileDate(`${day}.${month}.${year}`);
    }
    setShowAddProfile(true);
  };

  const handleSaveNewProfile = async () => {
    if (!newProfileName.trim()) {
      Alert.alert('Ошибка', 'Введите имя профиля');
      return;
    }

    const dateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
    const match = newProfileDate.match(dateRegex);
    
    if (!match) {
      Alert.alert('Ошибка', 'Введите дату в формате ДД.ММ.ГГГГ');
      return;
    }

    const [, day, month, year] = match;
    const birthdate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    if (isNaN(birthdate.getTime())) {
      Alert.alert('Ошибка', 'Введите корректную дату');
      return;
    }

    // Additional validation for days in month
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    
    if (dayNum < 1 || dayNum > 31) {
      Alert.alert('Ошибка', 'День должен быть от 1 до 31');
      return;
    }

    if (monthNum < 1 || monthNum > 12) {
      Alert.alert('Ошибка', 'Месяц должен быть от 1 до 12');
      return;
    }

    if (yearNum < 1900 || yearNum > 2025) {
      Alert.alert('Ошибка', 'Год должен быть от 1900 до 2025');
      return;
    }

    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum > daysInMonth) {
      Alert.alert('Ошибка', `В ${monthNum} месяце только ${daysInMonth} дней`);
      return;
    }

    try {
      // Calculate wisdom flower params
      const { calculateWisdomFlower } = await import('@/utils/wisdom-flower');
      const wisdomFlowerParams = calculateWisdomFlower(birthdate);
      
      // Calculate age
      const today = new Date();
      const age = today.getFullYear() - birthdate.getFullYear();
      
      // Save the profile
      await saveProfile(newProfileName.trim(), birthdate, wisdomFlowerParams, age);
      
      setNewProfileName('');
      setNewProfileDate('');
      setShowAddProfile(false);
      
      Alert.alert(
        'Профиль создан',
        `Профиль "${newProfileName.trim()}" успешно создан и сохранён!`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Ошибка', 'Не удалось создать профиль');
    }
  };

  const handleDeleteProfile = (profileId: string, profileName: string) => {
    console.log('Delete profile button pressed for:', profileName, profileId);
    Alert.alert(
      'Удалить профиль?',
      `Профиль "${profileName}" и все связанные рецепты будут удалены безвозвратно.`,
      [
        { text: 'Нет, оставить', style: 'cancel' },
        {
          text: 'Да, удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProfile(profileId);
              console.log('Profile deletion completed');
            } catch (error) {
              console.error('Failed to delete profile:', error);
              Alert.alert('Ошибка', 'Не удалось удалить профиль');
            }
          }
        }
      ]
    );
  };

  const handleSelectProfile = (profile: SavedProfile) => {
    setSelectedProfile(profile);
    setShowRecipeSelector(true);
  };

  const handleSelectRecipe = (recipeName: string) => {
    if (selectedProfile) {
      loadProfile(selectedProfile);
      setShowRecipeSelector(false);
      setSelectedProfile(null);
      
      router.push({
        pathname: '/recipe-generation' as any,
        params: { 
          selectedRecipe: recipeName,
          profileName: selectedProfile.name
        }
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU');
  };

  const getProfileRecipesCount = (profileId: string) => {
    return savedRecipes.filter(recipe => recipe.profileId === profileId).length;
  };



  return (
    <LinearGradient
      colors={['#f8f4f0', '#e8ddd4', '#d4c4b0']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#8b7355" />
        </TouchableOpacity>
        <Text style={styles.title}>Мои рецепты</Text>
        <TouchableOpacity onPress={handleAddProfile} style={styles.addButton}>
          <Plus size={24} color="#8b7355" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'profiles' && styles.activeTab]} 
          onPress={() => setActiveTab('profiles')}
        >
          <User size={20} color={activeTab === 'profiles' ? 'white' : '#8b7355'} />
          <Text style={[styles.tabText, activeTab === 'profiles' && styles.activeTabText]}>Профили</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'recipes' && styles.activeTab]} 
          onPress={() => setActiveTab('recipes')}
        >
          <BookOpen size={20} color={activeTab === 'recipes' ? 'white' : '#8b7355'} />
          <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>Рецепты</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'profiles' ? (
          savedProfiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Нет сохранённых профилей</Text>
              <Text style={styles.emptyText}>
                Создайте первый профиль, чтобы сохранять и использовать ваши персональные рецепты
              </Text>
            </View>
          ) : (
            <View style={styles.profilesList}>
              {savedProfiles.map((profile) => (
                <View key={profile.id} style={styles.profileCard}>
                  <View style={styles.profileHeader}>
                    <View style={styles.profileIcon}>
                      <User size={20} color="#8b7355" />
                    </View>
                    <View style={styles.profileInfo}>
                      <Text style={styles.profileName}>{profile.name}</Text>
                      <View style={styles.profileDetails}>
                        <Calendar size={14} color="#6d5a42" />
                        <Text style={styles.profileDate}>{formatDate(profile.birthdate)}</Text>
                        <Text style={styles.profileAge}>• {profile.age} лет</Text>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => {
                        console.log('Profile delete button touched for:', profile.name, profile.id);
                        handleDeleteProfile(profile.id, profile.name);
                      }}
                      style={({ pressed }) => [
                        styles.deleteButton,
                        pressed && { backgroundColor: 'rgba(220, 53, 69, 0.2)' }
                      ]}
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    >
                      <X size={18} color="#dc3545" />
                    </Pressable>
                  </View>
                  
                  <View style={styles.profileStats}>
                    <Text style={styles.recipesCount}>
                      Рецептов: {getProfileRecipesCount(profile.id)}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleSelectProfile(profile)}
                  >
                    <Eye size={16} color="white" />
                    <Text style={styles.selectButtonText}>Создать рецепт</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )
        ) : (
          savedRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Нет сохранённых рецептов</Text>
              <Text style={styles.emptyText}>
                Создайте профиль и сгенерируйте рецепт, чтобы увидеть его здесь
              </Text>
            </View>
          ) : (
            <View style={styles.savedRecipesList}>
              {savedRecipes.map((recipe) => (
                <TouchableOpacity 
                  key={recipe.id} 
                  style={styles.savedRecipeCard}
                  onPress={() => {
                    // Find the profile for this recipe
                    const profile = savedProfiles.find(p => p.id === recipe.profileId);
                    if (profile) {
                      loadProfile(profile);
                      router.push({
                        pathname: '/recipe-generation' as any,
                        params: { 
                          selectedRecipe: recipe.recipeName,
                          profileName: recipe.profileName,
                          viewExisting: 'true'
                        }
                      });
                    } else {
                      Alert.alert('Ошибка', 'Профиль для этого рецепта не найден');
                    }
                  }}
                >
                  <View style={styles.recipeHeader}>
                    <View style={styles.recipeIcon}>
                      <Droplets size={20} color="#8b7355" />
                    </View>
                    <View style={styles.recipeInfo}>
                      <Text style={styles.recipeTitle}>{recipe.recipeName}</Text>
                      <Text style={styles.recipeProfile}>Профиль: {recipe.profileName}</Text>
                      <Text style={styles.recipeDate}>
                        Создан: {recipe.createdAt.toLocaleDateString('ru-RU')}
                      </Text>
                    </View>
                    <Pressable
                      onPress={(e) => {
                        if (Platform.OS === 'web') {
                          e.stopPropagation();
                        }
                        console.log('Recipe delete button touched for:', recipe.recipeName, recipe.id);
                        Alert.alert(
                          'Удалить рецепт?',
                          `Рецепт "${recipe.recipeName}" будет удалён безвозвратно.`,
                          [
                            { text: 'Нет, оставить', style: 'cancel' },
                            {
                              text: 'Да, удалить',
                              style: 'destructive',
                              onPress: async () => {
                                try {
                                  await deleteRecipe(recipe.id);
                                  console.log('Recipe deletion completed');
                                } catch (error) {
                                  console.error('Failed to delete recipe:', error);
                                  Alert.alert('Ошибка', 'Не удалось удалить рецепт');
                                }
                              }
                            }
                          ]
                        );
                      }}
                      style={({ pressed }) => [
                        styles.deleteButton,
                        pressed && { backgroundColor: 'rgba(220, 53, 69, 0.2)' }
                      ]}
                      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                    >
                      <X size={18} color="#dc3545" />
                    </Pressable>
                  </View>
                  
                  <View style={styles.ingredientsList}>
                    <Text style={styles.ingredientsTitle}>Состав:</Text>
                    {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                      <Text key={index} style={styles.ingredientText}>
                        • {ingredient.mainOil} ({ingredient.energy}) - {ingredient.drops} капли
                      </Text>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <Text style={styles.moreIngredients}>
                        ... и ещё {recipe.ingredients.length - 3} масел
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.tapHint}>
                    <Eye size={14} color="#8b7355" />
                    <Text style={styles.tapHintText}>Нажмите, чтобы посмотреть полный рецепт</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )
        )}
      </ScrollView>
      
      {/* Finish Button */}
      <View style={styles.finishButtonContainer}>
        <TouchableOpacity 
          style={styles.finishButton} 
          onPress={() => {
            console.log('Navigating to home from my-recipes');
            router.replace('/');
          }}
        >
          <LinearGradient
            colors={['#8b7355', '#6d5a42']}
            style={styles.finishButtonGradient}
          >
            <Text style={styles.finishButtonText}>Завершить</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Add Profile Modal */}
      <Modal
        visible={showAddProfile}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddProfile(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Новый профиль</Text>
              <TouchableOpacity onPress={() => setShowAddProfile(false)}>
                <X size={24} color="#8b7355" />
              </TouchableOpacity>
            </View>
            
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
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Дата рождения</Text>
              <TextInput
                style={styles.textInput}
                value={newProfileDate}
                onChangeText={setNewProfileDate}
                placeholder="ДД.ММ.ГГГГ"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveNewProfile}>
              <Text style={styles.saveButtonText}>Создать профиль</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Recipe Selector Modal */}
      <Modal
        visible={showRecipeSelector}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRecipeSelector(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выберите тип смеси</Text>
              <TouchableOpacity onPress={() => setShowRecipeSelector(false)}>
                <X size={24} color="#8b7355" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.recipeSelectorList}>
              {Object.entries(recipesData).map(([recipeName, recipe]) => (
                <TouchableOpacity
                  key={recipeName}
                  style={styles.recipeItem}
                  onPress={() => handleSelectRecipe(recipeName)}
                >
                  <Text style={styles.recipeItemName}>{recipe.name}</Text>
                  <Text style={styles.recipeItemDescription}>{recipe.purpose}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 115, 85, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8b7355',
  },
  addButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#8b7355',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b7355',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6d5a42',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 32,
  },
  profilesList: {
    paddingVertical: 20,
    gap: 16,
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 4,
  },
  profileDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileDate: {
    fontSize: 14,
    color: '#6d5a42',
  },
  profileAge: {
    fontSize: 14,
    color: '#6d5a42',
  },
  deleteButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(220, 53, 69, 0.15)',
    minWidth: 40,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.3)',
  },
  profileStats: {
    marginBottom: 16,
  },
  recipesCount: {
    fontSize: 14,
    color: '#6d5a42',
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#8b7355',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  selectButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  savedRecipesList: {
    paddingVertical: 20,
    gap: 16,
  },
  savedRecipeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recipeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 4,
  },
  recipeProfile: {
    fontSize: 14,
    color: '#6d5a42',
    marginBottom: 2,
  },
  recipeDate: {
    fontSize: 12,
    color: '#999',
  },
  ingredientsList: {
    marginTop: 8,
  },
  ingredientsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 8,
  },
  ingredientText: {
    fontSize: 13,
    color: '#5a4a3a',
    marginBottom: 4,
  },
  moreIngredients: {
    fontSize: 13,
    color: '#999',
    fontStyle: 'italic',
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8b7355',
  },
  inputContainer: {
    marginBottom: 20,
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
  saveButton: {
    backgroundColor: '#8b7355',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  recipeSelectorList: {
    maxHeight: 400,
  },
  recipeItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recipeItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 4,
  },
  recipeItemDescription: {
    fontSize: 14,
    color: '#6d5a42',
    lineHeight: 20,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 115, 85, 0.1)',
    gap: 6,
  },
  tapHintText: {
    fontSize: 12,
    color: '#8b7355',
    opacity: 0.7,
  },
  finishButtonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
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
  finishButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});