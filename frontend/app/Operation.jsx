import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import api from "./api";

export default function Operation() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: 0, sender: "ai", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    setInitializing(true);
    console.log("Initializing app...");

    const cachedSessionId = await fetchSessionId();
    if (cachedSessionId) {
      setSessionId(cachedSessionId);
      console.log("Using cached session:", cachedSessionId);
    } else {
      const newSessionId = await createNewSession();
      if (newSessionId) {
        setSessionId(newSessionId);
        console.log("New session created:", newSessionId);
      } else {
        console.log("Failed to establish a session.");
        Alert.alert(
          "Connection Issue",
          "We're having trouble connecting to the chat service. You can still try sending messages, but you may encounter errors."
        );
      }
    }

    setInitializing(false);
  };

  const fetchSessionId = async () => {
    try {
      console.log("Fetching session ID...");
      const response = await api.get("/chat/cached-session-id", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("Session ID response:", response.data);

      if (response.data?.session_id) {
        return response.data.session_id;
      }
      return null;
    } catch (error) {
      console.error(
        "Error fetching session ID:",
        error.response
          ? `Status: ${error.response.status}, Data: ${JSON.stringify(
              error.response.data
            )}`
          : error.message
      );
      if (error.response?.status === 400 && error.response?.data?.session_id) {
        console.log(
          "Received session ID despite 400 status:",
          error.response.data.session_id
        );
        return error.response.data.session_id;
      }
      return null;
    }
  };

  const createNewSession = async () => {
    try {
      console.log("Creating new session...");
      const response = await api.post("/chat/session", {
        user_id: "test-user-id",
      });

      console.log("New session response:", response.data);

      if (response.data?.session_id) {
        return response.data.session_id;
      } else {
        console.error("Failed to create new session:", response.data);
        return await attemptInitialAuth();
      }
    } catch (error) {
      console.error(
        "Error creating new session:",
        error.response
          ? {
              status: error.response.status,
              data: error.response.data,
            }
          : error.message
      );
      return await attemptInitialAuth();
    }
  };

  const attemptInitialAuth = async () => {
    try {
      console.log("Attempting initial authentication...");
      const response = await api.post("/auth/login", {
        user_id: "test-user-id",
        email: "test@example.com",
      });
      console.log("Auth response:", response.data);
      if (response.data?.session_id) {
        setSessionId(response.data.session_id);
        return response.data.session_id;
      } else if (response.data?.success) {
        return await fetchSessionId();
      } else {
        Alert.alert(
          "Authentication Error",
          "Failed to authenticate with the server."
        );
        return null;
      }
    } catch (error) {
      console.error(
        "Error during authentication:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Session Creation Error",
        "We're having trouble establishing a session."
      );
      return null;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { id: messages.length, sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentMessageText = input;
    setInput("");
    setLoading(true);

    const user = {
      user_id: "test-user-id",
      email: "test@example.com",
      full_name: "John Doe",
      location: "Jakarta",
      linkedin: "https://linkedin.com/in/test",
      businesses: ["Business A", "Business B"],
    };

    try {
      if (!sessionId) {
        Alert.alert(
          "Session Error",
          "No session ID available. Please try again."
        );
        setLoading(false);
        return;
      }

      const endpoint = `/chat/lumea_page/${sessionId}/send`;

      console.log("Sending message to API endpoint:", endpoint, "with data:", {
        user,
        message: currentMessageText,
      });
      const response = await api.post(endpoint, {
        user,
        message: currentMessageText,
      });

      console.log("API reply:", response.data);

      if (response.data?.ai?.message) {
        const aiMessage = {
          id: messages.length + 1,
          sender: "ai",
          text: response.data.ai.message,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else if (response.data?.reply) {
        const aiMessage = {
          id: messages.length + 1,
          sender: "ai",
          text: response.data.reply,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        console.log("No AI reply received in expected format.");
      }
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
      Alert.alert("Message Error", "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === "user" ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Markdown>{item.text}</Markdown>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="Back" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Chat Assistant</Text>
        {sessionId ? (
          <Text style={styles.sessionIndicator}>✓</Text>
        ) : (
          <Text style={styles.sessionIndicatorMissing}>?</Text>
        )}
      </View>

      {initializing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Connecting to chat service...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.chatContainer}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message..."
              editable={!loading}
            />
            <Button
              title={loading ? "..." : "Send"}
              onPress={sendMessage}
              disabled={loading}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sessionIndicator: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
    width: 20,
  },
  sessionIndicatorMissing: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    width: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  chatContainer: { padding: 10 },
  message: {
    padding: 10,
    marginVertical: 4,
    maxWidth: "80%",
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  aiMessage: {
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
