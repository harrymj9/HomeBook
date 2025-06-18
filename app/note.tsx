import React from 'react';
import { View, Text, Button, StyleSheet,Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function NoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const note = params.note ? JSON.parse(params.note as string) : null;

  if (!note)
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Note not found</Text>
      </View>
    );

  const handleEdit = () => {
    router.push({
      pathname: '/form',
      params: { note: JSON.stringify(note) },  // on transmet la note pour préremplir le formulaire
    });
  };

 const handleDelete = () => {
  {/*  pour la confirmation avant la supression    */}
  Alert.alert(
    "Delete Note",
    "Are you sure you want to delete this note?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
            
        onPress: async () => {
          const raw = await AsyncStorage.getItem('notes');
          const notes = raw ? JSON.parse(raw) : [];
          const filtered = notes.filter((n: any) => n.id !== note.id);
          await AsyncStorage.setItem('notes', JSON.stringify(filtered));
          router.push('/');
        },
      },
    ],
    { cancelable: true }
  );
};


  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.content}>{note.content}</Text> 
        <Text style={styles.date}>
          {new Date(note.date).toLocaleDateString()}
        </Text>

        <View
          style={[
            styles.importanceDot,
            {
              backgroundColor:
                note.importance === 'high'
                  ? '#FF3B30'
                  : note.importance === 'medium'
                  ? '#FF9500'
                  : '#34C759',
            },
          ]}
        />

        <View style={styles.cardButtons}>
          <View style={styles.button}>
            <Button title="Edit" onPress={handleEdit} color="#007AFF" />
          </View>
          <View style={styles.button}>
            <Button title="Delete" onPress={handleDelete} color="#FF3B30" />
          </View>
        </View>
      </View>

      <View style={styles.backButton}>
        <Button title="BACK" onPress={() => router.push('/')} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#456990',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'white',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  importanceDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    width: '80%',
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
