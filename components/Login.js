import { StyleSheet, View, Text, TextInput, Button, Alert, FlatList } from 'react-native';
import { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import firebaseConfig from '../FirebaseConfig';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login() {

    const [user, loading, error] = useAuthState(auth);
    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: ""
    })

    const logInWithEmailAndPassword = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoginDetails({
                email: "",
                password: ""
            })
            alert("Login Successful!")
        } catch (err) {
            alert("Invalid username or password.");
            return;
        }
    };

    const login = () => {
        logInWithEmailAndPassword(loginDetails.email, loginDetails.password)
    }

    const logout = () => {
        signOut(auth);
    }

    const register = () => {
        console.log("moi")
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login page</Text>
            <Text style={styles.text}>You are logged in as: {user?.email}</Text>
            <TextInput placeholder='email'
                placeholderTextColor='white'
                style={styles.textInput}
                onChangeText={value => setLoginDetails({ ...loginDetails, email: value })}
                value={loginDetails.email}
            ></TextInput>
            <TextInput placeholder='password'
                placeholderTextColor='white'
                style={styles.textInput}
                onChangeText={value => setLoginDetails({ ...loginDetails, password: value })}
                value={loginDetails.password}
                secureTextEntry={true}
            ></TextInput>
            {!auth.currentUser ? (
                <View>
                    <Button title="Login" onPress={login}></Button>
                    <Text style={styles.text} onPress={register}>No user yet? Register HERE</Text>
                </View>
            ) : (<Button title="Logout" onPress={logout}></Button>)}
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
    text: {
        color: 'white'
    },
    textInput: {
        width: 150,
        borderWidth: 1,
        borderColor: 'white',
        marginBottom: 10,
        color: 'white'
    }
});