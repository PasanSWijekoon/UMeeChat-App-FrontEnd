import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  View,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import { router } from "expo-router";


// Define the validation schema using Yup
const SignUpSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, "First name should only contain letters")
    .required("First name is required"),
  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, "Last name should only contain letters")
    .required("Last name is required"),
  mobile: Yup.string()
    .matches(/^07[01245678]{1}[0-9]{7}$/, "Please enter a valid mobile number")
    .required("Mobile number is required"),
  password: Yup.string()
    .min(8, "Password should be at least 8 characters long")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[^A-Za-z0-9]/, "Password must contain a special character")
    .required("Password is required"),
});

const logoImagePath = require("../assets/image/logo.png");

export default function Signup() {
  const [loaded, error] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  });

  const defaultImagePath = require("../assets/image/user.png");
  const [getImage, setImage] = React.useState(defaultImagePath);
  
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

  React.useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const handleImagePicker = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue("profileImage", result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);

    let formData = new FormData();
    formData.append("mobile", values.mobile);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("password", values.password);

    if (values.profileImage) {
      formData.append("profileImage", {
        name: "profile.jpg",
        type: "image/jpg",
        uri: values.profileImage,
      });
    }

    try {
      let response = await fetch(
        "http://192.168.1.4:8080/Umee_Chat_App/SignUp",
        {
          method: "POST",
          body: formData,
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

          <Text style={stylesheet.text1}>Create Account</Text>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              mobile: "",
              password: "",
              profileImage: "",
            }}
            validationSchema={SignUpSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
              setFieldValue,
            }) => (
              <>
                <Pressable
                  style={stylesheet.button3}
                  onPress={() => handleImagePicker(setFieldValue)}
                >
                  <Image
                    source={getImage}
                    style={stylesheet.button3}
                    contentFit={"contain"}
                  />
                </Pressable>
                <Text style={stylesheet.selectimage}>Select Image</Text>

                {/* First Name */}
                <Text style={stylesheet.text3}>First Name</Text>
                <TextInput
                  style={stylesheet.input1}
                  placeholder="Enter First Name"
                  value={values.firstName}
                  onChangeText={handleChange("firstName")}
                />
                {errors.firstName && touched.firstName ? (
                  <Text style={stylesheet.errorText}>{errors.firstName}</Text>
                ) : null}

                {/* Last Name */}
                <Text style={stylesheet.text3}>Last Name</Text>
                <TextInput
                  style={stylesheet.input1}
                  placeholder="Enter Last Name"
                  value={values.lastName}
                  onChangeText={handleChange("lastName")}
                />
                {errors.lastName && touched.lastName ? (
                  <Text style={stylesheet.errorText}>{errors.lastName}</Text>
                ) : null}

                {/* Mobile */}
                <Text style={stylesheet.text3}>Mobile</Text>
                <TextInput
                  style={stylesheet.input1}
                  placeholder="Enter Mobile No"
                  maxLength={10}
                  value={values.mobile}
                  onChangeText={handleChange("mobile")}
                  keyboardType="numeric"
                />
                {errors.mobile && touched.mobile ? (
                  <Text style={stylesheet.errorText}>{errors.mobile}</Text>
                ) : null}

                {/* Password */}
                <Text style={stylesheet.text3}>Password</Text>
                <TextInput
                  style={stylesheet.input1}
                  placeholder="Enter Password"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange("password")}
                />
                {errors.password && touched.password ? (
                  <Text style={stylesheet.errorText}>{errors.password}</Text>
                ) : null}

                {/* Submit Button */}
                <Pressable
                  style={[
                    stylesheet.button1,
                    isSubmitting && { backgroundColor: "#ccc" },
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={stylesheet.buttonText1}>Sign Up</Text>
                  )}
                </Pressable>
              </>
            )}
          </Formik>

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
  view1: { flex: 1, justifyContent: "center", backgroundColor: "#f5f7fa" },
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
  image1: { width: 130, height: 130, alignSelf: "center" },
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
  buttonText1: { fontSize: 20, fontWeight: "bold", color: "white" },
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
  buttonText2: { fontSize: 15, color: "#0e66fe", fontWeight: "500" },
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
  errorText: { color: "red", fontSize: 12, marginTop: 5 },
});
