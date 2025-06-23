import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Link } from "expo-router";

const SavedMovieCard = ({ movie }) => {
  if (!movie?.poster_path) return null; // Skip rendering if no poster

  return (
    <Link href={`/movie/${movie.id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.7}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
          style={styles.poster}
        />
        <Text numberOfLines={1} style={styles.title}>
          {movie.title}
        </Text>
        <Text style={styles.year}>
          {movie.release_date?.split('-')[0] || 'Year N/A'}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '30%',
    marginBottom: 16,
  },
  poster: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#1a1a1a' // Fallback background
  },
  title: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center'
  },
  year: {
    color: '#aaa',
    fontSize: 10,
    textAlign: 'center'
  }
});

export default SavedMovieCard;