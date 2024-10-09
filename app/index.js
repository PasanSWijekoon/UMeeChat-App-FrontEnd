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
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome6, FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

const logoImagePath = require("../assets/image/logo.png");

export default function index() {
  const [loaded, error] = useFonts({
    "NotoSans-Italic-VariableFont_wdth,wght": require("../assets/fonts/NotoSans-Italic-VariableFont_wdth,wght.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getName, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  

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

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  const handleSignIn = async () => {
    if (isSubmitting) return; // Prevent multiple requests

    setIsSubmitting(true); // Start submission

    try {
      let response = await fetch(
        "http://192.168.1.5:8080/Umee_Chat_App/SignIn",
        {
          method: "POST",
          body: JSON.stringify({
              mobile:getMobile,
              password:getPassword,
          }),

          headers:{
            "Content-Type" : "application/json"
          }
        }
      );

      if (response.ok) {
        let json = await response.json();
        if(json.success){
          //user registration complete 
          let user = json.user;
          try {
            await AsyncStorage.setItem("user", JSON.stringify(user));

            router.replace("/home");
          } catch (error) {
            Alert.alert("Error", "Unable to proccess your message");
          }
            
        }else{
          
        Alert.alert("Error", json.message);
        }
      } 
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false); // End submission
    }
  };

  return (
    <SafeAreaView style={stylesheet.view1}>
      <ScrollView style={stylesheet.scrollview1}>
        <View style={stylesheet.View3}>
          <Image
            source={logoImagePath}
            style={stylesheet.image1}
            contentFit={"contain"}
          />

          <Text style={stylesheet.text1}>Let's Log In</Text>
          <Text style={stylesheet.text2}>
            Hello! Welcome to UMee Chat. Please fill your details to Log In.
          </Text>

          <View style={stylesheet.button3}>
            <Text style={stylesheet.text5}>{getName}</Text>
          </View>
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
                  "http://192.168.1.5:8080/Umee_Chat_App/GetLetters?mobile=" +
                    getMobile
                );

                if (response.ok) {
                  let json = await response.json();
                  setName(json.letters);
                }
              }
            }}
          />

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

          <Pressable
              style={[
                stylesheet.button1,
                isSubmitting && { backgroundColor: "#ccc" }, // Disable button styling
              ]}
              onPress={handleSignIn}
              disabled={isSubmitting} // Disable button when submitting
            >
              <FontAwesome6 name={"paper-plane"} color={"white"} size={20} />
              <Text style={stylesheet.buttonText1}>Sign In</Text>
            </Pressable>

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
