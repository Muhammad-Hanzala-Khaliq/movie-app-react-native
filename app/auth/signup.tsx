import { useState } from 'react';
import { View, Text, TextInput, Alert, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { createUser } from '../../services/appwrite';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      await createUser(email, password, name);
      Alert.alert('Success', 'Account created successfully! Please login.');
      router.back();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary p-6">
      <Text className="text-white text-2xl font-bold mb-8">Create Account</Text>
      
      {/* Name Input */}
      <Text className="text-gray-300 mb-1">Full Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
        placeholderTextColor="#9CA3AF"
        className="bg-gray-800 text-white p-4 rounded-lg mb-4 outline-none"
      />
      
      {/* Email Input */}
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
      
      {/* Password Input */}
      <Text className="text-gray-300 mb-1">Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        className="bg-gray-800 text-white p-4 rounded-lg mb-6 outline-none"
      />
      
      {/* Sign Up Button */}
      <Pressable
        onPress={handleSignup}
        disabled={loading}
        className={`bg-accent  py-3 rounded-lg items-center ${loading ? 'opacity-70' : ''}`}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-bold bg-purple-500 w-full rounded-full p-2 text-center text-lg">Sign Up</Text>
        )}
      </Pressable>
      
      {/* Login Link */}
      <Pressable 
        onPress={() => router.back()}
        className="mt-4 items-center"
      >
        <Text className="text-gray-400">
          Already have an account? <Text className="text-accent font-bold">Login</Text>
        </Text>
      </Pressable>
    </View>
  );
}