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
    const [selectedDate, setSelectedDate] = useState("")
    const markedDates = {};

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
            const dateObj = { date: formattedDate, noteText: value.note.noteText }
            datesArray.push(dateObj)
        })
        setDates(datesArray)
    }, [notes])

    dates.forEach((date) => {
        markedDates[date.date] = { marked: true, note: date.noteText }
    })
    
    console.log(markedDates)

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString)
    }

    return (
        <View style={styles.container}>
            <Calendar
                markedDates={markedDates}
                onDayPress={handleDayPress}
            />
            <Text>{selectedDate}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      marginTop: '10%'
    },
  });