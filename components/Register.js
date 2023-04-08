import { StyleSheet, View, Text, TextInput, Button, Alert, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, addDoc, collection } from 'firebase/firestore';
import firebaseConfig from '../FirebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function Register() {
  const [userCheck, setUserCheck] = useState(null)
  const [registerDetails, setRegisterDetails] = useState({
    email: '',
    password: '',
    passwordAgain: ''
  })

  const registerWithEmailAndPassword = async (userName, email, password) => {
    if (registerDetails.password !== registerDetails.passwordAgain) {
      alert(`Passwords don't match.`)
      return;
    }
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        authProvider: 'local',
        email,
      },
        setRegisterDetails({
          email: '',
          password: '',
          passwordAgain: ''
        })
      );
      alert('Register successful!')
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email already in use.')
        return;
      } else if (error.code === 'auth/weak-password') {
        alert('Password should be atleast 6 characters long')
        return;
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email.')
        return;
      }
      alert(error.message);
    }
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserCheck(true)
    } else {
      setUserCheck(false)
    }
  })

  const register = () => {
    registerWithEmailAndPassword(registerDetails.userName, registerDetails.email, registerDetails.password)
  }

  return (
    <View style={styles.container}>
      {!userCheck ? (
        <View>
          <Text>Register page</Text>
          <TextInput placeholder='email'
            onChangeText={value => setRegisterDetails({ ...registerDetails, email: value })}
            style={styles.textInput}
            value={registerDetails.email}
            placeholderTextColor='white'></TextInput>
          <TextInput placeholder='password'
            onChangeText={value => setRegisterDetails({ ...registerDetails, password: value })}
            style={styles.textInput}
            value={registerDetails.password}
            placeholderTextColor='white'
            secureTextEntry={true}
          ></TextInput>
          <TextInput placeholder='password again'
            onChangeText={value => setRegisterDetails({ ...registerDetails, passwordAgain: value })}
            style={styles.textInput}
            value={registerDetails.passwordAgain}
            placeholderTextColor='white'
            secureTextEntry={true}
          ></TextInput>
          <Button title='Register' onPress={register}></Button>
        </View>
      ) : (
        <Text style={{ color: 'white' }}>Already logged in!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: 150,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 10,
    color: 'white',
    borderRadius: 5,
    textAlign: 'center'
  }
});