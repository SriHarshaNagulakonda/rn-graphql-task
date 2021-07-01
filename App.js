import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, Text, View } from "react-native";
import MainNavigator from "./navigators/MainNavigator";
import { ApolloProvider } from "@apollo/client";
import { AsyncStorage } from "react-native";
import { makeApolloClient } from "./client";
import LoginScreen from "./screens/Login";

export default function App() {
  const [client, setClient] = React.useState(null);
  const [isloggendIn, setIsloggendIn] = useState(false);

  const fetchSession = async () => {
    // fetch session
    const session = await AsyncStorage.getItem("user_object");
    const sessionObj = JSON.parse(session);
    // var access_token = null;
    if (sessionObj) {
      // var { access_token, id } = sessionObj["verify_otp"];
      const { verify_otp } = sessionObj.data;
      const { access_token, id } = verify_otp;
      try {
        console.log(access_token, "access_token");
        const client = makeApolloClient(access_token);
        setClient(client);
        setIsloggendIn(true);
        console.log("...created...");
        // console.log(client);
      } catch (error) {
        console.log(error);
      }
    }
    else{
      const client = makeApolloClient("");
      setClient(client);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  if (!client) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  return (
    <ApolloProvider client={client}>
      {isloggendIn ? <MainNavigator /> : <LoginScreen fun={fetchSession} />}
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
