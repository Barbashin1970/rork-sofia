import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flower2, Sparkles, BookOpen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSofiaContext } from '@/hooks/sofia-context';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { savedProfiles, isLoading } = useSofiaContext();

  const handleStart = () => {
    router.push('/questionnaire');
  };

  const handleMyRecipes = () => {
    router.push('/my-recipes' as any);
  };

  return (
    <LinearGradient
      colors={['#f8f4f0', '#e8ddd4', '#d4c4b0']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Flower2 size={48} color="#8b7355" />
            <Sparkles size={24} color="#d4af37" style={styles.sparkle} />
          </View>
          <Text style={styles.title}>София</Text>
          <Text style={styles.subtitle}>Персональный помощник по ароматерапии</Text>
        </View>

        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <Text style={styles.disclaimerIcon}>🛈</Text>
            <Text style={styles.disclaimerTitle}>Важная информация</Text>
          </View>
          <Text style={styles.disclaimerText}>
            <Text style={styles.bold}>Дисклеймер:</Text> Рекомендации Софии не являются медицинским или психотерапевтическим советом. Использование масел — это способ самопомощи и эмоциональной поддержки. Перед применением при беременности или наличии хронических заболеваний рекомендуется консультация со специалистом.
          </Text>
          <Text style={styles.readyText}>Готовы продолжить?</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable 
            style={({ pressed }) => [
              styles.acceptButton,
              pressed && Platform.OS === 'ios' && { opacity: 0.8 }
            ]} 
            onPress={handleStart}
          >
            <LinearGradient
              colors={['#8b7355', '#6d5a42']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Да, продолжить</Text>
            </LinearGradient>
          </Pressable>
          
          {!isLoading && savedProfiles.length > 0 && (
            <Pressable 
              style={({ pressed }) => [
                styles.myRecipesButton,
                pressed && Platform.OS === 'ios' && { opacity: 0.8 }
              ]} 
              onPress={handleMyRecipes}
            >
              <View style={styles.myRecipesContent}>
                <BookOpen size={20} color="#8b7355" />
                <Text style={styles.myRecipesText}>Мои рецепты ({savedProfiles.length})</Text>
              </View>
            </Pressable>
          )}
          
          <Pressable 
            style={({ pressed }) => [
              styles.declineButton,
              pressed && Platform.OS === 'ios' && { opacity: 0.6 }
            ]}
          >
            <Text style={styles.declineText}>Возможно, позже</Text>
          </Pressable>
          

        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            София поможет вам создать персональную аромасмесь на основе вашей даты рождения и текущих потребностей
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  sparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    color: '#8b7355',
    marginBottom: 8,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: '#6d5a42',
    textAlign: 'center',
    fontWeight: '400',
  },
  disclaimerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  disclaimerIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b7355',
  },
  disclaimerText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5a4a3a',
    marginBottom: 16,
  },
  bold: {
    fontWeight: '600',
  },
  readyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8b7355',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 32,
  },
  acceptButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  declineButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  declineText: {
    color: '#8b7355',
    fontSize: 16,
    fontWeight: '500',
  },
  myRecipesButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#8b7355',
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  myRecipesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  myRecipesText: {
    color: '#8b7355',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6d5a42',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },

});