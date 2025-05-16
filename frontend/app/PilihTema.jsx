import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'automotive', label: 'Automotive' },
  { id: 'fnb', label: 'FnB' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'it', label: 'IT' },
  { id: 'retail', label: 'Retail' },
  { id: 'others', label: 'Others' },
];

export default function CategorySelection() {
  const [selected, setSelected] = useState(null);
  const [othersSelected, setOthersSelected] = useState('');
  const router = useRouter();

  const handleSelect = (id) => {
    setSelected(id);
  };

  const handleNext = () => {
    if (!selected) {
      Alert.alert("Selection Required", "Please select a business category");
      return;
    }
    if(selected === 'others' && !othersSelected.trim()) {
     Alert.alert("Input required","Please specify your business");
     return;
    }
    const selectedCategory = categories.find(cat =>  cat.id === selected)?.label
    const confirm = selected === 'others' ?
     `Are you sure you want to select Others: ${othersSelected}?`
      : `Are you sure you want to select ${selectedCategory}?`;

    Alert.alert(
      "Confirm Selection",
      `Are you sure you want to select ${categories.find(cat => cat.id === selected)?.label}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => router.push("/Operation")
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's get started!</Text>
      <Text style={styles.subtitle}>Which field is your business in?{'\n'}Please select categories below</Text>

      <View style={styles.grid}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              selected === item.id && styles.cardSelected,
            ]}
            onPress={() => handleSelect(item.id)}
          >
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
         {selected === 'others' && (
        <View style={styles.otherInputContainer}>
          <TextInput
            style={styles.otherInput}
            placeholder="Please specify your business"
            value={othersSelected}
            onChangeText={setOthersSelected}
          />
        </View>
      )}
      <TouchableOpacity 
        style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
        onPress={handleNext}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 60,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  card: {
    width: '47%',
    height: 100,
    backgroundColor: '#f6f2e7',
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardSelected: {
    backgroundColor: '#e6dfc5',
    borderWidth: 2,
    borderColor: '#444',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#4464d9',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 30,
  },
  nextButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  otherInputContainer: {
    width: '100%',
    marginTop: 10,
  },
  otherInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
    backgroundColor: '#f9f9f9',
  },
});