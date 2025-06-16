import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function NoteScreen() {
  const router = useRouter();                        
  const params = useLocalSearchParams();               // récupère les paramètres passés à la page
  const note = params.note ? JSON.parse(params.note as string) : null;  

  // Si la note n'existe pas (paramètre absent ou invalide), on affiche un message d'erreur simple
  if (!note)
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Note no found</Text>
      </View>
    );

  // Fonction pour modifier la note : renvoie vers le formulaire en passant la note actuelle
  const handleEdit = () => {
    router.push({
      pathname: '/form',
      params: { note: JSON.stringify(note) },  // on transmet la note pour préremplir le formulaire
    });
  };

  // Fonction pour supprimer la note
  const handleDelete = async () => {
    const raw = await AsyncStorage.getItem('notes');  // on récupère toutes les notes
    const notes = raw ? JSON.parse(raw) : [];           // on parse en tableau
    const filtered = notes.filter((n: any) => n.id !== note.id);  // on enlève la note à supprimer
    await AsyncStorage.setItem('notes', JSON.stringify(filtered));  // on sauvegarde la nouvelle liste
    router.push('/');                                  // on retourne à la page d'accueil
  };

  return (
    <View style={styles.container}>
      {/* Carte qui affiche la note */}
      <View style={styles.card}>
        <Text style={styles.title}>{note.title}</Text>      
        <Text style={styles.content}>{note.contenu}</Text>   
        <Text style={styles.date}>
          {new Date(note.date).toLocaleDateString()}
        </Text>                                              

        {/* Point coloré selon l’importance */}
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

        {/* Boutons Modifier et Supprimer côte à côte */}
        <View style={styles.cardButtons}>
          <View style={styles.button}>
            <Button title="Edit" onPress={handleEdit} color="#007AFF" />
          </View>
          <View style={styles.button}>
            <Button title="Delete" onPress={handleDelete} color="#FF3B30" />
          </View>
        </View>
      </View>

      {/* Bouton Retour en bas de l’écran */}
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
