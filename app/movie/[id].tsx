import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";
import { saveMovieForUser, isMovieSaved } from "../../services/useFetch";
import { account } from "@/services/appwrite";
// import { Icon } from "react-native-elements";
import { icons } from "@/constants/icons";
import Icon from "react-native-vector-icons/MaterialIcons";

const MovieInfo = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie } = useFetch(() => fetchMovieDetails(id as string));

  const [userId, setUserId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // ✅ Fetch user ID & check if movie is saved
  useEffect(() => {
    const fetchUserAndCheckSaved = async () => {
      try {
        const user = await account.get(); // ✅ Appwrite authenticated user
        setUserId(user.$id);

        if (movie) {
          const alreadySaved = await isMovieSaved(user.$id, movie.id);
          setSaved(alreadySaved);
        }
      } catch (error) {
        console.error("Appwrite User Fetch Error:", error);
      }
    };

    fetchUserAndCheckSaved();
  }, [movie]);

  // ✅ Save movie
  // Add proper error handling and feedback
  const handleSave = async () => {
    if (!userId) {
      Alert.alert("Login Required", "Please login to save movies");
      router.push("/auth/login");
      return;
    }

    if (!movie) {
      Alert.alert("Error", "Movie data not available");
      return;
    }

    console.log("Saving movie:", {
      userId,
      movieId: movie.id,
      title: movie.title,
    });

    try {
      const success = await saveMovieForUser(userId, movie);

      if (success) {
        Alert.alert("Saved", `${movie.title} added to your collection`);
        setSaved(true);
      } else {
        Alert.alert("Error", "Failed to save - check console for details");
      }
    } catch (error) {
      Alert.alert("Technical Error", "Please try again later");
      console.error("Save operation crashed:", error);
    }
  };
  return (
    <View className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
          }}
          className="w-full h-[350px]"
          resizeMode="stretch"
        />

        <View className="flex-col items-start justify-center mt-5 px-5">
          {/* Movie title + Save icon */}
          <View className="flex-row justify-between w-full items-center">
            <Text className="text-white font-bold text-xl flex-1">
              {movie?.title}
            </Text>
            <TouchableOpacity onPress={handleSave} disabled={!userId}>
              <Icon
                name={saved ? "bookmark" : "bookmark-border"}
                type="material"
                color="white"
                size={26}
              />
            </TouchableOpacity>
          </View>

          {/* Release Year + Runtime */}
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          {/* Rating */}
          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          {/* Other Info */}
          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}
          />
          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${movie?.budget / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(movie?.revenue) / 1_000_000}`}
            />
          </View>
          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies.map((c) => c.name).join(" - ") ||
              "N/A"
            }
          />
        </View>
      </ScrollView>

      {/* Go Back Button */}
      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-purple-500 rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MovieDetails;

const styles = StyleSheet.create({});
