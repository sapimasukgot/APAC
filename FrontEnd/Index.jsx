import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get("window");

const slides = [
  { key: "1", title: "Halo", content: "bbbbb" },
  { key: "2", title: "hal 2", content: "bbbbbbbb" },
  { key: "3", title: "hal 3", content: "nbvfthnbvfgyhjn" },
  { key: "4", title: "hal 4", content: "nbvfrtyjkgf" },
  { key: "5", isLogin: true },
];

export default function Index() {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const handleScroll = (event) => {
    const offSetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offSetX / width);
    setCurrentPage(pageIndex);
  };

  const handleSkip = () => {
    router.push("/explore");
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        initialScrollIndex={0}
        renderItem={({ item }) => {
          if (item.isLogin) {
            return (
              <View style={{ width, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text styles={styles.MegaText}>WELCOME</Text>
                <TouchableOpacity 
                  style={styles.loginButton}
                  onPress={handleSkip}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.createButton}
                    >
                      <Text style={styles.loginButtonText} onPress={onPress=()=>{router.push("/create-account")}}>Create Account</Text>              
                </TouchableOpacity>
              </View>
            );
          }
          return (
            <ScrollView
              contentContainerStyle={{
                width,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
              }}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
            </ScrollView>
          );
        }}
      />
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { opacity: index === currentPage ? 1 : 0.3 },
            ]}
          />
        ))}
      </View>
      
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "black",
    margin: 5,
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
  skipButtonText: {
    color: 'blue',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    width: '80%',
  },
  loginButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  createButton:{
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    },
  MegaText:{
    fontSize: 48,
    textAlign: 'center',
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
    maxHeight: "80%",
  },
  modalContent: {
    alignItems: "center",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  modalText: {
    marginVertical: 10,
    textAlign: "center",
  },
  agreeButton: {
    marginTop: 10,
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  agreeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});