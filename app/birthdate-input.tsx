import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, ArrowRight } from 'lucide-react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useSofiaContext } from '@/hooks/sofia-context';
import { calculateWisdomFlower } from '@/utils/wisdom-flower';

export default function BirthdateInputScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setBirthdate, setWisdomFlowerParams, saveProfile } = useSofiaContext();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  
  const profileName = params.profileName as string;
  const fromMyRecipes = params.fromMyRecipes === 'true';

  const validateAndContinue = async () => {
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    // Validation
    if (!day || !month || !year) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

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

    // Additional validation for days in month
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum > daysInMonth) {
      Alert.alert('Ошибка', `В ${monthNum} месяце только ${daysInMonth} дней`);
      return;
    }

    const birthdate = new Date(yearNum, monthNum - 1, dayNum);
    setBirthdate(birthdate);
    
    // Calculate wisdom flower params
    const wisdomFlowerParams = calculateWisdomFlower(birthdate);
    setWisdomFlowerParams(wisdomFlowerParams);
    
    // If creating profile from my-recipes, save it and go back
    if (fromMyRecipes && profileName) {
      try {
        const today = new Date();
        const age = today.getFullYear() - birthdate.getFullYear();
        
        await saveProfile(profileName, birthdate, wisdomFlowerParams, age);
        
        Alert.alert(
          'Профиль создан',
          `Профиль "${profileName}" успешно создан и сохранён!`,
          [{ text: 'OK', onPress: () => router.push('/my-recipes') }]
        );
      } catch {
        Alert.alert('Ошибка', 'Не удалось сохранить профиль');
      }
    } else {
      router.push('/wisdom-flower-results');
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Дата рождения',
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
            <Calendar size={48} color="#d4af37" />
            <Text style={styles.title}>Расчёт индивидуальной смеси</Text>
            <Text style={styles.subtitle}>
              Хотите, я рассчитаю для Вас индивидуальный рецепт аромасмеси, учитывая Вашу дату рождения и персональные особенности?
            </Text>
          </View>

          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>Введите дату рождения</Text>
            <Text style={styles.inputHint}>Формат: ДД.ММ.ГГГГ</Text>
            
            <View style={styles.dateInputContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputGroupLabel}>День</Text>
                <TextInput
                  style={styles.dateInput}
                  value={day}
                  onChangeText={setDay}
                  placeholder="01"
                  keyboardType="numeric"
                  maxLength={2}
                  textAlign="center"
                />
              </View>

              <Text style={styles.dateSeparator}>.</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputGroupLabel}>Месяц</Text>
                <TextInput
                  style={styles.dateInput}
                  value={month}
                  onChangeText={setMonth}
                  placeholder="01"
                  keyboardType="numeric"
                  maxLength={2}
                  textAlign="center"
                />
              </View>

              <Text style={styles.dateSeparator}>.</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputGroupLabel}>Год</Text>
                <TextInput
                  style={[styles.dateInput, styles.yearInput]}
                  value={year}
                  onChangeText={setYear}
                  placeholder="1990"
                  keyboardType="numeric"
                  maxLength={4}
                  textAlign="center"
                />
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              На основе вашей даты рождения я рассчитаю параметры Цветка Мудрости и подберу персональные эфирные масла, которые будут поддерживать ваши энергии.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.continueButton, (!day || !month || !year) && styles.disabledButton]} 
            onPress={validateAndContinue}
            disabled={!day || !month || !year}
          >
            <LinearGradient
              colors={(!day || !month || !year) ? ['#ccc', '#aaa'] : ['#8b7355', '#6d5a42']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Рассчитать Цветок Мудрости</Text>
              <ArrowRight size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#5a4a3a',
    lineHeight: 24,
    textAlign: 'center',
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 8,
    textAlign: 'center',
  },
  inputHint: {
    fontSize: 14,
    color: '#8b7355',
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  inputGroup: {
    alignItems: 'center',
  },
  inputGroupLabel: {
    fontSize: 12,
    color: '#8b7355',
    marginBottom: 8,
    fontWeight: '500',
  },
  dateInput: {
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#8b7355',
    width: 60,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  yearInput: {
    width: 80,
  },
  dateSeparator: {
    fontSize: 24,
    color: '#8b7355',
    fontWeight: '300',
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  infoText: {
    fontSize: 15,
    color: '#5a4a3a',
    lineHeight: 22,
    textAlign: 'center',
  },
  continueButton: {
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
});