import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

const Saved = () => {
  return (
    <View className="bg-primary flex-1">
      <Text className="flex justify-center items-center flex flex-1 gap-5">
        <Image source={icons.save} className="size-10" tintColor="#fff" />
        <Text className="text-gray-500 text-base"></Text>
      </Text>
    </View>
  );
};

export default Saved;

const styles = StyleSheet.create({});
