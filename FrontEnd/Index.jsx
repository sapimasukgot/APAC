import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
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
  const scrollViewRef = useRef(null);
  const router = useRouter();

  const handleScroll = (event) => {
    const offSetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offSetX / width);
    setCurrentPage(pageIndex);
  };

  const handleSkip = () => {
    const targetIndex = slides.length - 1;
    setCurrentPage(targetIndex);
    scrollViewRef.current?.scrollToOffset({ offset: targetIndex * width, animated: false });
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={scrollViewRef}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => {
          if (item.isLogin) {
            return (
              <View style={{ width, flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.MegaText}>WELCOME</Text>

                <TouchableOpacity 
                style={styles.loginButton} 
                onPress={()=>router.push("/explore")}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push("/create-account")}
                >
                  <Text style={styles.createButtonText}>Create Account</Text>
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
            style={[styles.dot, { opacity: index === currentPage ? 1 : 0.3 }]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip} >
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
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  skipButtonText: {
    color: "blue",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    marginTop: 20,
  },
  loginButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    marginTop: 15,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  MegaText: {
    fontSize: 48,
    textAlign: "center",
  },
});
