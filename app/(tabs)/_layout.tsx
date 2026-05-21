import { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/stores/auth';
import { colors } from '@/constants/tokens';

const labels: Record<string, string> = {
  index: 'Cellar',
  add: 'Add',
  wishlist: 'Wishlist',
  profile: 'Profile',
};

export default function TabsLayout() {
  const router = useRouter();
  const session = useAuth((s) => s.session);

  useEffect(() => {
    if (!session) router.replace('/(auth)/login');
  }, [session, router]);

  if (!session) return null;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: { backgroundColor: colors.espresso },
        tabBarStyle: {
          backgroundColor: colors.espresso,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarShowLabel: true,
        tabBarLabel: ({ focused }) => (
          <View style={{ alignItems: 'center' }}>
            <Text
              variant="mono"
              tone={focused ? 'parchment' : 'inkDeep'}
              upper
              tracking={2}
              style={{ fontSize: 9 }}
            >
              {labels[route.name] ?? route.name}
            </Text>
            <View
              style={{
                width: 18,
                height: 1.5,
                marginTop: 4,
                backgroundColor: focused ? colors.brass : 'transparent',
              }}
            />
          </View>
        ),
        tabBarIcon: () => null,
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="add" />
      <Tabs.Screen name="wishlist" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
