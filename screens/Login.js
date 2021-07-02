// import StatusBar from ''
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
// import Splash from '../assets/splash.png'
import { FontAwesome } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { AsyncStorage } from "react-native";
import { makeApolloClient } from "../client";

const GENERATE_OTP = gql`
  mutation ($phone: String!) {
    generate_otp(mobile_number: $phone) {
      code
    }
  }
`;

const VERIFY_OTP = gql`
  mutation ($phone: String!, $otp: String!) {
    verify_otp(code: $otp, mobile_number: $phone) {
      id
      name
      access_token
      id_token
      supersari_partner
      supersari_config
      refresh_token
    }
  }
`;

const Login = (props) => {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [showOTPView, setShowOTPView] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [phoneErrorText, setPhoneErrorText] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpErrorText, setOtpErrorText] = useState("");
  const [otpError, setOTPError] = useState(false);

  const [generateOtp, { loading, error }] = useMutation(GENERATE_OTP);
  const [verifyOtp, { verifyOtpLoading, verifyOtpError }] =
    useMutation(VERIFY_OTP);

  const onDismissSnackBar = () => setSnackBarVisible(false);

  const phoneChangeHandler = (phone) => {
    setPhoneError(false);
    setPhone(phone.replace(/[^0-9]/g, ""));
    if (phone.length <= 10) {
      setPhoneError(true);
      setPhoneErrorText("Invalid Phone Number");
    }
  };

  const sendOTPHandler = () => {
    setShowOTPView(false);
    if (phoneError) {
      return;
    }
    setSendingOtp(true);
    generateOtp({
      variables: { phone },
    })
      .then((data) => {
        console.log("otp sent");
        // console.log(data, "send otp data");
        setTimeout(() => {
          setShowOTPView(true);
          setSnackBarVisible(true);
          setSendingOtp(false);
          setTimeout(() => {
            setSnackBarVisible(false);
          }, 3000);
        }, 2000);
      })
      .catch((e) => {
        setPhoneError(true);
        setPhoneErrorText(e.graphQLErrors[0].message);
        console.log(JSON.stringify(e), "error");
        setSendingOtp(false);
      });
  };

  const otpChangeHandler = (otp) => {
    setOtp(otp.replace(/[^0-9]/g, ""));
  };

  const verifyOtpHandler = () => {
    setOTPError(false);
    if (otp.length != 6) {
      setOTPError(true);
      setOtpErrorText("Invalid OTP");
      return;
    }
    verifyOtp({
      variables: { otp, phone },
    })
      .then(async (data) => {
        console.log('otp verified');
        // console.log(data, "verify otp dataa");
        // makeApolloClient(data['access_token']);
        await AsyncStorage.setItem("user_object", JSON.stringify(data));
        props.fun();
      })
      .catch((err) => {
        console.log(err);
        setOTPError(true);
        setOtpErrorText(err.graphQLErrors[0].message);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <Text style={styles.headerText}>LOGIN</Text>
          </View>
          <View
            style={{
              width: 20,
            }}
          />
          <View style={styles.splash}>
            <Entypo name="tablet-mobile-combo" size={150} color="white" />
          </View>
        </View>
        <View style={styles.content}>
          <View>
            <View>
              <Text style={styles.title}>Phone Number</Text>
            </View>
            <View>
              <TextInput
                maxLength={11}
                value={phone}
                onChangeText={phoneChangeHandler}
                style={{
                  ...styles.input,
                  borderBottomColor: phoneError ? "red" : "#dddddd",
                }}
                keyboardType="phone-pad"
                placeholder="Phone Number"
                placeholderTextColor="#ababab"
              />
              {phoneError && (
                <Text style={styles.errorMessage}>{phoneErrorText}</Text>
              )}
            </View>
            <View style={styles.otpWrapper}>
              <TouchableOpacity
                onPress={sendOTPHandler}
                style={styles.sendButton}
              >
                {sendingOtp ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <>
                    <Text style={styles.sendButtonText}>Send OTP </Text>
                    <Ionicons name="send" size={24} color="white" />
                  </>
                )}
              </TouchableOpacity>
            </View>
            {showOTPView && (
              <>
                <View>
                  <TextInput
                    maxLength={6}
                    value={otp}
                    onChangeText={otpChangeHandler}
                    style={{
                      ...styles.input,
                      ...styles.otp,
                      borderBottomColor: otpError ? "red" : "#dddddd",
                    }}
                    keyboardType="phone-pad"
                    placeholder="OTP"
                    placeholderTextColor="#ababab"
                  />
                  {otpError && (
                    <Text style={styles.errorMessage}>{otpErrorText}</Text>
                  )}
                </View>
                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                    onPress={verifyOtpHandler}
                    style={styles.button}
                  >
                    {verifyingOtp ? (
                      <ActivityIndicator size="large" color="white" />
                    ) : (
                      <FontAwesome
                        style={styles.iconButton}
                        name="arrow-right"
                        size={24}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </View>
      <Snackbar
        visible={snackBarVisible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Dissmiss",
          onPress: onDismissSnackBar,
        }}
      >
        OTP Sent
      </Snackbar>
    </ScrollView>
  );
};

export default Login;

Login.navigationOptions = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
  },
  headerWrapper: {
    backgroundColor: "#5566ee",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  iconWhite: {
    color: "#fff",
  },
  headerText: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 30,
    textAlign: "center",
    paddingVertical: 25,
  },
  splash: {
    paddingTop: 50,
    paddingBottom: 100,
    alignItems: "center",
  },
  content: {
    marginHorizontal: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: -60,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#2d2d2d",
    paddingVertical: 20,
  },
  input: {
    fontWeight: "bold",
    borderBottomColor: "#dddddd",
    borderBottomWidth: 2,
    fontSize: 16,
    marginBottom: 10,
    paddingVertical: 20,
    letterSpacing: 6,
  },
  otp: {
    letterSpacing: 20,
    borderStyle: "dashed",
  },
  description: {
    color: "#989898",
    textAlign: "center",
    fontSize: 18,
    padding: 20,
    fontWeight: "500",
  },
  buttonWrapper: {
    alignItems: "center",
    marginVertical: 30,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#5566ee",
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  iconButton: {
    color: "#fff",
    // backgroundColor: '#5566ee',
  },
  errorMessage: {
    color: "red",
  },
  otpWrapper: {
    alignItems: "flex-end",
    marginVertical: 20,
  },
  sendButton: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#5566ee",
    color: "#fff",
    width: 150,
    height: 50,
    borderRadius: 50,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 20,
  },
});
