import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

const logoImagePath = require("../assets/image/logo.png");

export default function signup() {
  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  const defaultImagePath = require("../assets/image/user.png"); // Default image path
  const [getImage, setImage] = useState(defaultImagePath); // Initialize with default image

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getFirstNameWarning, setFirstNameWarning] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getLastNameWarning, setLastNameWarning] = useState("");
  const [getPassword, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const handleSignUp = async () => {
    if (isSubmitting) return; // Prevent multiple requests

    if(getFirstName == '') {
      setFirstNameWarning('Required field.');
      return;
    }

    if(getLastName == '') {
      setLastNameWarning('Required field.');
      return;
    }

    setIsSubmitting(true); // Start submission

    let f = new FormData();

    f.append("mobile", getMobile);
    f.append("firstName", getFirstName);
    f.append("lastName", getLastName);
    f.append("password", getPassword);

    if (getImage !== defaultImagePath) {
      f.append("profileImage", {
        name: "profile.jpg",
        type: "image/jpg",
        uri: getImage,
      });
    }

    try {
      let response = await fetch(
        "http://192.168.1.5:8080/Umee_Chat_App/SignUp",
        {
          method: "POST",
          body: f,
        }
      );

      if (response.ok) {
        let json = await response.json();
        if (json.Success) {
          Alert.alert("Success", json.message);
          router.replace("/");
        } else {
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

          <Text style={stylesheet.text1}>Create Account</Text>
          <Text style={stylesheet.text2}>
            Hello! Welcome to UMee Chat. Please fill your details to Create New
            Account.
          </Text>

          <Pressable
            style={stylesheet.button3}
            onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 4],
                quality: 1,
              });

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}
          >
            <Image
              source={getImage}
              style={stylesheet.button3}
              contentFit={"contain"}
            />
          </Pressable>
          <Text style={stylesheet.selectimage}>Select Image</Text>

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
          />

          <View>
          <Text style={stylesheet.text3}>First Name</Text>
          <TextInput
            style={stylesheet.input1}
            placeholderTextColor={"black"}
            placeholder="Enter First Name"
            inputMode={"text"}
            onChangeText={(text) => {
              setFirstName(text);
            }}
          />
          {getFirstNameWarning ? (
              <Text style={{ color: 'red', marginTop: 1 }}>{getFirstNameWarning}</Text>
            ) : null}
          </View>

          <View>
          <Text style={stylesheet.text3}>Last Name</Text>
          <TextInput
            style={stylesheet.input1}
            placeholderTextColor={"black"}
            placeholder="Enter Last Name"
            inputMode={"text"}
            onChangeText={(text) => {
              setLastName(text);
            }}
          />
          {getLastNameWarning ? (
              <Text style={{ color: 'red', marginTop: 1 }}>{getLastNameWarning}</Text>
            ) : null}
          </View>

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
            onPress={handleSignUp}
            disabled={isSubmitting} // Disable button when submitting
          >
            <FontAwesome6 name={"right-to-bracket"} color={"white"} size={20} />
            <Text style={stylesheet.buttonText1}>Sign Up</Text>
          </Pressable>

          <Pressable
            style={stylesheet.button2}
            onPress={() => {
              router.replace("/");
            }}
          >
            <Text style={stylesheet.buttonText2}>
              Already Registered? Go to Sign In
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
    width: 130,
    height: 130,
    alignSelf: "center",
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
});
