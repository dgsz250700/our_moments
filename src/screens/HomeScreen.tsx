import React, { useState, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  SafeAreaView,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { moments, Moment } from '../data/moments';
import { PhotoPostcard } from '../components/PhotoPostcard';
import { CalendarPanel } from '../components/CalendarPanel';
import { MapPanel } from '../components/MapPanel';
import { Fonts } from '../theme/fonts';

const { width } = Dimensions.get('window');
const IS_DESKTOP = width >= 768;

export function HomeScreen() {
  const [momentList, setMomentList] = useState<Moment[]>(moments);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMomentId, setSelectedMomentId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImageAndOpenModal = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
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

    const updatedList = [...momentList, newMoment];
    setMomentList(updatedList);

    setTitle('');
    setNote('');
    setDate('');
    setLocation('');
    setImageUri(null);
    setIsModalVisible(false);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 500);
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
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>

        {/* ── Page Header ── */}
        <View style={styles.headerBar}>
          <Text style={styles.albumTitle}>Our Journal</Text>
          <Text style={styles.albumSubtitle}>{momentList.length} memor{momentList.length !== 1 ? 'ies' : 'y'}</Text>
        </View>

        {/* ── Main Layout ── */}
        {IS_DESKTOP ? (
          // ────────────── Desktop: 2-column ──────────────
          <View style={styles.desktopLayout}>

            {/* Left column: Calendar + Map stacked */}
            <View style={styles.leftColumn}>
              <CalendarPanel moments={momentList} />
              <MapPanel
                moments={momentList}
                selectedMomentId={selectedMomentId}
                onMarkerSelect={(m) => setSelectedMomentId(m.id)}
              />
            </View>

            {/* Right column: Photo gallery (vertical scroll) */}
            <View style={styles.rightColumn}>
              <FlatList
                ref={flatListRef}
                data={momentList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <PhotoPostcard
                    moment={item}
                    onPress={() => setSelectedMomentId(item.id)}
                    isSelected={selectedMomentId === item.id}
                  />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.galleryContent}
                ListEmptyComponent={
                  <View style={styles.emptyGallery}>
                    <Text style={styles.emptyEmoji}>🌸</Text>
                    <Text style={styles.emptyText}>
                      Your memories will{'\n'}bloom here
                    </Text>
                  </View>
                }
              />
            </View>
          </View>
        ) : (
          // ────────────── Mobile: vertical stack ──────────────
          <ScrollView
            style={styles.mobileScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.mobileContent}
          >
            <CalendarPanel moments={momentList} />
            <MapPanel
              moments={momentList}
              selectedMomentId={selectedMomentId}
              onMarkerSelect={(m) => setSelectedMomentId(m.id)}
            />

            {/* Gallery header */}
            <View style={styles.galleryHeader}>
              <Text style={styles.galleryHeaderText}>✨ Memories</Text>
            </View>

            {momentList.map((item) => (
              <PhotoPostcard
                key={item.id}
                moment={item}
                onPress={() => setSelectedMomentId(item.id)}
                isSelected={selectedMomentId === item.id}
              />
            ))}

            {momentList.length === 0 && (
              <View style={styles.emptyGallery}>
                <Text style={styles.emptyEmoji}>🌸</Text>
                <Text style={styles.emptyText}>Your memories will{'\n'}bloom here</Text>
              </View>
            )}

            {/* Bottom padding so FAB doesn't cover last card */}
            <View style={{ height: 100 }} />
          </ScrollView>
        )}

        {/* ── FAB: Add Memory ── */}
        <TouchableOpacity style={styles.fab} onPress={pickImageAndOpenModal}>
          <Text style={styles.fabText}>+ Add Memory</Text>
        </TouchableOpacity>

        {/* ── Add-Memory Modal (unchanged logic) ── */}
        <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>New Memory Page</Text>

            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            )}

            <TextInput
              style={styles.input}
              placeholder="Title (e.g. Picnic)"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Note"
              value={note}
              onChangeText={setNote}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Date (e.g. 2024-06-15)"
              value={date}
              onChangeText={setDate}
            />
            <TextInput
              style={styles.input}
              placeholder="Location"
              value={location}
              onChangeText={setLocation}
            />

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
  root: {
    flex: 1,
    backgroundColor: '#f4f1e9',
  },
  safeArea: {
    flex: 1,
  },

  // ── Header ──
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ddd0',
    gap: 12,
  },
  albumTitle: {
    fontSize: 42,
    color: '#5c4030',
    fontFamily: Fonts.title,
    letterSpacing: 1,
    lineHeight: 50,
  },
  albumSubtitle: {
    fontSize: 13,
    color: '#b09a88',
    fontFamily: Fonts.bodyItalic,
    letterSpacing: 0.3,
    marginTop: 4,
  },

  // ── Desktop 2-column ──
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    width: IS_DESKTOP ? 380 : '100%',
    borderRightWidth: 1,
    borderRightColor: '#e8ddd0',
    backgroundColor: '#faf7f0',
  },
  rightColumn: {
    flex: 1,
  },
  galleryContent: {
    paddingVertical: 12,
    paddingBottom: 100,
    // Cap card width so they don't stretch on wide screens
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },

  // ── Mobile ──
  mobileScroll: {
    flex: 1,
  },
  mobileContent: {
    paddingBottom: 20,
  },
  galleryHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#e8ddd0',
  },
  galleryHeaderText: {
    fontSize: 22,
    color: '#7a5c3a',
    fontFamily: Fonts.headingItalic,
    letterSpacing: 0.3,
  },

  // ── Empty state ──
  emptyGallery: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#b09a88',
    textAlign: 'center',
    fontFamily: Fonts.bodyItalic,
    lineHeight: 26,
  },

  // ── FAB ──
  fab: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: '#6e5c47',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#5c4d3c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  fabText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: Fonts.label,
    letterSpacing: 1.2,
  },

  // ── Modal ──
  modalContainer: {
    flex: 1,
    backgroundColor: '#f4f1e9',
    padding: 24,
  },
  modalTitle: {
    fontSize: 32,
    color: '#6e5c47',
    marginBottom: 16,
    marginTop: 10,
    textAlign: 'center',
    fontFamily: Fonts.title,
    letterSpacing: 0.5,
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
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#4b4b4b',
    borderWidth: 1,
    borderColor: '#e8e1d7',
    fontFamily: Fonts.body,
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
    borderRadius: 12,
    backgroundColor: '#e6dfd5',
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6e5c47',
    fontSize: 16,
    fontFamily: Fonts.label,
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    backgroundColor: '#6e5c47',
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.label,
  },
});
