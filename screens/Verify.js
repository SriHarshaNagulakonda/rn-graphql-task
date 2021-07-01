import React from 'react'
import { StyleSheet, Text,Button ,View, AsyncStorage } from 'react-native'

const Verify = () => {

    const clearstorage = () => {
        AsyncStorage.removeItem('user_object');
    }

    return (
        <View>
            <Text>Verify</Text>
            <Button title="clear" onPress={clearstorage} />
        </View>
    )
}

export default Verify

const styles = StyleSheet.create({})
