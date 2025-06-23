import { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { loginUser, getCurrentUser } from '../../services/appwrite';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [screenKey] = useState(() => `login-${Date.now()}`);

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (isMounted) {
            setUser(parsedUser);
            router.replace('/(tabs)');
            return;
          }
        }

        const currentUser = await getCurrentUser();
        if (currentUser) {
          const newUser = {
            id: currentUser.$id,
            name: currentUser.name || currentUser.email.split('@')[0],
            email: currentUser.email
          };
          await AsyncStorage.setItem('user', JSON.stringify(newUser));
          if (isMounted) {
            setUser(newUser);
            router.replace('/(tabs)');
          }
        }
      } catch (error) {
        console.log("Not logged in:", error);
      } finally {
        if (isMounted) {
          setCheckingUser(false);
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const session = await loginUser(email, password);
      const newUser = {
        id: `${session.userId}-${Date.now()}`,
        name: session.name || email.split('@')[0],
        email: email
      };
      setUser(newUser);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (checkingUser) {
    return (
      <View key={`${screenKey}-loading`} className="flex-1 bg-primary justify-center items-center">
        <ActivityIndicator size="large" color="#6b46c1" />
        <Text className="text-white mt-4">Checking login status...</Text>
      </View>
    );
  }

  if (user) {
    return (
      <View key={`${screenKey}-welcome`} className="flex-1 bg-primary justify-center items-center">
        <Text className="text-white text-xl">Welcome back, {user.name}!</Text>
        <Text className="text-gray-400 mt-2">Redirecting to app...</Text>
      </View>
    );
  }

  return (
    <View key={screenKey} className="flex-1 bg-primary p-6">
      <Text className="text-white text-2xl font-bold mb-8">Welcome Back</Text>

      <Text className="text-gray-300 mb-1">Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-gray-800 text-white p-4 rounded-lg mb-4 outline-none"
      />

      <Text className="text-gray-300 mb-1">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        className="bg-gray-800 text-white p-4 rounded-lg mb-6 outline-none"
      />

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className={`bg-accent py-3 rounded-lg items-center ${loading ? 'opacity-70' : ''}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold bg-purple-500 w-full rounded-full p-2 text-center text-lg">Login</Text>
        )}
      </Pressable>

      <Pressable onPress={() => router.push('/auth/signup')} className="mt-4 items-center">
        <Text className="text-gray-400">
          Don't have an account? <Text className="text-accent font-bold">Sign up</Text>
        </Text>
      </Pressable>
    </View>
  );
}
