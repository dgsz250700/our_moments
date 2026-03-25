import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Modal, TextInput, SafeAreaView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { moments, Moment } from '../data/moments';
import { MomentCard } from '../components/MomentCard';

export function HomeScreen() {
  const [momentList, setMomentList] = useState<Moment[]>(moments);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImageAndOpenModal = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setImageUri(pickerResult.assets[0].uri);
      setIsModalVisible(true);
    }
  };

  const handleSave = () => {
    if (!title) return;

    const newMoment: Moment = {
      id: Date.now().toString(),
      title,
      note,
      date,
      location,
      image: imageUri ? { uri: imageUri } : require('../../assets/images/moment1.jpg'),
    };

    setMomentList([newMoment, ...momentList]);
    
    setTitle('');
    setNote('');
    setDate('');
    setLocation('');
    setImageUri(null);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setTitle('');
    setNote('');
    setDate('');
    setLocation('');
    setImageUri(null);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.albumBackground}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* Added a romantic album header */}
        <Text style={styles.albumTitle}>Our Memories</Text>
        
        {/* Reverted back to the vertical scrolling list */}
        <FlatList
          data={momentList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MomentCard moment={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        
        <TouchableOpacity style={styles.fab} onPress={pickImageAndOpenModal}>
          <Text style={styles.fabText}>+ Add Photo</Text>
        </TouchableOpacity>

        {/* The form modal */}
        <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Memory</Text>
            
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            )}
            
            <TextInput style={styles.input} placeholder="Title (e.g. Picnic)" value={title} onChangeText={setTitle} />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Note" value={note} onChangeText={setNote} multiline />
            <TextInput style={styles.input} placeholder="Date (e.g. 2024-06-15)" value={date} onChangeText={setDate} />
            <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  albumBackground: {
    flex: 1,
    backgroundColor: '#fdfbf7', // Warm, creamy paper-like background
  },
  safeArea: {
    flex: 1,
  },
  albumTitle: {
    fontSize: 26,
    fontWeight: '300',
    color: '#8d7b68', // Elegant warm brown 
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: 2.5,
    fontStyle: 'italic',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 120, // space for FAB
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#8d7b68', // Warm brown tone for the album aesthetic
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#8d7b68',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fabText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fdfbf7', // Matched modal to album vibe
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#8d7b68',
    marginBottom: 16,
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#eee8e0',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#2f3640',
    borderWidth: 1,
    borderColor: '#eee8e0', // subtle warm border
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#ecdcd0',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8d7b68',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#8d7b68',
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
