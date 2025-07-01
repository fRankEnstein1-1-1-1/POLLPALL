import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import PrimaryButton from "../Buttons/PrimaryButton";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Dropdown } from "react-native-element-dropdown";
import { auth } from "../FirebaseConfig";

function LoginPageScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" }, 
  ];

  function pressHandlerBack() {
    navigation.goBack("start");
  }

  const handleLogin = async () => {
    if (!selectedRole) {
      alert("Please select a role.");
      return;
    }

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user.uid);

      if (selectedRole === "user") {
        navigation.replace("MainApp");
      } else {
        navigation.replace("AdminApp");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
      alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <View style={styles.Screen}>
        <View style={styles.TopContainer}>
          <View style={styles.backButton} onTouchEnd={pressHandlerBack}>
            <View style={styles.logo}>
              <AntDesign name="arrowleft" size={20} color="white" />
              <Text style={[styles.backButtonText, { fontSize: 16 }]} onPress={pressHandlerBack}>
                Back
              </Text>
            </View>
            <Text style={styles.backButtonText}>Log-In</Text>
          </View>
        </View>

        <View style={styles.BottomContainer}>
          <ScrollView contentContainerStyle={{ alignItems: "center" }}>
            <Text style={[styles.bottomTextContainer, { fontSize: 24, fontFamily: 'Poppins' }]}>Welcome Back</Text>

            <Text style={styles.bottomTextContainer}>Role</Text>
            <View style={styles.dropdownContainer}>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderWidth: 1, borderColor: "#6A5ACD" }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={roles}
                labelField="label"
                valueField="value"
                placeholder="Select Role"
                value={selectedRole}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                  setSelectedRole(item.value);
                  setIsFocus(false);
                }}
              />
            </View>

            <Text style={styles.bottomTextContainer}>Email</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputField}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#ccc"
              />
            </View>

            <Text style={styles.bottomTextContainer}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputField}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#ccc"
              />
              <TouchableOpacity style={styles.iconContainer} onPress={() => setShowPassword(!showPassword)}>
                <Entypo name={showPassword ? "eye" : "eye-with-line"} size={20} color="white" />
              </TouchableOpacity>
            </View>

            <PrimaryButton style={styles.ButtonContainer} onPress={handleLogin}>
              Log-in
            </PrimaryButton>

            <Pressable>
              <Text style={styles.bottomTextContainer}>Forgot Password?</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTextContainer: {
    color: "white",
    margin: 10,
  },
  iconContainer: {
    marginRight: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(64, 66, 100)",
    borderRadius: 15,
    width: "80%",
    paddingLeft: 8,
    height: 40,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingHorizontal: 8,
  },
  dropdownContainer: {
    width: "80%",
  },
  dropdown: {
    height: 40,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: "rgb(64, 66, 100)",
    color: "white",
  },
  placeholderStyle: {
    color: "white",
  },
  selectedTextStyle: {
    color: "white",
  },
  logo: {
    flexDirection: "row",
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
  },
  backButton: {
    borderBottomRightRadius: 350,
    paddingTop: 20,
    paddingLeft: 50,
    backgroundColor: "#6A5ACD",
    width: "50%",
    height: "80%",
    justifyContent: "flex-start",
  },
  Screen: {
    flex: 1,
  },
  TopContainer: {
    flex: 3,
    backgroundColor: "white",
  },
  ButtonContainer: {
    backgroundColor: "#6A5ACD",
    color: "#FBF5DD",
    padding: 15,
    width: 220,
    textAlign: "center",
    borderRadius: 8,
    margin: 7,
  },
  BottomContainer: {
    flex: 9,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#1D1F3C",
  },
});

export default LoginPageScreen;
