// app/chat.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { getMovieSuggestion } from "@/services/gemini"; // custom logic
import { router } from "expo-router";
import { icons } from "@/constants/icons";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me for movie recommendations." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Add empty bot message first for streaming
    setMessages((prev) => [...prev, { from: "bot", text: "" }]);

    try {
      const reply = await getMovieSuggestion(input);

      let index = 0;
      const typingInterval = setInterval(() => {
        if (index <= reply.length) {
          const partial = reply.slice(0, index++);
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { from: "bot", text: partial };
            return updated;
          });
        } else {
          clearInterval(typingInterval);
        }
      }, 20); // adjust speed (ms per character)
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          from: "bot",
          text: "Sorry, I had trouble fetching a recommendation.",
        },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={
              msg.from === "user" ? styles.userContainer : styles.botContainer
            }
          >
            <Text
              style={msg.from === "user" ? styles.userText : styles.botText}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask for a movie..."
          placeholderTextColor="#666"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          className="absolute bottom-5 left-0 right-0 mx-5 bg-purple-500 rounded-lg py-3.5 flex flex-row items-center justify-center z-50 "
          onPress={router.back}
        >
          <Image
            source={icons.arrow}
            className="size-5 mr-1 mt-0.5 rotate-180"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">Go Back</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0a0a0f', // Dark navy like your app
  },
  chat: { 
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    paddingTop: 20,
    paddingBottom: 10,
  },
  userContainer: {
    alignSelf: 'flex-end',
    marginVertical: 8,
    maxWidth: '80%',
  },
  botContainer: {
    alignSelf: 'flex-start',
    marginVertical: 8,
    maxWidth: '80%',
  },
  userText: {
    color: '#ffffff',
    fontSize: 16,
    padding: 12,
    backgroundColor: '#6b46c1', // Purple like your app's accent
    borderRadius: 18,
    borderBottomRightRadius: 4,
    overflow: 'hidden',
  },
  botText: {
    color: '#e5e7eb',
    fontSize: 16,
    padding: 12,
    backgroundColor: '#1f2937', // Dark gray for bot messages
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    overflow: 'hidden',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111827', // Slightly lighter than main bg
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1f2937',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151',
    marginRight: 12,
    maxHeight: 50,
  },
  sendButton: {
    backgroundColor: '#6b46c1', // Purple accent
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});