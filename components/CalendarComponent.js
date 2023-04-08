import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import firebaseConfig from '../FirebaseConfig';
import { Calendar, CalendarTheme } from 'react-native-calendars';
import fetchNotes from '../FetchNotes';
import moment from 'moment/moment';
import { useFocusEffect } from '@react-navigation/native';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function CalendarComponent() {

    const userId = auth.currentUser?.uid;
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(false)
    const [currDate, setCurrDate] = useState('')
    const [userCheck, setUserCheck] = useState(false)
    const [selectedDate, setSelectedDate] = useState({
        title: '',
        noteText: ''
    })
    const [markedDates, setMarkedDates] = useState({});

    useFocusEffect(
        useCallback(() => {
            setLoading(false)
            setSelectedDate({
                title: '',
                noteText: ''
            })
            setCurrDate('')
            if (userId) {
                setMarkedDates({})
                fetchNotes(userId, setNotes);
            }
        }, [userId])
    )

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
        const markedDatesObj = {};
        datesArray.forEach((date) => {
            markedDatesObj[date.date] = { marked: true, note: date.noteText, title: date.title }
            console.log(markedDatesObj)
        })
        setLoading(true)
        setMarkedDates(markedDatesObj)
    }, [notes])

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUserCheck(true)
        } else {
            setUserCheck(false)
        }
    })

    const handleDayPress = (day) => {
        let dayFound = false
        const formattedDateStr = moment(day.dateString, 'YYYY-MM-DD').format('DD.MM.YYYY')
        setCurrDate(formattedDateStr)
        const markedEntries = Object.entries(markedDates);
        for (let i = 0; i < markedEntries.length; i++) {
            const [key, value] = markedEntries[i];
            if (day.dateString === key) {
                setSelectedDate({ ...selectedDate, title: value.title, noteText: value.note })
                dayFound = true
            }
        }
        if (!dayFound) {
            setSelectedDate({ ...selectedDate, title: 'No Data', noteText: 'No Data' })
        }
    }

    return (
        <View style={{ backgroundColor: 'black', paddingBottom: 200 }}>
            {userCheck ? (<View style={styles.container}>
                <Calendar
                    markedDates={markedDates}
                    onDayPress={handleDayPress}
                    style={styles.calendarStyle}
                    theme={{
                        backgroundColor: '#000000',
                        calendarBackground: '#000000',
                        textSectionTitleColor: '#ffffff',
                        textSectionTitleDisabledColor: '#d9e1e8',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: '#ffffff',
                        textDisabledColor: '#76787a',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        arrowColor: 'orange',
                        disabledArrowColor: '#d9e1e8',
                        monthTextColor: '#ffffff',
                        indicatorColor: 'blue',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                    }}
                />
                {!loading && (
                    <View>
                        <Text style={styles.textTitle}>Loading...</Text>
                    </View>
                )}
                <Text style={styles.textTitle}>{currDate}</Text>
                <Text style={styles.textTitle}>{selectedDate.title}</Text>
                <ScrollView style={styles.scrollViewStyle}>
                    <Text style={styles.text}>{selectedDate.noteText}</Text>
                </ScrollView>
            </View>) : <View style={styles.secondaryView}>
                <Text style={styles.text}>Login to see Calendar!</Text>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: '5%',
        backgroundColor: '#000000',

    },
    textTitle: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20
    },
    text: {
        textAlign: 'center',
        color: 'white',
        marginLeft: 10,
        marginRight: 10
    },
    scrollViewStyle: {
        backgroundColor: '#000000',
        height: 150
    },
    calendarStyle: {
        borderWidth: 1,
        borderColor: '#ffffff',
        borderRadius: 5
    },
    secondaryView: {
        height: '100%',
        alignItems: 'center',
        top: '50%'
    }
});