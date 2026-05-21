import { Defs, LinearGradient, Stop } from 'react-native-svg';

// Shared whisky liquid gradients — 1:1 with prototype <defs>.
export function LiquidDefs() {
  return (
    <Defs>
      <LinearGradient id="amber-liq" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%"   stopColor="#E8A35C" />
        <Stop offset="50%"  stopColor="#C8761F" />
        <Stop offset="100%" stopColor="#8E4A0E" />
      </LinearGradient>
      <LinearGradient id="dark-liq" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%"   stopColor="#B5743A" />
        <Stop offset="50%"  stopColor="#7A4818" />
        <Stop offset="100%" stopColor="#3A1F08" />
      </LinearGradient>
      <LinearGradient id="gold-liq" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%"   stopColor="#F0C778" />
        <Stop offset="50%"  stopColor="#D4A574" />
        <Stop offset="100%" stopColor="#9C7A3E" />
      </LinearGradient>
      <LinearGradient id="pale-liq" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0%"   stopColor="#F5DDA0" />
        <Stop offset="50%"  stopColor="#D4B57A" />
        <Stop offset="100%" stopColor="#8E6F3A" />
      </LinearGradient>
    </Defs>
  );
}
