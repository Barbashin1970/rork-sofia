import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flower2, ArrowRight } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { useSofiaContext } from '@/hooks/sofia-context';
import { calculateWisdomFlower } from '@/utils/wisdom-flower';
import { oilsData, parameterDescriptions } from '@/constants/oils-data';

export default function WisdomFlowerResultsScreen() {
  const router = useRouter();
  const { birthdate, setWisdomFlowerParams, wisdomFlowerParams, age } = useSofiaContext();

  useEffect(() => {
    if (birthdate && !wisdomFlowerParams) {
      const params = calculateWisdomFlower(birthdate);
      setWisdomFlowerParams(params);
    }
  }, [birthdate, wisdomFlowerParams, setWisdomFlowerParams]);

  const handleContinue = () => {
    router.push('/recipe-generation');
  };

  if (!wisdomFlowerParams) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Рассчитываю ваш Цветок Мудрости...</Text>
      </View>
    );
  }

  const renderParameter = (key: string, value: number, name: string, interpretation: string) => {
    const oilData = oilsData[value];
    
    return (
      <View key={key} style={styles.parameterCard}>
        <View style={styles.parameterHeader}>
          <Text style={styles.parameterName}>{name}</Text>
          <View style={styles.energyBadge}>
            <Text style={styles.energyText}>{value} ({oilData.energy})</Text>
          </View>
        </View>
        <Text style={styles.parameterInterpretation}>{interpretation}...</Text>
        <View style={styles.oilInfo}>
          <Text style={styles.oilLabel}>Основное масло:</Text>
          <Text style={styles.oilName}>{oilData.mainOil}</Text>
        </View>
        <Text style={styles.supportingActions}>{oilData.supportingActions}</Text>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Цветок Мудрости',
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
            <Text style={styles.title}>Ваш Цветок Мудрости</Text>
            <Text style={styles.subtitle}>
              Спасибо за доверие! Я рассчитала для Вас уникальную карту энергий Цветка Мудрости на основе Вашей даты рождения. 
              Не переживайте — это просто красивая таблица, которая покажет, какие энергии и масла лучше всего поддержат Вас в жизни.
            </Text>
          </View>

          <View style={styles.resultsCard}>
            <Text style={styles.sectionTitle}>Базовые параметры</Text>
            {renderParameter('I', wisdomFlowerParams.I, parameterDescriptions.I.name, parameterDescriptions.I.interpretation)}
            {renderParameter('II', wisdomFlowerParams.II, parameterDescriptions.II.name, parameterDescriptions.II.interpretation)}
            {renderParameter('III', wisdomFlowerParams.III, parameterDescriptions.III.name, parameterDescriptions.III.interpretation)}
            {renderParameter('IV', wisdomFlowerParams.IV, parameterDescriptions.IV.name, parameterDescriptions.IV.interpretation)}
            {renderParameter('V', wisdomFlowerParams.V, parameterDescriptions.V.name, parameterDescriptions.V.interpretation)}
          </View>

          <View style={styles.resultsCard}>
            <Text style={styles.sectionTitle}>Производные параметры</Text>
            {renderParameter('A', wisdomFlowerParams.A, parameterDescriptions.A.name, parameterDescriptions.A.interpretation)}
            {renderParameter('B', wisdomFlowerParams.B, parameterDescriptions.B.name, parameterDescriptions.B.interpretation)}
            {renderParameter('C', wisdomFlowerParams.C, parameterDescriptions.C.name, parameterDescriptions.C.interpretation)}
            {renderParameter('D', wisdomFlowerParams.D, parameterDescriptions.D.name, parameterDescriptions.D.interpretation)}
          </View>

          <View style={styles.resultsCard}>
            <Text style={styles.sectionTitle}>Возрастные аспекты (Ваш возраст: {age} лет)</Text>
            
            <Text style={styles.subsectionTitle}>Линии духа</Text>
            {renderParameter('spirit_20_40', wisdomFlowerParams.spirit_line["20_40"], 'Духовное развитие 20–40 лет', 'Этап духовного развития')}
            {renderParameter('spirit_40_60', wisdomFlowerParams.spirit_line["40_60"], 'Зрелость духа 40–60 лет', 'Этап зрелости духа')}
            {renderParameter('spirit_60_plus', wisdomFlowerParams.spirit_line["60_plus"], 'Мудрость 60+ лет', 'Мудрость и духовная зрелость')}
            
            <Text style={styles.subsectionTitle}>Линии материи</Text>
            {renderParameter('matter_20_40', wisdomFlowerParams.matter_line["20_40"], 'Реализация 20–40 лет', 'Реализация в материи')}
            {renderParameter('matter_40_60', wisdomFlowerParams.matter_line["40_60"], 'Материальные итоги 40–60 лет', 'Материальные итоги зрелости')}
            {renderParameter('matter_60_plus', wisdomFlowerParams.matter_line["60_plus"], 'Итоги материальной жизни', 'Итоги материальной жизни')}
            
            <Text style={styles.subsectionTitle}>Соединения</Text>
            {renderParameter('connection_20_40', wisdomFlowerParams.connection["20_40"], 'Синтез 20–40 лет', 'Синтез духа и материи')}
            {renderParameter('connection_40_60', wisdomFlowerParams.connection["40_60"], 'Синтез 40–60 лет', 'Синтез духа и материи в зрелости')}
            {renderParameter('connection_60_plus', wisdomFlowerParams.connection["60_plus"], 'Итог всей жизни', 'Итог всей жизни')}
          </View>

          <Text style={styles.continueText}>Продолжим?</Text>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <LinearGradient
              colors={['#8b7355', '#6d5a42']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Создать персональный рецепт</Text>
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
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#5a4a3a',
    lineHeight: 22,
    textAlign: 'center',
  },
  resultsCard: {
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d4af37',
    marginTop: 16,
    marginBottom: 12,
  },
  parameterCard: {
    backgroundColor: 'rgba(139, 115, 85, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.1)',
  },
  parameterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  parameterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b7355',
    flex: 1,
  },
  energyBadge: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  energyText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  parameterInterpretation: {
    fontSize: 14,
    color: '#5a4a3a',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  oilInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  oilLabel: {
    fontSize: 14,
    color: '#8b7355',
    fontWeight: '500',
    marginRight: 8,
  },
  oilName: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: '600',
  },
  supportingActions: {
    fontSize: 13,
    color: '#5a4a3a',
    lineHeight: 18,
  },
  continueText: {
    fontSize: 18,
    color: '#8b7355',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
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