import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { useSofiaContext } from '@/hooks/sofia-context';

const recipeDescriptions = {
  'Целостный образ': {
    description: 'Создание устойчивого, гармоничного образа себя, интеграция личностных аспектов',
    when: 'При важном выступлении, общении, прояснении своей позиции',
    helps: 'Создать гармоничный образ, в котором ваше внешнее проявление будет соответствовать внутреннему состоянию, а самовыражение станет полным и ярким.',
  },
  'Путь к душе': {
    description: 'Энергетическая подпитка в моменты упадка сил, возвращение к себе, укрепление стержня и центра',
    when: 'При усталости, потере опоры, разочаровании, депрессии',
    helps: 'Собраться в трудную минуту, когда мы чувствуем, что потеряли вдохновение и ресурс',
  },
  'Работа с сопротивлением': {
    description: 'Осознание внутренних блоков, которые мешают действовать, преодоление внутреннего сопротивления и неуверенности',
    when: 'В терапевтическом процессе, в период прокрастинации',
    helps: 'Осознать, какие убеждения мешают реализации планов',
  },
  'Диалог с Тенью': {
    description: 'Принятие непризнанных сторон личности, работа с теневыми аспектами, внутренняя честность',
    when: 'При внутреннем конфликте, эмоциональных вспышках, снах с тревогой',
    helps: 'Можно использовать при работе с психологом или при выполнении практик на разбор раздражающих или восхищающих ситуаций',
  },
  'Танец Бессознательного': {
    description: 'Раскрытие интуитивных озарений, интеграция образов из снов, искусства, работы с символами',
    when: 'Вечером, перед сном, после снов, при ощущении вдохновения',
    helps: 'Найти ответы в глубинах психики и понять информацию, полученную в сновидении или озарении',
  },
  'Аромат предназначения': {
    description: 'Поиск смысла, определение направления, поддержка в осознании призвания и предназначения',
    when: 'В период смены работы, жизненных целей, выбора пути',
    helps: 'найти сферу, где духовный рост и материальное благосостояние будут гармонично реализованы.',
  },
  'Дыхание жизни': {
    description: 'Наполнение энергией и поддержкой изнутри, работа с привычными реакциями, жизненная сила',
    when: 'При старте новых дел, реализации творческих проектов',
    helps: 'когда нужно быстро восстановиться, обрести внутреннюю силу',
  },
};

export default function RecipeSummaryScreen() {
  const router = useRouter();
  const { recommendedRecipe } = useSofiaContext();

  const recipe = recipeDescriptions[recommendedRecipe as keyof typeof recipeDescriptions];

  const handleContinue = () => {
    router.push('/birthdate-input');
  };

  const handleChooseOther = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Ваш результат',
          headerStyle: { backgroundColor: '#f8f4f0' },
          headerTintColor: '#8b7355',
        }} 
      />
      <LinearGradient
        colors={['#f8f4f0', '#e8ddd4']}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Sparkles size={32} color="#d4af37" />
              <Text style={styles.resultTitle}>Ваша рекомендация</Text>
            </View>
            
            <Text style={styles.summaryText}>
              Исходя из Ваших ответов, Ваша основная потребность сейчас соответствует смеси:
            </Text>
            
            <Text style={styles.recipeName}>{recommendedRecipe}</Text>
          </View>

          {recipe && (
            <View style={styles.recipeCard}>
              <View style={styles.recipeSection}>
                <Text style={styles.sectionTitle}>Описание</Text>
                <Text style={styles.sectionText}>{recipe.description}</Text>
              </View>

              <View style={styles.recipeSection}>
                <Text style={styles.sectionTitle}>Когда использовать</Text>
                <Text style={styles.sectionText}>{recipe.when}</Text>
              </View>

              <View style={styles.recipeSection}>
                <Text style={styles.sectionTitle}>Данная смесь помогает</Text>
                <Text style={styles.sectionText}>{recipe.helps}</Text>
              </View>
            </View>
          )}

          <View style={styles.questionCard}>
            <Text style={styles.questionText}>
              Верно ли я определила ваши задачи или хотите выбрать другой рецепт с другими эффектами?
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
              <LinearGradient
                colors={['#8b7355', '#6d5a42']}
                style={styles.buttonGradient}
              >
                <Text style={styles.primaryButtonText}>Продолжить с этим рецептом</Text>
                <ArrowRight size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleChooseOther}>
              <Text style={styles.secondaryButtonText}>Выбрать другой рецепт</Text>
            </TouchableOpacity>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#8b7355',
    marginLeft: 12,
  },
  summaryText: {
    fontSize: 16,
    color: '#5a4a3a',
    lineHeight: 24,
    marginBottom: 16,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#d4af37',
    textAlign: 'center',
    letterSpacing: 0.5,
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
  recipeSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8b7355',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#5a4a3a',
    lineHeight: 22,
  },
  questionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#8b7355',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionText: {
    fontSize: 16,
    color: '#5a4a3a',
    lineHeight: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
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
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#8b7355',
    fontSize: 16,
    fontWeight: '500',
  },
});