import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function createAccount() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (!emailOrPhone || !password || !confirmPassword) {
      Alert.alert('Error', 'Semua kolom harus diisi.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password dan konfirmasi tidak cocok.');
      return;
    }

    Alert.alert('Berhasil', 'Akun berhasil dibuat (dummy).',
      [{text: "OK", onPress:()=>router.push("/PilihTema")}]);
  };

  const handleGoogleLogin = () => {
   
    Alert.alert('Login Google', 'Login dengan Google (dummy).',
      [{text: "OK", onPress:()=>router.push("/PilihTema")}]);
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Akun</Text>

      <TextInput
        style={styles.input}
        placeholder="Email atau Nomor Telepon"
        onChangeText={setEmailOrPhone}
        value={emailOrPhone}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Konfirmasi Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupText}>Daftar</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Atau</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Text style={styles.googleText}>Login dengan Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  signupText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#555',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#888',
    paddingVertical: 12,
    borderRadius: 8,
  },
  googleText: {
    textAlign: 'center',
    color: '#444',
    fontWeight: '600',
    fontSize: 16,
  },
});
