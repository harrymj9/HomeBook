import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Button, Keyboard, Platform, StyleSheet, Text, TextInput,
  TouchableOpacity, TouchableWithoutFeedback, View,
} from 'react-native';


const importanceLevels = [
  { value: 'high',   color: 'red'    },
  { value: 'medium', color: 'orange' },
  { value: 'low',    color: 'green'  },
];


export default function Form() {

  const [title,       setTitle]       = useState('');       
  const [contenu,     setContenu]     = useState('');      
  const [date,        setDate]        = useState(new Date()); 
  const [importance,  setImportance]  = useState('');      
  const [showPicker,  setShowPicker]  = useState(false);   

  const [editingId,   setEditingId]   = useState<number | null>(null);
  const { note } = useLocalSearchParams();  

  useEffect(() => {
    if (note) {  // si une note est passée (édition)
      const n = JSON.parse(note as string);
      setTitle(n.title);          
      setContenu(n.contenu);    
      setDate(new Date(n.date));  
      setImportance(n.importance); 
      setEditingId(n.id);        
    }
  }, [note]);

  const handleSubmit = async () => {
    // Vérifie que titre et contenu ne sont pas vides
    if (!title.trim() || !contenu.trim()) {
      alert('Please fill in the title and content.');
      return;
    }

    // Création de l'objet note à sauvegarder
    const noteObj = {
      id: editingId ?? Date.now(),    // si on édite, on garde l'id, sinon on crée un nouveau avec timestamp
      title: title.trim(),
      contenu: contenu.trim(),
      date: date.toISOString(),       // format ISO standard pour la date
      importance,
    };

    try {
      const raw = await AsyncStorage.getItem('notes');  // récupérer les notes existantes
      const arr = raw ? JSON.parse(raw) : [];

      // Si édition, remplacer la note avec même id, sinon ajouter la nouvelle note
      const updatedNotes = editingId
        ? arr.map((n: any) => (n.id === editingId ? noteObj : n))
        : [...arr, noteObj];

      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));  // sauvegarder dans dans notre base de données
      router.push('/');  // revenir à la page d'accueil
    } catch (e) {
      console.error('Erreur de sauvegarde :', e);
      alert('Une erreur est survenue.');
    }
  };

  return (
    // Pour fermer le clavier quand on tpuche  en dehors du formulaire
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>

        {/* Titre de la page, selon création ou modification */}
        <Text style={styles.page}>
          {editingId ? 'Modifier la note' : 'create a new note'}
        </Text>

        {/* Champ texte pour le titre */}
        <TextInput
          style={styles.input}
          placeholder="Enter your title here"
          value={title}
          onChangeText={setTitle}
        />

        {/* Champ texte pour le contenu, multi-ligne */}
        <Text>Content</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter your content here"
          value={contenu}
          onChangeText={setContenu}
          multiline
        />

        {/* Champ pour afficher la date, ouvre le picker au clic */}
        <Text>Date</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
          <Text style={{ color: '#fff' }}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {/* Affichage du DateTimePicker si demandé */}
        {showPicker && (
          <>
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, sel) => {
                if (e.type === 'dismissed') { setShowPicker(false); return; }
                if (sel) setDate(sel);
                if (Platform.OS === 'android') setShowPicker(false);
              }}
            />
            {/* Sur iOS, bouton ok pour fermer */}
            {Platform.OS === 'ios' && (
              <Button title="ok" onPress={() => setShowPicker(false)} />
            )}
          </>
        )}

        {/* Choix de l’importance sous forme de boutons colorés */}
        <View style={styles.importanceContainer}>
          {importanceLevels.map((lvl) => (
            <TouchableOpacity
              key={lvl.value}
              style={[
                styles.importanceButton,
                { backgroundColor: lvl.color },
                importance === lvl.value && styles.selected, // style spécial si sélectionné
              ]}
              onPress={() => setImportance(lvl.value)}
            />
          ))}
        </View>

        {/* Boutons d’action : Retour et Soumettre */}
        <Button title="Back"   onPress={() => router.back()} />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#456990' 
  },
  page: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff8f8', 
    marginBottom: 12 
  },
  input: { 
    borderWidth: 1, 
    width: '80%', 
    color: '#fff8f8', 
    padding: 8, 
    marginBottom: 12, 
    borderRadius: 5 
  },
  dateInput: { 
    borderWidth: 1, 
    borderColor: '#000', 
    width: '80%', 
    padding: 8, 
    marginBottom: 12,
    borderRadius: 5, 
    justifyContent: 'center', 
    backgroundColor: '#456990' 
  },
  importanceContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 

    marginBottom: 20 
  },
  importanceButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    borderWidth: 2, 
    borderColor: '#fff' ,
    marginRight: 15,
  },
  selected: { 
    borderWidth: 4, 
    borderColor: '#fff' 
  },
});
