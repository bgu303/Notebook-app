import { StyleSheet, View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseConfig from '../FirebaseConfig';
import { updateDoc, doc } from 'firebase/firestore';
import fetchNotes from '../FetchNotes';
import inputFormatter from '../InputFormatter';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function EditNote(props) {

    const { note, setNotes, editOpen, setEditOpen, menu, setMenu } = props;
    const dateCheck = new RegExp("([0-3][0-9])\.([0-1][0-9])\.[1-2][0-9][0-9][0-9]")
    const userId = auth.currentUser?.uid;
    const [editNote, setEditNote] = useState({
        date: note.note?.date,
        title: note.note?.title,
        noteText: note.note?.noteText
    })

    const saveEditedNote = (id) => {
        try {
            inputFormatter(editNote.date, editNote.title, editNote.noteText)
            const noteRef = doc(db, "notedata", id)
            const updatedFields = {
                "note.date": editNote.date,
                "note.title": editNote.title,
                "note.noteText": editNote.noteText
            }
            updateDoc(noteRef, updatedFields)
                .then(docRef => {
                    fetchNotes(userId, setNotes)
                    setEditOpen(false);
                    setMenu(false);
                })
                .catch(error => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error)
            Alert.alert(error.message)
        }
    }

    const cancelEditNote = () => {
        setMenu(false);
        setEditOpen(false);
    }

    return (
        <View style={styles.overlay}>
            <TextInput value={editNote.date} onChangeText={value => setEditNote({ ...editNote, date: value })} placeholderTextColor="white" placeholder={note.note?.date} style={styles.textInput}></TextInput>
            <TextInput value={editNote.title} onChangeText={value => setEditNote({ ...editNote, title: value })} placeholderTextColor="white" placeholder={note.note?.title} style={styles.textInput}></TextInput>
            <TextInput value={editNote.noteText} onChangeText={value => setEditNote({ ...editNote, noteText: value })} multiline={true} placeholderTextColor="white" placeholder={note.note?.noteText} style={styles.textInputNote}></TextInput>
            <Button color="green" onPress={() => saveEditedNote(note?.id)} title="Save edited note"></Button>
            <Button color="red" title="Cancel" onPress={() => cancelEditNote()}></Button>
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
        borderRadius: 10
    },
    textInput: {
        width: 200,
        borderWidth: 1,
        borderColor: 'white',
        color: 'white',
        marginBottom: 10
    },
    textInputNote: {
        width: 200,
        height: 150,
        borderWidth: 1,
        borderColor: 'white',
        color: 'white',
        marginBottom: 10,
        textAlignVertical: 'top'
    },
    overlayText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        top: 10,
        right: 10
    },
});