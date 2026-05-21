import { useState } from 'react';
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Card } from '@/components/ui/Card';
import { BrandWordmark } from '@/components/BrandWordmark';
import { Crest } from '@/components/Crest';
import { useAuth } from '@/stores/auth';
import { colors } from '@/constants/tokens';

export default function LoginScreen() {
  const router = useRouter();
  const signIn = useAuth((s) => s.signIn);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handle = () => {
    if (!email.trim()) return;
    signIn(email.trim());
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.espresso }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ alignItems: 'center', marginBottom: 36 }}>
            <Crest size={42} />
            <View style={{ marginTop: 18 }}>
              <BrandWordmark size="lg" />
            </View>
            <View style={{ marginTop: 14 }}>
              <MonoLabel size={10} tracking={3.5} tone="brass">
                Private Whisky Library
              </MonoLabel>
            </View>
          </View>

          <Card variant="flat" style={{ padding: 24 }}>
            <FieldLabel>Email</FieldLabel>
            <Field
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <View style={{ height: 14 }} />
            <FieldLabel>Password</FieldLabel>
            <Field
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <View style={{ height: 22 }} />
            <Pressable
              onPress={handle}
              style={({ pressed }) => ({
                paddingVertical: 14,
                alignItems: 'center',
                backgroundColor: pressed ? colors.amberDeep : colors.brass,
                borderRadius: 2,
              })}
            >
              <Text
                variant="displayEn"
                tone="bourbon"
                style={{ fontSize: 14, letterSpacing: 3, textTransform: 'uppercase' }}
              >
                Enter the cellar
              </Text>
            </Pressable>
          </Card>

          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <Text variant="serifAged" tone="inkMuted" style={{ fontSize: 13 }}>
              아직 회원이 아니신가요?{' '}
              <Link href="/(auth)/signup" replace>
                <Text variant="displayEnItalic" tone="brassLight" style={{ fontSize: 13 }}>
                  Sign up
                </Text>
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldLabel({ children }: { children: string }) {
  return (
    <View style={{ marginBottom: 8 }}>
      <MonoLabel size={9} tracking={2.5} tone="brass">{children}</MonoLabel>
    </View>
  );
}

function Field(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      placeholderTextColor={colors.inkDeep}
      {...props}
      style={[
        {
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
          paddingVertical: 10,
          color: colors.ink,
          fontSize: 15,
          fontFamily: 'EBGaramond_400Regular',
        },
        props.style,
      ]}
    />
  );
}
