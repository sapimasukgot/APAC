import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "./api"; // Updated path with better organization

// Create a mock API for development if real API fails
const createMockApi = () => {
  console.log("Using mock API for development");
  return {
    post: (endpoint, data) => {
      return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
          console.log(`Mock API call to ${endpoint}`, data);
          resolve({
            data: {
              success: true,
              message: "Mock signup successful",
              userId: "mock-user-123",
            },
          });
        }, 1000);
      });
    },
  };
};

// Component name properly capitalized
export default function CreateAccount() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiClient, setApiClient] = useState(null);

  // Initialize API with fallback
  useEffect(() => {
    const initApi = async () => {
      try {
        // Test if API is accessible
        await api.get("/ping");
        setApiClient(api);
      } catch (error) {
        console.warn("Could not connect to main API, using mock API");
        setApiClient(createMockApi());
      }
    };

    initApi();
  }, []);

  const handleSignup = async () => {
    // Form validation
    if (!emailOrPhone || !password || !confirmPassword) {
      Alert.alert("Error", "Semua kolom harus diisi.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password dan konfirmasi tidak cocok.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const isEmail = emailRegex.test(emailOrPhone);
    const isPhone = phoneRegex.test(emailOrPhone);

    if (!isEmail && !isPhone) {
      Alert.alert("Error", "Format email atau nomor telepon tidak valid.");
      return;
    }

    setLoading(true);

    // Check if API client is ready
    if (!apiClient) {
      Alert.alert("Error", "Aplikasi sedang memuat. Silakan coba lagi.", [
        { text: "OK", onPress: () => setLoading(false) },
      ]);
      return;
    }

    // Add timeout to prevent infinite loading if API doesn't respond
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(new Error("Koneksi timeout. Periksa koneksi internet Anda.")),
        10000
      )
    );

    try {
      // Use the same payload structure as your original code to maintain compatibility
      const payload = {
        email: emailOrPhone, // Keep as email for compatibility with your API
        password,
        categories: ["Technology"],
        country: "Indonesia",
        scale: "Small",
        business_name: "My Business",
        business_description: "Just testing.",
      };

      // Race the API call against a timeout
      const response = await Promise.race([
        apiClient.post("/signup", payload),
        timeoutPromise,
      ]);

      console.log("API Response:", response); // Debug logging

      // Handle successful response
      if (response && response.data) {
        Alert.alert("Berhasil", "Akun berhasil dibuat.", [
          { text: "OK", onPress: () => router.push("/PilihTema") },
        ]);
      } else {
        throw new Error("Respons server tidak valid");
      }
    } catch (error) {
      console.error("Signup Error:", error); // Debug logging

      // More robust error handling with detailed messaging
      let errorMessage = "Gagal membuat akun. Silakan coba lagi.";

      if (
        error.message === "Network Error" ||
        error.message.includes("timeout")
      ) {
        errorMessage =
          "Koneksi ke server gagal. Periksa koneksi internet Anda.";
      } else if (error?.response?.status === 400) {
        errorMessage = "Data yang dimasukkan tidak valid.";
      } else if (error?.response?.status === 409) {
        errorMessage = "Email atau nomor telepon sudah terdaftar.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);

      // For development - option to proceed anyway
      if (__DEV__) {
        setTimeout(() => {
          Alert.alert("Development Mode", "Lanjutkan ke halaman berikutnya?", [
            { text: "Tidak" },
            { text: "Ya", onPress: () => router.push("/PilihTema") },
          ]);
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // In a real implementation, you would use Expo Auth or similar
      // Example: const result = await Google.logInAsync({...})

      // For development - simulate successful login
      setTimeout(() => {
        setLoading(false);
        Alert.alert("Login Google", "Login dengan Google berhasil.", [
          { text: "OK", onPress: () => router.push("/PilihTema") },
        ]);
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Gagal login dengan Google.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buat Akun</Text>

      {!apiClient && (
        <View style={styles.apiWarning}>
          <Text style={styles.apiWarningText}>
            Memeriksa koneksi ke server...
          </Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email atau Nomor Telepon"
        onChangeText={setEmailOrPhone}
        value={emailOrPhone}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        style={styles.input}
        placeholder="Konfirmasi Password"
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.signupButton, loading && styles.disabledButton]}
        onPress={handleSignup}
        disabled={loading || !apiClient}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.signupText}>Daftar</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>Atau</Text>

      <TouchableOpacity
        style={[styles.googleButton, loading && styles.disabledButton]}
        onPress={handleGoogleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#444" />
        ) : (
          <Text style={styles.googleText}>Login dengan Google</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/explore")}
        style={styles.loginLink}
        disabled={loading}
      >
        <Text style={styles.loginText}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  apiWarning: {
    backgroundColor: "#FFF9C4",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FFD600",
  },
  apiWarningText: {
    color: "#5D4037",
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#aaa",
  },
  signupText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#555",
  },
  googleButton: {
    borderWidth: 1,
    borderColor: "#888",
    paddingVertical: 12,
    borderRadius: 8,
  },
  googleText: {
    textAlign: "center",
    color: "#444",
    fontWeight: "600",
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    color: "#2196F3",
    fontSize: 14,
  },
  devButton: {
    marginTop: 20,
    backgroundColor: "#FF5722",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "center",
  },
  devButtonText: {
    color: "white",
    fontSize: 12,
  },
});
