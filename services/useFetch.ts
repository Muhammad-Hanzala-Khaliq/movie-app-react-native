import { useEffect, useState } from "react";
import { Client, Databases, Query } from "react-native-appwrite";

// Appwrite Config
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const APPWRITE_ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

// Client and DB init
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID);

const databases = new Databases(client);

// --- 🔹 Appwrite Movie Functions ---

export const saveMovieForUser = async (userId: string, movie: any) => {
  try {
    const allowedMovieData = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      overview: movie.overview,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
      runtime: movie.runtime,
      genres: movie.genres,
      budget: movie.budget,
      revenue: movie.revenue,
      production_companies: movie.production_companies,
    };

    await databases.createDocument(
      DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES!,
      "unique()",
      {
        userId,
        movieId: movie.id.toString(),
        movieData: JSON.stringify(allowedMovieData),
      }
    );
  } catch (error: any) {
    console.error("❌ Error saving movie:", error);
    console.log("❌ Full error details:", error);
  }
};

export const isMovieSaved = async (
  userId: string,
  movieId: number | string
) => {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES!,
      [
        Query.equal("userId", userId),
        Query.equal("movieId", movieId.toString()),
      ]
    );
    return res.total > 0;
  } catch (error: any) {
    console.error("❌ Error checking saved movie:", error.message || error);
    return false;
  }
};
export const getSavedMoviesForUser = async (userId: string) => {
  try {
    // ✅ Clean the userId to remove any suffix after "-"
    const cleanUserId = userId.split("-")[0];

    console.log("🔍 Fetching movies for user:", cleanUserId);

    const res = await databases.listDocuments(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!, // ✅ Ensure it's defined in .env
      process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES!, // ✅ Ensure it's defined in .env
      [Query.equal("userId", cleanUserId), Query.orderDesc("$createdAt")]
    );

    // ✅ Return parsed movieData
    return res.documents.map((doc) => JSON.parse(doc.movieData));
  } catch (error) {
    return [];
  }
};

// --- 🔹 useFetch Hook (Default Export) ---

function useFetch<T>(fetchFunction: () => Promise<T>, autoFetch = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchFunction();
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []);

  return { data, loading, error, refetch: fetchData };
}

export default useFetch;
