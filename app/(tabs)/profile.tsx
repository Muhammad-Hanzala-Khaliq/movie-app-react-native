import {
  Button,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser(); // use service method
      await AsyncStorage.removeItem("user");
      setUser(null);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLoginRedirect = () => {
    router.push("/auth/login");
  };

  return (
    <View className="bg-primary flex-1 justify-center items-center p-5">
      {user ? (
        <View className="items-center gap-4">
          <Image
            source={icons.person}
            className="w-20 h-20"
            tintColor="#6b46c1"
          />
          <Text className="text-white text-xl font-bold">
            Welcome, {user.name || "User"}
          </Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-violet-800 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="items-center gap-4">
          <Image source={icons.person} className="w-20 h-20" tintColor="gray" />
          <Text className="text-gray-400 text-lg">Please login</Text>
          <TouchableOpacity
            onPress={handleLoginRedirect}
            className="bg-violet-800 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-medium">Login Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
