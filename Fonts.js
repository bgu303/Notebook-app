import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });
};