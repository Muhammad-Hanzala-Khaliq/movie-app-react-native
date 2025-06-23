import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text } from "react-native";
import { getSavedMoviesForUser } from "../../services/useFetch";
import SavedMovieCard from "../../components/SavedMovieCard";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router"; // 👈 Add this import at top
import { useCallback } from "react";

const SavedScreen = () => {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [savedMovies, setSavedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!user?.id) {
        console.log("No user ID - redirecting to login");
        router.replace("/auth/login");
        return;
      }

      const movies = await getSavedMoviesForUser(user.id); // ✅ Use `user.id` here
      setSavedMovies(movies);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch saved movies.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!authLoading) {
        fetchSavedMovies(); // 👈 Will refetch every time screen comes into focus
      }
    }, [authLoading])
  );

  if (authLoading || loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#6b46c1" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary p-4">
      <Text className=" text-lg font-bold mb-4 text-purple-500">
        {user.name} <Text className="text-white">Saved Movies</Text>
      </Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={savedMovies}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <SavedMovieCard movie={item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 16,
        }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-white text-lg">No saved movies found</Text>
          </View>
        }
      />
    </View>
  );
};

export default SavedScreen;
