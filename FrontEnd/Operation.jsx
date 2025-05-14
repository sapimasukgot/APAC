import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Operation() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: 0, sender: 'ai', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const getDummyAIResponse = (userInput) => {
    if (userInput.toLowerCase().includes('hello')) {
      return 'Hello there! Nice to meet you.';
    } else if (userInput.toLowerCase().includes('how are you')) {
      return 'I\'m doing well, thank you for asking!';
    } else {
      return 'I\'m still learning to respond to that. Can you try something else?';
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { id: messages.length, sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const aiReply = getDummyAIResponse(input);
      const aiMessage = {
        id: messages.length + 1,
        sender: 'ai',
        text: aiReply,
      };
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === 'user' ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="Back" onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Chat Assistant</Text>
        <View style={{width: 50}} />
      </View>
      
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
        />
        <Button title={loading ? "..." : "Send"} onPress={sendMessage} disabled={loading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: { padding: 10 },
  message: {
    padding: 10,
    marginVertical: 4,
    maxWidth: '80%',
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});
