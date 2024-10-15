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
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";

SplashScreen.preventAutoHideAsync();
const logoImagePath = require("../assets/image/logo.png");

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(/^07[01245678]{1}[0-9]{7}$/, "Please enter a valid mobile number (starting with 07 and 10 digits)")
    .required("Mobile number is required"),
  password: Yup.string()
    .min(8, "Password should be at least 8 characters long")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[^A-Za-z0-9]/, "Password must contain a special character")
    .required("Password is required"),
});

export default function index() {
  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  const [getName, setName] = useState("");

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const handleSignIn = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      let response = await fetch(
        process.env.EXPO_PUBLIC_API_URL+"/SignIn",
        {
          method: "POST",
          body: JSON.stringify({
            mobile: values.mobile,
            password: values.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        let json = await response.json();
        if (json.success) {
          let user = json.user;
          try {
            await AsyncStorage.setItem("user", JSON.stringify(user));
            router.replace("/home");
          } catch (error) {
            Alert.alert("Error", "Unable to process your request.");
          }
        } else {
          Alert.alert("Error", json.message);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
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

          <Formik
            initialValues={{ mobile: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSignIn}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
              setFieldValue,
              handleBlur,
            }) => (
              <>
                <Text style={stylesheet.text3}>Mobile</Text>
                <TextInput
                  style={stylesheet.input1}
                  placeholderTextColor={"black"}
                  placeholder="Enter Mobile No"
                  inputMode={"tel"}
                  maxLength={10}
                  onChangeText={handleChange("mobile")}
                  onBlur={handleBlur("mobile")}
                  value={values.mobile}
                  onEndEditing={async () => {
                    if (values.mobile.length == 10) {
                      let response = await fetch(
                        process.env.EXPO_PUBLIC_API_URL+"/GetLetters?mobile=" +
                          values.mobile
                      );

                      if (response.ok) {
                        let json = await response.json();
                        setName(json.letters);
                      }
                    }
                  }}
                />
                {touched.mobile && errors.mobile ? (
                  <Text style={{ color: "red", marginTop: 5 }}>{errors.mobile}</Text>
                ) : null}

                <View>
                  <Text style={stylesheet.text3}>Password</Text>
                  <TextInput
                    style={stylesheet.input1}
                    placeholderTextColor={"black"}
                    placeholder="Enter Password"
                    secureTextEntry={true}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  {touched.password && errors.password ? (
                    <Text style={{ color: "red", marginTop: 5 }}>
                      {errors.password}
                    </Text>
                  ) : null}
                </View>

                <Pressable
                  style={[
                    stylesheet.button1,
                    isSubmitting && { backgroundColor: "#ccc" },
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <FontAwesome6 name={"paper-plane"} color={"white"} size={20} />
                      <Text style={stylesheet.buttonText1}>Sign In</Text>
                    </>
                  )}
                </Pressable>
              </>
            )}
          </Formik>

          <Pressable
            style={stylesheet.button2}
            onPress={() => {
              router.replace("/signup");
            }}
          >
            <Text style={stylesheet.buttonText2}>New User? Go to Sign Up</Text>
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
