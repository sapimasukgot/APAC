import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "./api"; // your api helper file

export default function LoginScreen() {
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!nama || !password) {
      Alert.alert("Error", "Nama dan password harus diisi.");
      return;
    }

    setLoading(true);
    try {
      const response = await api("/auth/login", "POST", {
        nama,
        password,
      });

      if (response.success) {
        Alert.alert("Selamat", "Anda berhasil login", [
          { text: "OK", onPress: () => router.push("/Operation.jsx") },
        ]);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      setShowModal(true);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={style.container}>
        <Text style={style.text}>Login Page</Text>

        <TextInput
          style={style.input}
          placeholder="Nama"
          onChangeText={setNama}
          value={nama}
          autoCapitalize="none"
        />
        <TextInput
          style={style.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />

        <TouchableOpacity
          style={[style.button, loading && { backgroundColor: "#aaa" }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={style.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={style.modalOverlay}>
            <View style={style.modalContent}>
              <Text style={style.modalTitle}>Login Gagal!</Text>
              <Text style={{ marginBottom: 20 }}>
                Nama atau password salah.
              </Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={style.modalCloseText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const style = {
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalCloseText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 16,
  },
};
