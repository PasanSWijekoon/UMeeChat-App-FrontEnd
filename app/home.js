import { useFonts } from "expo-font";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { FontAwesome,FontAwesome6 } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

const logoImagePath = require("../assets/image/logo.png");

export default function Home() {
  const [getChatArray, setChatArray] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const userJson = await AsyncStorage.getItem("user");
        const user = JSON.parse(userJson);
        setCurrentUser(user);
        const response = await fetch(
          `http://192.168.1.4:8080/Umee_Chat_App/LoadHomeData?id=${user.id}`
        );

        if (response.ok) {
          const json = await response.json();
          if (json.message) {
            setChatArray(json.jsonChatArray);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  const filteredChats = getChatArray.filter((chat) =>
    chat.other_user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push({ pathname: "/chat", params: item })}
    >
      <View
        style={[
          styles.avatarContainer,
          item.other_user_status === 2
            ? styles.offlineStatus
            : styles.onlineStatus,
        ]}
      >
        {item.avatar_image_found ? (
          <Image
            source={`http://192.168.1.4:8080/Umee_Chat_App/AvatarImages/${item.other_user_mobile}.jpg`}
            contentFit="cover"
            style={styles.avatar}
          />
        ) : (
          <Text style={styles.avatarLetters}>
            {item.other_user_avatar_letters}
          </Text>
        )}
      </View>
      <View style={styles.chatInfo}>
        <View style={styles.topLine}>
          <Text style={styles.userName}>{item.other_user_name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.userInfo}>
            <View style={styles.userAvatarContainer}>
              {currentUser?.avatar_found ? (
                <Image
                  source={`http://192.168.1.4:8080/Umee_Chat_App/AvatarImages/0775512786.jpg`}
                  contentFit="cover"
                  style={styles.userAvatar}
                />
              ) : (
                <FontAwesome name="user" size={24} color="#64748B" />
              )}
            </View>
            <View style={styles.userTextInfo}>
              <Text style={styles.currentUserName}>
                {currentUser?.first_name || "User"}
              </Text>
              <Text style={styles.userStatus}>Online</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.aiButton}
            onPress={() => {
              /* Handle AI chat */
            }}
          >
            <FontAwesome6 name="robot" size={20} color="white" />
            <Text style={styles.aiButtonText}>Chat with AI</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <FontAwesome
            name="search"
            size={16}
            color="#64748B"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations"
            placeholderTextColor="#64748B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <View style={styles.conversationsHeader}>
        <Text style={styles.conversationsTitle}>Conversations</Text>
        
      </View>
      <FlashList
        data={filteredChats}
        renderItem={({ item }) => <ChatItem item={item} />}
        estimatedItemSize={88}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E9F0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userTextInfo: {
    justifyContent: "center",
  },
  currentUserName: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#1A1D1E",
  },
  userStatus: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
    color: "#22C55E",
  },
  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22C55E",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#22C55E",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  aiButtonText: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    marginLeft: 6,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: "Poppins-Light",
    fontSize: 16,
    color: "#1A1D1E",
  },
  conversationsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  conversationsTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#1A1D1E",
  },
  listContent: {
    padding: 16,
  },
  chatItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  onlineStatus: {
    borderColor: "#22C55E",
  },
  offlineStatus: {
    borderColor: "#DC2626",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  avatarLetters: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#64748B",
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
  },
  topLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#1A1D1E",
  },
  time: {
    fontSize: 12,
    fontFamily: "Poppins-Light",
    color: "#64748B",
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: "Poppins-Light",
    color: "#64748B",
  },
});
