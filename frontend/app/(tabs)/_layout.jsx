import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import LoadingScreenAwal from "../LoadingScreenAwal";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) return <LoadingScreenAwal/>;
  const backgroundColor = colorScheme === "dark" ? "#000":"#fff";
  
  return (
    <ThemeProvider value={backgroundColor}>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="explore" options={{ headerShown: false }} />
        <Stack.Screen name="Operation" options={{ headerShown: false }} />
        <Stack.Screen name="not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}