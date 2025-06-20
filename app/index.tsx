
import React, { useCallback, useState } from 'react';
import {View, Text, StyleSheet, FlatList,TouchableOpacity, Pressable} from 'react-native';
import { useFocusEffect, useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


// On définit ce qu’est une "note"
type Note = {
  id: string;                         
  title: string;                       
  content: string;                       
  date: string;                         
  importance: 'high' | 'medium' | 'low'; 
};

  
export default function Index() {
  const router = useRouter();                   
  const [notes, setNotes] = useState<Note[]>([]); // État pour stocker les notes

  // Cette fonction est appelée quand on revient sur cette page
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const raw = await AsyncStorage.getItem('notes'); 
        setNotes(raw ? JSON.parse(raw) : []);            
      };
      load();
    }, [])
  );

  // Fonction pour ouvrir une note quand on clique dessus
  const openNote = useCallback((note: Note) => {
    router.push({
      pathname: '/note',                    
      params: { note: JSON.stringify(note) },  
    });
  }, [router]);

  // Ce que l’écran affiche
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>HomeBook</Text>  
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/form')} // navigation propre sans paramètre
        >
          <Text style={styles.addButtonText}>ADD</Text>
        </Pressable>
      </View>

      {/* Si aucune note n’existe, on affiche un message */}
      {notes.length === 0 ? (
        <Text style={styles.empty}>No notes were created.</Text>
      ) : (
        // Sinon, on affiche toutes les notes avec FlatList
        <FlatList
          data={notes}                                
          keyExtractor={(item) => item.id}             
          contentContainerStyle={styles.listContent}    
          showsVerticalScrollIndicator={false}        
          renderItem={({ item }) => (                  
            <TouchableOpacity 
              onPress={() => openNote(item)}          
              activeOpacity={0.7}                     
            >
              <View style={styles.card}>                
                <Text style={styles.title}>{item.title}</Text>    
                <Text style={styles.content}>{item.content}</Text>      
                <Text style={styles.date}>
                  {new Date(item.date).toLocaleDateString()}  
                </Text>                                               

                {/* Un point coloré selon l’importance */}
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        item.importance === 'high'
                          ? '#F45B69'       
                          : item.importance === 'medium'
                          ? '#FFD4CA'       
                          : '#7EE4EC',      
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
    marginHorizontal: '4%',           
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },

  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#222' 
  },

  content: { 
    fontSize: 15, 
    color: '#444', 
    marginTop: 6 
  },

  date: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 6 
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,       
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});


 