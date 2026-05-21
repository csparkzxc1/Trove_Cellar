import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/stores/auth';
import { colors } from '@/constants/tokens';

// Auth gate — routes to tabs or login.
export default function Index() {
  const router = useRouter();
  const session = useAuth((s) => s.session);

  useEffect(() => {
    if (session) router.replace('/(tabs)');
    else router.replace('/(auth)/login');
  }, [session, router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.espresso, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={colors.brass} />
    </View>
  );
}
