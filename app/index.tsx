import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useFocusEffect, useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


type Note = {
  id: number;                     
  title: string;                   
  contenu: string;                 
  date: string;         
  importance: 'high' | 'medium' | 'low'; 
};

export default function Index() {
  const router = useRouter();             
  const [notes, setNotes] = useState<Note[]>([]);  // état local pour stocker les notes

  // useFocusEffect : recharge les notes à chaque fois que cette page est visible
  useFocusEffect(
    useCallback(() => {
      // fonction asynchrone pour récupérer les notes depuis AsyncStorage
      const load = async () => {
        const raw = await AsyncStorage.getItem('notes');    
        setNotes(raw ? JSON.parse(raw) : []);                
      };
      load();
    }, [])
  );

  // fonction appelée quand on clique sur une note pour ouvrir la page détail
  const openNote = (note: Note) => {
    router.push({
      pathname: '/note',                         
      params: { note: JSON.stringify(note) },   // on passe la note en paramètre encodée en JSON
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>HomeBook</Text>  
        <Link href="/form" asChild>
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>ADD</Text>
          </Pressable>
        </Link>
      </View>

      {/* Affichage des notes ou message si aucune */}
      {notes.length === 0 ? (
        <Text style={styles.empty}>No notes were created.</Text>  // message si aucune note
      ) : (
        // FlatList pour afficher la liste des notes efficacement
        <FlatList
          data={notes}                                  
          keyExtractor={(item) => item.id.toString()}   // clé unique pour chaque note
          contentContainerStyle={styles.listContent}  
          showsVerticalScrollIndicator={false}          // cache la barre de défilement verticale
          renderItem={({ item }) => (
           
            <TouchableOpacity onPress={() => openNote(item)}>
              <View style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>    
                <Text style={styles.content}>{item.contenu}</Text>      
                <Text style={styles.date}>
                  {new Date(item.date).toLocaleDateString()}
                </Text>                                               
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        item.importance === 'high'
                          ? '#FF3B30'
                          : item.importance === 'medium'
                          ? '#FF9500'
                          : '#34C759',
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#456990',  
    paddingTop: 50,             
    paddingHorizontal: 16,       
  },

  topBar: {
    flexDirection: 'row',            
    justifyContent: 'space-between', 
    alignItems: 'center',             
    marginBottom: 20,                 
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',       
    color: '#fff',           
  },
  addButton: {
    backgroundColor: '#fff',            
    paddingHorizontal: 18,               
    paddingVertical: 8,                  
    borderRadius: 20,                   
    shadowColor: '#000',               
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,                     
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#456990',                
  },

  empty: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 80,
    fontSize: 18,
  },

  listContent: {
    paddingBottom: 80,               
  },

  card: {
    backgroundColor: '#fff',          
    width: '92%',                     
    borderRadius: 12,                
    padding: 16,                    
    marginBottom: 16,               
    shadowColor: '#000',            
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  title: { fontSize: 18, 
    fontWeight: 'bold', 
    color: '#222' },  

  content: { fontSize: 15, 
    color: '#444', 
    marginTop: 6 },        
  date: { fontSize: 12, 
    color: '#888', 
    marginTop: 6 },           
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});
