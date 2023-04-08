import { StyleSheet, View, Text, TextInput, Button, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { loadFonts } from '../Fonts';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech'

const screenHeight = Dimensions.get('window').height;
const textOverlayHeight = screenHeight * 0.8;

export default function NotesPopup(props) {

    const { note, isVisible, setIsVisible } = props;

    const handlePress = () => {
        setIsVisible(false);
        Speech.stop()
    }

    useEffect(() => {
        loadFonts();
    })

    const speak = () => {
        const thingToSay = note?.noteText
        Speech.speak(thingToSay)
    }

    const stopSpeak = () => {
        Speech.stop()
    }

    return (
        <View style={styles.overlay}>
            <Ionicons name='close-outline' style={styles.overlayText} onPress={handlePress}></Ionicons>
            <Text style={styles.noteText}>{note?.noteText}</Text>
            <Text onPress={speak} style={styles.readNote}>Read Note</Text>
            <Text onPress={stopSpeak} style={styles.stopNote}>Stop Reading</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        borderWidth: 1,
        borderColor: '#ffffff',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        width: 350,
        height: textOverlayHeight,
        borderRadius: 10
    },
    overlayText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        position: 'absolute',
        top: 10,
        right: 10
    },
    noteText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        marginLeft: 20,
        marginRight: 20
    },
    readNote: {
        color: 'green',
        position: 'absolute',
        bottom: '5%',
        right: '35%',
    },
    stopNote: {
        color: 'red',
        position: 'absolute',
        bottom: '5%',
        right: '5%'
    }
});