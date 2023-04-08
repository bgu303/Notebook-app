import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import Login from './components/Login.js'
import Register from './components/Register.js'
import NotesList from './components/NotesList.js';
import CalendarComponent from './components/CalendarComponent.js';
import { Ionicons } from '@expo/vector-icons';
import { loadFonts } from './Fonts.js';
import firebaseConfig from './FirebaseConfig.js';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { StyleSheet } from 'react-native';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const Tab = createBottomTabNavigator();

export default function App() {

  const [checker, setChecker] = useState(false)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setChecker(true)
    } else {
      setChecker(false)
    }
  })

  useEffect(() => {
    loadFonts();
  }, []);

  const IoniconsTabBarIcon = ({ name, size, color }) => {
    return <Ionicons name={name} size={size} color={color} />;
  };
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: {
            backgroundColor: 'rgb(0, 0, 0)',
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Login') {
              iconName = 'log-in-outline'
            } else if (route.name === 'Register') {
              iconName = 'add-circle-outline';
            } else if (route.name === 'Notes') {
              iconName = 'book-outline';
            } else if (route.name === 'Calendar') {
              iconName = 'calendar-outline'
            }
            return (
              <IoniconsTabBarIcon
                name={iconName}
                size={size}
                color={focused ? 'green' : 'white'}
              />
            );
          },
        })}
      >
        <Tab.Screen
        options={{
          headerStyle: styles.headerStyle,
          headerTintColor: 'white'
        }}
        name="Login"
        component={Login} />
        {!checker && (
          <Tab.Screen
          options={{
            headerStyle: styles.headerStyle,
            headerTintColor: 'white'
          }}
          name="Register"
          component={Register} />
        )}
        <Tab.Screen
        options={{
          headerStyle: styles.headerStyle,
          headerTintColor: 'white'
        }}
        name="Notes"
        component={NotesList} />
        <Tab.Screen
        options={{
          headerStyle: styles.headerStyle,
          headerTintColor: 'white'
        }}
        name="Calendar"
        component={CalendarComponent} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff'
  }
})