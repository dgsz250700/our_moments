import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Platform, View, Text } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import {
  useFonts,
  DancingScript_700Bold,
} from '@expo-google-fonts/dancing-script';
import {
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
} from '@expo-google-fonts/playfair-display';
import {
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
} from '@expo-google-fonts/lato';

export default function App() {
  const [fontsLoaded] = useFonts({
    DancingScript_700Bold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_700Bold_Italic,
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>✦</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HomeScreen />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f1e9',
    paddingTop: Platform.OS === 'android' ? 35 : 0,
  },
  loading: {
    flex: 1,
    backgroundColor: '#f4f1e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 32,
    color: '#c0845a',
  },
});
