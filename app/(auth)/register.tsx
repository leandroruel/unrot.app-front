import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/stores/auth-store';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
      });
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.content, { paddingTop: insets.top + 60 }]}>
        <ThemedText style={[styles.brand, { color: colors.text }]}>zeha</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
          Crie sua conta
        </ThemedText>

        <View style={styles.form}>
          <TextInput
            testID="input-name"
            placeholder="Nome"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
            value={displayName}
            onChangeText={setDisplayName}
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
            ]}
          />

          <TextInput
            testID="input-email"
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
            ]}
          />

          <TextInput
            testID="input-password"
            placeholder="Senha"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={[
              styles.input,
              { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
            ]}
          />

          {error ? (
            <ThemedText style={styles.error}>{error}</ThemedText>
          ) : null}

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={[styles.button, { backgroundColor: colors.accent, opacity: loading ? 0.7 : 1 }]}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Criar Conta</ThemedText>
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ThemedText style={[styles.link, { color: colors.accent }]}>
            Já tenho conta
          </ThemedText>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  brand: {
    fontSize: 42,
    fontWeight: '700',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  form: {
    width: '100%',
    gap: Spacing.sm + 4,
  },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  error: {
    color: '#E74C3C',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 24,
  },
});
