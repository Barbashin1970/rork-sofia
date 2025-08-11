import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, ArrowLeft } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { useSofiaContext } from '@/hooks/sofia-context';

const questions = [
  {
    id: 1,
    question: 'Какой сейчас у Вас жизненный контекст?',
    options: [
      { text: 'Подготовка к важному событию', recipe: 'Целостный образ' },
      { text: 'Усталость, потеря вдохновения, сил', recipe: 'Путь к душе' },
      { text: 'Поиск смысла, смена работы, важные решения', recipe: 'Аромат предназначения' },
      { text: 'Внутренний конфликт, раздражение', recipe: 'Диалог с Тенью' },
      { text: 'Поиск озарений, работа с символами, вдохновение', recipe: 'Танец Бессознательного' },
      { text: 'Новое дело, проект, заряд энергии', recipe: 'Дыхание жизни' },
    ],
  },
  {
    id: 2,
    question: 'Какие ощущения хотите усилить?',
    options: [
      { text: 'Гармония и уверенность', recipe: 'Целостный образ' },
      { text: 'Энергия и мотивация', recipe: 'Путь к душе' },
      { text: 'Творческое вдохновение', recipe: 'Танец Бессознательного' },
      { text: 'Внутренняя честность и принятие', recipe: 'Диалог с Тенью' },
      { text: 'Наполнение жизненной силы', recipe: 'Дыхание жизни' },
    ],
  },
  {
    id: 3,
    question: 'Что важно в результате?',
    options: [
      { text: 'Создать уверенный и гармоничный образ', recipe: 'Целостный образ' },
      { text: 'Вернуть вдохновение и ресурс', recipe: 'Путь к душе' },
      { text: 'Осознать и преодолеть барьеры', recipe: 'Работа с сопротивлением' },
      { text: 'Получить озарения и символические ответы', recipe: 'Танец Бессознательного' },
      { text: 'Найти предназначение и направление', recipe: 'Аромат предназначения' },
      { text: 'Быстро восстановиться и зарядиться энергией', recipe: 'Дыхание жизни' },
    ],
  },
];

export default function QuestionnaireScreen() {
  const router = useRouter();
  const { setAnswers } = useSofiaContext();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleAnswer = (recipe: string) => {
    const newAnswers = [...selectedAnswers, recipe];
    setSelectedAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Analyze answers and determine recommended recipe
      const recipeCounts: { [key: string]: number } = {};
      newAnswers.forEach(recipe => {
        recipeCounts[recipe] = (recipeCounts[recipe] || 0) + 1;
      });
      
      const recommendedRecipe = Object.keys(recipeCounts).reduce((a, b) => 
        recipeCounts[a] > recipeCounts[b] ? a : b
      );

      setAnswers(newAnswers, recommendedRecipe);
      router.push('/recipe-summary');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswers(selectedAnswers.slice(0, -1));
    } else {
      router.back();
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Анкета',
          headerStyle: { backgroundColor: '#f8f4f0' },
          headerTintColor: '#8b7355',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color="#8b7355" />
            </TouchableOpacity>
          ),
        }} 
      />
      <LinearGradient
        colors={['#f8f4f0', '#e8ddd4']}
        style={styles.container}
      >
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestion + 1} из {questions.length}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.questionCard}>
            <Text style={styles.questionNumber}>Вопрос {currentQuestion + 1}</Text>
            <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionButton}
                onPress={() => handleAnswer(option.recipe)}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>{option.text}</Text>
                  <ChevronRight size={20} color="#8b7355" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(139, 115, 85, 0.2)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b7355',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#8b7355',
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  questionNumber: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  questionText: {
    fontSize: 20,
    color: '#8b7355',
    fontWeight: '500',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#5a4a3a',
    lineHeight: 22,
    marginRight: 12,
  },
});