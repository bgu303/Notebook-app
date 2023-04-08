import { StyleSheet, View, Text, Alert } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../FirebaseConfig';
import fetchNotes from '../FetchNotes';
import { Ionicons } from '@expo/vector-icons';
import { loadFonts } from '../Fonts';
import { useEffect, useState } from 'react';
import EditNote from './EditNote';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function MenuComponent(props) {

    const { note, setNotes, menu, setMenu, addNoteDialog, setAddNoteDialog } = props;
    const [editOpen, setEditOpen] = useState(false)
    const userId = auth.currentUser?.uid;

    const handlePress = () => {
        setMenu(false);
    }

    useEffect(() => {
        loadFonts();
    })

    const editOpenFunc = () => {
        setEditOpen(true);
    }

    const deleteNote = async (noteId) => {
        Alert.alert('Confirm deletion',
            'Are you sure you want to delete this note?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        await deleteDoc(doc(db, 'notedata', noteId))
                            .then(() => {
                                Alert.alert('Note deleted')
                                fetchNotes(userId, setNotes);
                                setMenu(false);
                            })
                            .catch(error => {
                                Alert.alert(error)
                            })
                    }
                }
            ])
    }

    return (
        <View style={styles.overlay}>
            {!editOpen && (
                <View>
                    <Text style={styles.textEdit} onPress={() => editOpenFunc()}>Edit</Text>
                    <Text style={styles.textDelete} onPress={() => deleteNote(note.id)}>Delete</Text>
                </View>
            )}
            <Ionicons name='close-outline' size={30} style={styles.overlayText} onPress={handlePress}></Ionicons>
            {editOpen && (
                <EditNote
                    note={note}
                    setNotes={setNotes}
                    editOpen={editOpen}
                    setEditOpen={setEditOpen}
                    menu={menu}
                    setMenu={setMenu}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: '#191b1f',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        height: '20%',
        marginTop: 100,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'white'
    },
    overlayText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        top: 10,
        right: 10
    },
    textEdit: {
        fontSize: 20,
        color: '#50e0ff'
    },
    textDelete: {
        fontSize: 20,
        color: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    }
});