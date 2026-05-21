import { View, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Crest } from '@/components/Crest';
import { BrandWordmark } from '@/components/BrandWordmark';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/tokens';
import { useAuth } from '@/stores/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const session = useAuth((s) => s.session);
  const signOut = useAuth((s) => s.signOut);

  const handleSignOut = () => {
    signOut();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.espresso }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 80 }}>
        <View
          style={{
            paddingVertical: 22,
            borderBottomWidth: 1,
            borderBottomColor: colors.line,
            alignItems: 'center',
          }}
        >
          <BrandWordmark />
          <View style={{ marginTop: 8 }}>
            <MonoLabel size={9} tracking={2.2}>{`private member · ${session?.caskNumber ?? '—'}`}</MonoLabel>
          </View>
        </View>

        <View style={{ alignItems: 'center', paddingTop: 36, paddingBottom: 28 }}>
          <Crest size={42} color={colors.brass} />
          <View style={{ marginTop: 18 }}>
            <Text variant="serifKr" tone="parchment" style={{ fontSize: 18 }}>
              {session?.email ?? 'cellar.member@trove.kr'}
            </Text>
          </View>
        </View>

        <Card variant="flat" style={{ paddingVertical: 22, paddingHorizontal: 22, marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <MonoLabel tracking={2.4}>Member since</MonoLabel>
            <Text variant="displayEn" tone="parchment" style={{ fontSize: 14 }}>2026</Text>
          </View>
          <View style={{ height: 14 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <MonoLabel tracking={2.4}>Cask no.</MonoLabel>
            <Text variant="displayEn" tone="parchment" style={{ fontSize: 14 }}>{session?.caskNumber}</Text>
          </View>
        </Card>

        <Pressable
          onPress={handleSignOut}
          style={({ pressed }) => ({
            paddingVertical: 16,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: pressed ? colors.amberDeep : colors.line,
            borderRadius: 2,
          })}
        >
          <Text
            variant="mono"
            tone="inkMuted"
            upper
            tracking={2.5}
            style={{ fontSize: 11 }}
          >
            Leave the cellar
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
