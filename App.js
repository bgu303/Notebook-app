import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import Login from './components/Login.js'
import Register from './components/Register.js'
import NotesList from './components/NotesList.js';
import { Ionicons } from '@expo/vector-icons';
import { loadFonts } from './Fonts.js';
import firebaseConfig from './FirebaseConfig.js';
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const Tab = createBottomTabNavigator();

export default function App() {

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
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="Register" component={Register} />
        <Tab.Screen name="Notes" component={NotesList} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

