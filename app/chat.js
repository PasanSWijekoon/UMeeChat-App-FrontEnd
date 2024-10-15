import React, { useEffect, useState, useRef } from 'react';  
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { SplashScreen, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { FontAwesome } from '@expo/vector-icons';

SplashScreen.preventAutoHideAsync();

export default function Chat() {
  const item = useLocalSearchParams();
  const [chatArray, setChatArray] = useState([]);
  const [chatText, setChatText] = useState('');
  const flashListRef = useRef(null);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loaded, error] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const fetchChatArray = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        const user = JSON.parse(userJson);
        const response = await fetch(
          process.env.EXPO_PUBLIC_API_URL+`/LoadChat?logged_user_id=${user.id}&other_user_id=${item.other_user_id}`
        );
        if (response.ok) {
          const chatArray = await response.json();
          setChatArray(chatArray);
        }
      } catch (error) {
        console.error('Error fetching chat:', error);
      }
    };

    fetchChatArray();
    const interval = setInterval(fetchChatArray, 5000);
    return () => clearInterval(interval);
  }, [item.other_user_id]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const sendMessage = async () => {
    if (!chatText.trim()) return;

    try {
      const userJson = await AsyncStorage.getItem('user');
      const user = JSON.parse(userJson);
      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL+`/SendChat?logged_user_id=${user.id}&other_user_id=${item.other_user_id}&message=${encodeURIComponent(chatText)}`
      );

      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          setChatText('');
          setTimeout(() => {
            if (flashListRef.current) {
              flashListRef.current.scrollToEnd({ animated: true });
            }
          }, 100); // Allow for measurement to complete
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (chatArray.length > 0 && flashListRef.current && isLayoutReady) {
      flashListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatArray, isLayoutReady]);

  const handleLayout = () => {
    setIsLayoutReady(true);
  };

  if (!loaded && !error) {
    return null;
  }

  const renderChatItem = ({ item }) => (
    <View style={[styles.messageContainer, item.side === 'right' ? styles.rightMessage : styles.leftMessage]}>
      <Text style={styles.messageText}>{item.message}</Text>
      <View style={styles.messageFooter}>
        <Text style={styles.messageTime}>{item.datetime}</Text>
        {item.side === 'right' && (
          <FontAwesome
            name="check"
            color={item.status == "1" ? "#00BFFF" : "red"}
            size={12}
          />
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })} // Adjust this offset based on your header height
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {item.avatar_image_found === 'true' ? (
            <Image
              style={styles.avatar}
              source={process.env.EXPO_PUBLIC_API_URL+`/AvatarImages/${item.other_user_mobile}.jpg`}
              contentFit="cover"
            />
          ) : (
            <Text style={styles.avatarText}>{item.other_user_avatar_letters}</Text>
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{item.other_user_name}</Text>
          <Text style={[styles.userStatus, item.other_user_status === '1' ? styles.online : styles.offline]}>
            {item.other_user_status === '1' ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <FlashList
        ref={flashListRef}
        data={chatArray}
        renderItem={renderChatItem}
        estimatedItemSize={70}
        contentContainerStyle={styles.chatList}
        onLayout={handleLayout} // Add onLayout to set layout ready
      />

      <View style={[styles.inputContainer]}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={chatText}
          onChangeText={setChatText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <FontAwesome name="paper-plane" color="white" size={20} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  userStatus: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  online: {
    color: '#4CAF50',
  },
  offline: {
    color: '#9E9E9E',
  },
  chatList: {
    paddingVertical: 16,
    paddingBottom: 80, // Add padding for input container
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  leftMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  rightMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    marginRight: 4,
    fontFamily: 'Poppins-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  sendButton: {
    backgroundColor: '#0084FF',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
