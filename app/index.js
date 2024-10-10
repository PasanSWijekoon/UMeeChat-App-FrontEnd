// Import necessary components and libraries from React Native and Expo.
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import * as env from 'dotenv';
env.config();

// Import custom font loading hook from Expo and other utility libraries.
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";

// Import FontAwesome icons from Expo for UI elements.
import { FontAwesome6, FontAwesome } from "@expo/vector-icons";

// Import image component and related utilities.
import { Image } from "expo-image";

// Import splash screen and image picker libraries for loading and media functionalities.
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";

// Import AsyncStorage for persistent local storage.
import AsyncStorage from "@react-native-async-storage/async-storage";

// Import router from Expo for navigation between screens.
import { router } from "expo-router";

// Prevent the splash screen from automatically hiding until the app is fully ready.
SplashScreen.preventAutoHideAsync();

// Load the logo image used in the login screen.
const logoImagePath = require("../assets/image/logo.png");

// Main component of the screen.
export default function index() {
  // State to track whether custom fonts are loaded or if there's an error.
  const [loaded, error] = useFonts({
    "NotoSans-Italic-VariableFont_wdth,wght": require("../assets/fonts/NotoSans-Italic-VariableFont_wdth,wght.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  // States to handle input fields for mobile, password, and name.
  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getName, setName] = useState("");

  // State to manage submission status to prevent multiple submissions.
  const [isSubmitting, setIsSubmitting] = useState(false);


  //   useEffect(
  //     ()=>{
  //         async function checkdata() {
  //             let userJson = await AsyncStorage.getItem("user");

  //             try {

  //                 if (userJson != null) {
  //                     router.replace("/home");

  //                 }
  //             } catch (error) {

  //             }
  //         }
  //         checkdata();
  //     }
  //   );


  // useEffect hook to check if the fonts are loaded or there's an error, and then hide the splash screen.
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // If fonts are still loading or there's an error, render nothing.
  if (!loaded && !error) {
    return null;
  }

  // Function to handle user sign-in when the "Sign In" button is pressed.
  const handleSignIn = async () => {
    if (isSubmitting) return; // Prevent multiple requests while already submitting.

    setIsSubmitting(true); // Mark that submission is in progress.

    try {
      // Send a POST request to the sign-in API.
      let response = await fetch(
        process.env.BACKEND_API + "/SignIn",
        {
          method: "POST",
          body: JSON.stringify({
            mobile: getMobile,
            password: getPassword,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // If the response is successful, process the result.
      if (response.ok) {
        let json = await response.json();
        if(json.success){
          // If user login is successful, store the user data locally.
          let user = json.user;
          try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
            router.replace("/home"); // Redirect to home page.
          } catch (error) {
            Alert.alert("Error", "Unable to process your request.");
          }
        } else {
          // Display an error if login failed.
          Alert.alert("Error", json.message);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false); // End submission after the request completes.
    }
  };

  // Main UI of the login screen.
  return (
    <SafeAreaView style={stylesheet.view1}>
      <ScrollView style={stylesheet.scrollview1}>
        <View style={stylesheet.View3}>
          {/* Display the logo image */}
          <Image
            source={logoImagePath}
            style={stylesheet.image1}
            contentFit={"contain"}
          />

          {/* Display the login title and subtitle */}
          <Text style={stylesheet.text1}>Let's Log In</Text>
          <Text style={stylesheet.text2}>
            Hello! Welcome to UMee Chat. Please fill your details to Log In.
          </Text>

          {/* Display the user's name */}
          <View style={stylesheet.button3}>
            <Text style={stylesheet.text5}>{getName}</Text>
          </View>

          {/* Input field for the mobile number */}
          <Text style={stylesheet.text3}>Mobile</Text>
          <TextInput
            style={stylesheet.input1}
            placeholderTextColor={"black"}
            placeholder="Enter Mobile No"
            inputMode={"tel"}
            maxLength={10}
            onChangeText={(text) => {
              setMobile(text);
            }}
            onEndEditing={async () => {
              if (getMobile.length == 10) {
                let response = await fetch(
                  process.env.BACKEND_API + "/GetLetters?mobile=" +
                  getMobile
                );

                if (response.ok) {
                  let json = await response.json();
                  setName(json.letters); // Set name based on the mobile number response.
                }
              }
            }}
          />

          {/* Input field for the password */}
          <Text style={stylesheet.text3}>Password</Text>
          <TextInput
            style={stylesheet.input1}
            placeholderTextColor={"black"}
            placeholder="Enter Password"
            secureTextEntry={true}
            inputMode={"text"}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />

          {/* Button to trigger the sign-in process */}
          <Pressable
            style={[
              stylesheet.button1,
              isSubmitting && { backgroundColor: "#ccc" }, // Change button style when submitting.
            ]}
            onPress={handleSignIn}
            disabled={isSubmitting} // Disable button while submitting.
          >
            <FontAwesome6 name={"paper-plane"} color={"white"} size={20} />
            <Text style={stylesheet.buttonText1}>Sign In</Text>
          </Pressable>

          {/* Link to the sign-up page */}
          <Pressable
            style={stylesheet.button2}
            onPress={() => {
              router.replace("/signup");
            }}
          >
            <Text style={stylesheet.buttonText2}>
              New User ? Go to Sign Up
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Stylesheet for the UI components.
const stylesheet = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f5f7fa",
    gap: 10,
  },
  View3: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  image1: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginTop: 10,
  },
  selectimage: {
    marginTop: 5,
    fontSize: 15,
    color: "#0e66fe",
    fontWeight: "500",
    alignSelf: "center",
  },
  text1: {
    fontSize: 28,
    color: "#0e66fe",
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginVertical: 15,
  },
  text2: {
    fontSize: 14,
    fontFamily: "Poppins-Light",
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  text3: {
    fontSize: 16,
    fontFamily: "Poppins-Light",
    color: "#666",
    marginTop: 8,
    marginBottom: 4,
  },
  input1: {
    width: "100%",
    height: 45,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderColor: "#ccc",
    color: "#333",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  button1: {
    backgroundColor: "#0e66fe",
    height: 45,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    flexDirection: "row",
    paddingHorizontal: 16,
    elevation: 4,
    gap: 10,
  },
  buttonText1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  button2: {
    borderColor: "#0e66fe",
    borderWidth: 2,
    height: 45,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 30,
    paddingHorizontal: 16,
  },
  buttonText2: {
    fontSize: 15,
    color: "#0e66fe",
    fontWeight: "500",
  },
  button3: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 15,
    backgroundColor: "#f0f0f0",
    borderWidth: 1.5,
    borderColor: "#ccc",
  },
  text5: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#0e66fe",
  },
});
