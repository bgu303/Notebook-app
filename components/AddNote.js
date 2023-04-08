import { StyleSheet, View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import firebaseConfig from '../FirebaseConfig';
import fetchNotes from '../FetchNotes';
import { loadFonts } from '../Fonts';
import { Ionicons } from '@expo/vector-icons';
import inputFormatter from '../InputFormatter';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function AddNote(props) {

    const { setNotes, addNoteDialog, setAddNoteDialog } = props;
    const [note, setNote] = useState({
        date: '',
        title: '',
        noteText: ''
    });
    const userId = auth.currentUser?.uid;

    const handlePress = () => {
        setAddNoteDialog(false);
    }

    useEffect(() => {
        loadFonts();
    }, [])

    const saveData = async () => {
        try {
            inputFormatter(note.date, note.title, note.noteText)
            await addDoc(collection(db, 'notedata'), {
                note,
                userId,
                email: auth.currentUser.email
            })
            setNote({
                date: '',
                title: '',
                noteText: ''
            });
            fetchNotes(userId, setNotes);
            setAddNoteDialog(false)
        } catch (error) {
            console.log('error ' + error)
            Alert.alert(error.message)
        }
    }

    return (
        <View style={styles.overlay}>
            <Ionicons name='close-outline' size={30} style={styles.overlayText} onPress={handlePress}></Ionicons>
            <View style={styles.innerView}>
                <TextInput placeholderTextColor='white' value={note.date} placeholder='Date (dd.mm.yyyy)' style={styles.textInput} onChangeText={value => setNote({ ...note, date: value })}></TextInput>
                <TextInput placeholderTextColor='white' value={note.title} placeholder='Title' style={styles.textInput} onChangeText={value => setNote({ ...note, title: value })}></TextInput>
                <TextInput multiline={true} placeholderTextColor='white' value={note.noteText} placeholder='Note' style={styles.textInputNote} onChangeText={value => setNote({ ...note, noteText: value })}></TextInput>
                <Button onPress={saveData} title='Add note'></Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: '#191b1f',
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,
        height: 500,
        borderRadius: 10,
    },
    textInput: {
        width: 200,
        borderWidth: 1,
        borderColor: 'white',
        color: 'white',
        marginBottom: 10,
        paddingLeft: 5,
        borderRadius: 5
    },
    textInputNote: {
        width: 200,
        height: 150,
        borderWidth: 1,
        borderColor: 'white',
        color: 'white',
        marginBottom: 10,
        textAlignVertical: 'top',
        paddingLeft: 5,
        borderRadius: 5
    },
    overlayText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        top: 10,
        right: 10
    },
    innerView: {
        top: '3%'
    }
});