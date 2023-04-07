import { StyleSheet, View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import NotesPopup from './NotesPopup';
import AddNote from './AddNote';
import { Ionicons } from '@expo/vector-icons';
import MenuComponent from './MenuComponent';
import firebaseConfig from '../FirebaseConfig';
import fetchNotes from '../FetchNotes';
import { loadFonts } from '../Fonts.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function NotesList() {
    const [user, loading, error] = useAuthState(auth);
    const [currNote, setCurrNote] = useState()
    const [notes, setNotes] = useState([])
    const userId = auth.currentUser?.uid;
    const [isVisible, setIsVisible] = useState(false);
    const [addNoteDialog, setAddNoteDialog] = useState(false)
    const [menu, setMenu] = useState(false)
    const [searchState, setSearchState] = useState(false)

    //if user is logged in, fetch notes.
    useEffect(() => {
        if (userId) {
            fetchNotes(userId, setNotes);
        }
    }, [userId])

    //Loading fonts with useEffect because React native doesn't allow fonts by default so  this is needed for icons.
    useEffect(() => {
        loadFonts();
    }, []);

    //Sets state when clicking "Add Note" button. True ---> Dialog opens.
    const addNoteButton = () => {
        setAddNoteDialog(true);
    }

    const handlePress = (item) => {
        setIsVisible(true)
        setCurrNote(item.note)
    }

    const handleMenu = (item) => {
        setMenu(true)
        setCurrNote(item)
    }

    const handleSearch = (value) => {
        if (value) {
            const newData = notes.filter((item) => {
                const itemDate = item.note.date
                    ? item.note.date.toUpperCase()
                    : ''.toUpperCase();
                const itemTitle = item.note.title
                    ? item.note.title.toUpperCase()
                    : ''.toUpperCase();
                const textData = value.toUpperCase();
                return (
                    itemDate.indexOf(textData) > -1 ||
                    itemTitle.indexOf(textData) > -1
                );
            })
            setNotes(newData)
        } else {
            fetchNotes(userId, setNotes);
        }
    }

    const handleSearchState = () => {
        setSearchState(true);
    }

    const handleSearchStateOut = () => {
        setSearchState(false);
    }

    return (
        <View style={styles.container}>
            {userId ? (
                <View style={styles.container}>
                    {!addNoteDialog && !menu && !searchState && !isVisible && (
                        <Text style={styles.userText}>Logged in as: {user?.email}</Text>
                    )}
                    {!addNoteDialog && !menu && !searchState && !isVisible && (
                        <View style={{ position: 'absolute', left: 10, top: 10 }}>
                            <Button style={styles.addButton} title="Add Note" onPress={addNoteButton}></Button>
                        </View>
                    )}
                    {addNoteDialog && (
                        <AddNote
                            setNotes={setNotes}
                            addNoteDialog={addNoteDialog}
                            setAddNoteDialog={setAddNoteDialog}
                        />
                    )}
                    {menu && (
                        <MenuComponent
                            menu={menu}
                            setMenu={setMenu}
                            addNoteDialog={addNoteDialog}
                            setAddNoteDialog={setAddNoteDialog}
                            note={currNote}
                            setNotes={setNotes}
                        />
                    )}
                    {!isVisible && !menu &&  (
                        <TextInput placeholderTextColor='white' placeholder='Search by date or title' onBlur={handleSearchStateOut} onFocus={handleSearchState} onChangeText={value => handleSearch(value)} style={styles.textInput}></TextInput>
                    )}
                    {!addNoteDialog && !menu && !isVisible && (
                        <View style={styles.flatListView}>
                            <FlatList
                                renderItem={({ item }) =>
                                    <TouchableOpacity style={styles.flatListItem} onPress={() => handlePress(item)}>
                                        <Text style={styles.textTitle}>Date: {item.note?.date}</Text>
                                        <Text style={styles.textTitle}>Title: {item.note?.title}</Text>
                                        <Text style={styles.textTitle}>Note:</Text>
                                        <Text style={styles.text}>{item.note?.noteText}</Text>
                                        <Ionicons size={25} name="menu-outline" title="delete" style={styles.deleteButton} onPress={() => handleMenu(item)}></Ionicons>
                                    </TouchableOpacity>
                                }
                                ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
                                data={notes}
                            />
                        </View>
                    )}
                </View>
            ) : (
                <View>
                    <Text style={styles.text}>Login to see your notes!</Text>
                </View>
            )}
            {isVisible && (
                <NotesPopup
                    note={currNote}
                    isVisible={isVisible}
                    setIsVisible={setIsVisible}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        width: '100%'
    },
    flatListView: {
        top: '15%',
    },
    flatListItem: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#323436',
        width: 300,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButton: {
        color: 'red',
        position: 'absolute',
        top: 5,
        right: 10
    },
    text: {
        color: 'white',
        marginLeft: 10,
        marginRight: 10
    },
    textTitle: {
        color: 'white',
        fontSize: 20
    },
    userText: {
        color: 'white',
        position: 'absolute',
        top: 10,
        right: 10
    },
    textInput: {
        width: 200,
        borderWidth: 1,
        borderColor: 'white',
        color: 'white',
        marginBottom: 10,
        top: '13%',
        zIndex: 1,
        borderRadius: 5,
        paddingLeft: 5
    },
});