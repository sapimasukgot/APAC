import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function LoadingScreenAwal() {
  const router = useRouter();

  useEffect(() => {
    const loadingTime = setTimeout(() => {
      router.replace("/index");
    }, 3000);
    return () => clearTimeout(loadingTime);
  }, []);
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2196F3" />
      <Text style={styles.text}>SABAR</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
  }
});