import { Link, Stack } from "expo-router";
import { StyleSheet, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Страница не найдена" }} />
      <LinearGradient
        colors={['#f8f4f0', '#e8ddd4']}
        style={styles.container}
      >
        <Text style={styles.title}>Эта страница не существует</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Вернуться на главную</Text>
        </Link>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: '#8b7355',
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    color: "#8b7355",
    fontWeight: '500',
  },
});
