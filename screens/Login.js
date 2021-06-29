// import StatusBar from ''
import React,{ useState } from 'react'
import {TouchableOpacity,ScrollView, SafeAreaView, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import { Entypo } from '@expo/vector-icons';
// import Splash from '../assets/splash.png'
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {  Snackbar } from 'react-native-paper'


const Login = (props) => {
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState(false);
    const [otp, setOtp] = useState("")
    const [sendingOtp, setSendingOtp] = useState(false);
    const [showOTPView, setShowOTPView] = useState(false);
    const [snackBarVisible,setSnackBarVisible] = useState(false);

    const onDismissSnackBar = () => setSnackBarVisible(false);

    const phoneChangeHandler = (phone) => {
        setPhoneError(false); 
        setPhone(phone.replace(/[^0-9]/g, ''))
        if(phone.length!=10){
            setPhoneError(true);
        }
    }

    const otpChangeHandler = (otp) => {
        setOtp(otp.replace(/[^0-9]/g, ''))
    }

    const sendOTPHandler = () => {
        setShowOTPView(false);
        if(phoneError){
            return;
        }
        setSendingOtp(true);

        setTimeout(() => {
            setSendingOtp(false);
            setShowOTPView(true);
            setSnackBarVisible(true);
            setTimeout(() => {
                setSnackBarVisible(false);
            },3000)
        }, 2000);
        
    }

    return (
        <ScrollView >
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>LOGIN</Text>
                </View>
                <View style={{
                    width: 20,
                }}
                 />
                 <View style={styles.splash}>
                     <Entypo name="tablet-mobile-combo" size={150} color="white" />
                 </View>
            </View>
            <View  style={styles.content}>
            <View >
                    <View>
                        <Text style={styles.title} >
                            Phone Number 
                        </Text>
                    </View>
                    <View>
                        <TextInput
                            maxLength={10}
                            value={phone}
                            onChangeText={phoneChangeHandler}
                            style={{...styles.input,
                                borderBottomColor:phoneError?"red":"#dddddd"
                            }}
                            keyboardType="phone-pad"
                            placeholder="Phone Number"
                            placeholderTextColor="#ababab"
                        />
                        {phoneError && <Text style={styles.errorMessage}>
                            Invalid Phone Number
                        </Text>}
                    </View>
                    <View style={styles.otpWrapper}>
                        <TouchableOpacity onPress={sendOTPHandler} style={styles.sendButton}>
                           {sendingOtp? <ActivityIndicator size="large" color="white" /> : 
                            <>
                                <Text style={styles.sendButtonText} >Send OTP </Text>
                                <Ionicons name="send" size={24} color="white" />
                            </>
                            }

                        </TouchableOpacity>
                    </View>
                   {showOTPView && <>
                      <View>
                            <TextInput
                                maxLength={6}
                                value={otp}
                                onChangeText={otpChangeHandler}
                                style={{...styles.input,...styles.otp}}
                                keyboardType="phone-pad"
                                placeholder="OTP"
                                placeholderTextColor="#ababab"
                            />
                            {phoneError && <Text style={styles.errorMessage}>
                                Invalid Phone Number
                            </Text>}
                        </View>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity onPress={sendOTPHandler} style={styles.button}>
                                <FontAwesome style={styles.iconButton} name="arrow-right" size={24}  />
                            </TouchableOpacity>
                        </View>
                    </>
                    }
            </View>
            </View>

        </View>
        <Snackbar
            visible={snackBarVisible}
            onDismiss={onDismissSnackBar}
            action={{
                label: 'Dissmiss',
                onPress: onDismissSnackBar
            }}>
            OTP Sent
        </Snackbar>
        </ScrollView>
    )
}

export default Login

Login.navigationOptions = {
    headerShown: false,
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#f7f7f7',
    },
    headerWrapper:{
        backgroundColor: '#5566ee',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    header:{
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    iconWhite:{
        color:'#fff',
    },
    headerText:{
        fontWeight:'bold',
        color:'#fff',
        fontSize: 30,
        textAlign: 'center',
        paddingVertical:25,
    },
    splash:{
        paddingTop: 50,
        paddingBottom: 100,
        alignItems: 'center',
    },
    content:{
        marginHorizontal: 20,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        borderRadius: 15,
        marginTop:-60,
    },
    title:{
        fontWeight: 'bold',
        fontSize: 18,
        color: '#2d2d2d',
        paddingVertical: 20,
    },
    input:{
        fontWeight: 'bold',
        borderBottomColor: '#dddddd',
        borderBottomWidth: 2,
        fontSize: 16,
        marginBottom: 10,
        paddingVertical: 20,
        letterSpacing: 6
    },
    otp:{
        letterSpacing:20,
        borderStyle:"dashed",
    },
    description:{
        color: '#989898',
        textAlign: 'center',
        fontSize:18,
        padding: 20,
        fontWeight: '500',
    },
    buttonWrapper:{
        alignItems: 'center',
        marginVertical: 30,
    },
    button:{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5566ee',
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    iconButton:{
        color: '#fff',
        // backgroundColor: '#5566ee',
    },
    errorMessage:{
        color: 'red'
    },
    otpWrapper:{
        alignItems: 'flex-end',
        marginVertical: 20,
    },
    sendButton:{
        alignItems: 'center',
        flexDirection:'row',
        justifyContent: 'center',
        backgroundColor: '#5566ee',
        color:'#fff',
        width: 150,
        height: 50,
        borderRadius: 50,
    },
    sendButtonText:{
        color: '#fff',
        fontSize: 20,
    }
})
