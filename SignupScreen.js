
import React, { useState } from 'react';
import { View, StyleSheet, Text, StatusBar, TextInput, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import PrimaryButton from '../Buttons/PrimaryButton';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import { auth, db } from '../FirebaseConfig'; // Import Firebase auth and firestore
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Firebase Authentication
import { setDoc, doc } from 'firebase/firestore'; // Firestore database

function SignUpScreen({ navigation }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const roles = [
    { label: 'User', value: 'user' },
    { label: 'Admin', value: 'admin' },
  ];

  // Handle back navigation
  function pressHandlerBack() {
    navigation.goBack('start');
  }


  function onPressNoAccount() {
    navigation.navigate('Login');
  }

  // Handle sign-up functionality
  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword || !selectedRole) {
      alert("All fields are required!");
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert("Invalid email format. Please enter a valid email.");
      return;
    }
  
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
  
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Save user data to Firestore
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name,
        email,
        role: selectedRole,
        isNominee: false,
        hasVotes:{},
        positions: {},
      });
  
      if (selectedRole === "user") {
        navigation.replace("MainApp");
      } else {
        navigation.replace("AdminApp");
      }
    } catch (error) {
      console.error("Error signing up:", error.message);
      alert(error.message);
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      <View style={styles.Screen}>
        <View style={styles.TopContainer}>
          <View style={styles.backButton} onTouchEnd={pressHandlerBack}>
            <View style={styles.logo}>
              <AntDesign name="arrowleft" size={20} color="white" />
              <Text style={[styles.backButtonText, { fontSize: 16 }]} onPress={pressHandlerBack}>Back</Text>
            </View>
            <Text style={styles.backButtonText}>Sign-Up</Text>
          </View>
        </View>

        <View style={styles.BottomContainer}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: 'center' }}>
            <Text style={[styles.bottomTextContainer, { fontSize: 24, fontFamily: 'Poppins' }]}>Create New Account</Text>

            <Text style={styles.bottomTextContainer}>Role</Text>
            <View style={styles.dropdownContainer}>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderWidth: 1, borderColor: '#6A5ACD' }]}
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

            <Text style={styles.bottomTextContainer}>Name</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputField}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
              />
            </View>

            <Text style={styles.bottomTextContainer}>Email/Username</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputField}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <Text style={styles.bottomTextContainer}>Password</Text>
            <View style={styles.passwordContainer}>
  <TextInput
    style={styles.inputField}
    value={password}
    onChangeText={setPassword}
    placeholder="Enter password"
    secureTextEntry={!showPassword}
    placeholderTextColor="#ccc"
  />
  <TouchableOpacity style={styles.iconContainer} onPress={() => setShowPassword(!showPassword)}>
    <Entypo name={showPassword ? 'eye' : 'eye-with-line'} size={20} color="white" />
  </TouchableOpacity>
</View>


            <Text style={styles.bottomTextContainer}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputField}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity style={styles.iconContainer} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Entypo name={showConfirmPassword ? 'eye' : 'eye-with-line'} size={20} color="white" />
              </TouchableOpacity>
            </View>

            <PrimaryButton style={styles.ButtonContainer} onPress={handleSignUp}>Sign-Up</PrimaryButton>
            <Pressable onPress={onPressNoAccount}>
              <Text style={styles.bottomTextContainer}>Already have an account?</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}


export default SignUpScreen;

const styles = StyleSheet.create({
  bottomTextContainer: {
    color: 'white',
    margin: 10,
  },
  iconContainer:{
    marginRight:10,
  },
  passwordContainer:{
    backgroundColor: 'rgb(64, 66, 100)',
    width: '80%',
    borderRadius: 15,
    height: 40,
    color: 'white',
    flexDirection:'row',
  },
  inputField: {
    backgroundColor: 'rgb(64, 66, 100)',
    flex:1,
    borderRadius: 15,
    color: 'white',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(64, 66, 100)',
    borderRadius: 15,
    width: '80%',
    paddingLeft: 8,
    height: 40,
    marginBottom: 10,
  },
  dropdownContainer: {
    width: '80%',
  },
  dropdown: {
    height: 40,
    borderRadius: 15,
    paddingHorizontal: 10,
    backgroundColor: 'rgb(64, 66, 100)',
    color: 'white',
  },
  placeholderStyle: {
    color: 'white',
  },
  selectedTextStyle: {
    color: 'white',
  },
  logo: {
    flexDirection: 'row',
  },
  backButtonText: {
    color: 'white',
    fontSize: 20,
    fontFamily:'Poppins'
  },
  backButton: {
    borderBottomRightRadius: 350,
    paddingTop: 20,
    paddingLeft: 40,
    backgroundColor: '#6A5ACD',
    width: '50%',
    height: '80%',
    justifyContent: 'flex-start',
  },
  Screen: {
    flex: 1,
  },
  TopContainer: {
    flex: 3,
    backgroundColor: 'white',
  },
  ButtonContainer: {
    backgroundColor: '#6A5ACD',
    color: '#FBF5DD',
    padding: 15,
    width: 220,
    textAlign: 'center',
    borderRadius: 8,
    margin: 7,
  },
  BottomContainer: {
    flex: 9,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: '#1D1F3C',
  },
});

