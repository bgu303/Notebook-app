import { View, StyleSheet, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from '../FirebaseConfig';
import { Calendar, CalendarTheme } from 'react-native-calendars';
import fetchNotes from '../FetchNotes';
import moment from 'moment/moment';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function CalendarComponent() {

    const userId = auth.currentUser?.uid;
    const [notes, setNotes] = useState([])
    const [dates, setDates] = useState([])
    const [userCheck, setUserCheck] = useState(false)
    const [selectedDate, setSelectedDate] = useState({
        title: "",
        noteText: ""
    })
    const [markedDates, setMarkedDates] = useState({});

    useEffect(() => {
        if (userId) {
            fetchNotes(userId, setNotes);
        }
    }, [userId])

    useEffect(() => {
        const datesArray = []
        notes.forEach((value) => {
            const dateString = value.note.date
            const inputFormat = 'DD.MM.YYYY'
            const outputFormat = 'YYYY-MM-DD'
            const momentDate = moment(dateString, inputFormat)
            const formattedDate = momentDate.format(outputFormat)
            const dateObj = { date: formattedDate, noteText: value.note.noteText, title: value.note.title }
            datesArray.push(dateObj)
        })
        setDates(datesArray)
    }, [notes])

    dates.forEach((date) => {
        markedDates[date.date] = { marked: true, note: date.noteText, title: date.title }
    })

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserCheck(true)
        } else {
            setUserCheck(false)
        }
    })

    const handleDayPress = (day) => {
        const markedEntries = Object.entries(markedDates);
        for (let i = 0; i < markedEntries.length; i++) {
            const [key, value] = markedEntries[i];
            if (day.dateString === key) {
                setSelectedDate({ ...selectedDate, title: value.title, noteText: value.note })
                return;
            }
        }
        setSelectedDate({ ...selectedDate, title: "No Data", noteText: "No Data" })
    }

    return (
        <View>
            {userCheck ? (<View style={styles.container}>
                <Calendar
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                />
                <Text style={{ textAlign: 'center', fontSize: 20 }}>{selectedDate.title}</Text>
                <Text style={{ textAlign: 'center' }}>{selectedDate.noteText}</Text>
            </View>) : <View>
                <Text>Login to see Calendar!</Text>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: '5%'
    },
});