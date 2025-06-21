//track the search made by user
import {Client, Databases, ID, Query} from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
.setEndpoint('https://fra.cloud.appwrite.io/v1')
.setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    console.log("Searching for:", query);
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    console.log("Matching docs:", result.documents.length);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      console.log("Updating document:", existingMovie.$id);
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, existingMovie.$id, {
        count: existingMovie.count + 1,
      });
    } else {
      console.log("Creating new document...");
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log("❌ Appwrite error:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
 try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  
 } catch (error) {
  console.log(error);
  return undefined;
 }
}
