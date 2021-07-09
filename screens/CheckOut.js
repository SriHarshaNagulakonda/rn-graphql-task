import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, FlatList,Button, AsyncStorage, TouchableOpacity, ActivityIndicator } from 'react-native'
import Colors from "../constants/Colors";
import AwesomeAlert from 'react-native-awesome-alerts';

function Card (props) {
      const { selected, onPress } = props
      return (
        <TouchableOpacity onPress={onPress} style={[cardStyles.cardContainer, selected && { backgroundColor: '#cdcdcd', borderColor: 'red', borderWidth:2}]}>
          {props.children}
        </TouchableOpacity>
      );
  }
  
const cardStyles = StyleSheet.create({
    cardContainer: {
      height: 70,
      width: 120,
      backgroundColor: "#fff",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
      shadowColor: "rgba(0,0,0, .4)",
      shadowOffset: { height: 1, width: 1 },
      shadowOpacity: 1,
      shadowRadius: 1,
      elevation: 5,
      margin: 10,
      marginHorizontal:15,
    }
})

function dateToYMD(date) {
    var strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var d = date.getDate();
    var m = strArray[date.getMonth()];
    var y = date.getFullYear();
    return '' + (d <= 9 ? '0' + d : d) + '-' + m + '-' + y;
}


const CheckOut = (props) => {
    const total_price = props.navigation.getParam('total_price')
    const day1 = new Date();
    var day2 = new Date();
    day2.setDate(day2.getDate()+1);
    var day3 = new Date();
    day3.setDate(day2.getDate()+1);
    var day4 = new Date();
    day4.setDate(day3.getDate()+1);
    var day5 = new Date();
    day5.setDate(day4.getDate()+1);

    const [dates,setDates] = useState([dateToYMD(day1),
        dateToYMD(day2), dateToYMD(day3), dateToYMD(day4), dateToYMD(day5)
    ])
    const [time, setTime] = useState(['Home,\n 7:00 - 21:00','Office,\n 6:00 - 15:00'])
    const [selected,setSelected] = useState(null)
    const [timeSelected, setTimeSelected] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showAwesomeAlert, setShowAwesomeAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

    return (
        <>
        <View style={{position: 'absolute', height: '60%'}}>
            <Text style={styles.title}>Select Delivery Date</Text>
            <FlatList
            horizontal={true}
                data={dates}
                keyExtractor={item => item}
                extraData={selected}
                renderItem={(item) => {
                return (
                    <Card
                        onPress={() => {setSelected(item)
                            console.log(item)}
                        }
                        selected={selected && selected.item === item.item}
                    >
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                            {item.item}
                        </Text>
                     </Card>
                )
                }}
            />
            <Text style={styles.title}>Select Delivery Time</Text>
            <FlatList
            horizontal={true}
                data={time}
                keyExtractor={item => item}
                extraData={timeSelected}
                renderItem={(item) => {
                return (
                    <Card
                        onPress={() => {setTimeSelected(item)}
                        }
                        selected={timeSelected && timeSelected.item === item.item}
                    >
                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                            {item.item}
                        </Text>
                     </Card>
                )
                }}
            />
        </View>
        <View style={styles.bottomBar}>
        {loading
                ? <ActivityIndicator size="large" color={Colors.red} />
            :<Button style={styles.bottomButton} title={"Pay $"+total_price.toFixed(2)}
                color={Colors.red}   
                onPress={async () => {
                    if(!selected || !timeSelected){
                        setShowErrorAlert(true);
                        return;
                    }
                    setLoading(true);
                    const session = await AsyncStorage.getItem("user_object");
                    const sessionObj = JSON.parse(session);
                    const { verify_otp } = sessionObj.data;
                    const { id } = verify_otp;
                    console.log(id,'user id');
                    const product_quantity = await AsyncStorage.getItem("product_quantity");
                    console.log(product_quantity,'product quantity');
                    console.log(total_price.toFixed(2),'total price');
                    var today = new Date();
                    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                    var dateTime = date+' '+time;
                    console.log(dateTime,'now');
                    console.log(selected.item,'date selected')
                    console.log(timeSelected.item,'time selected')
                    var selected_date = selected.item
                    var selected_time = timeSelected.item
                    var price = total_price.toFixed(2)
                    const response = await fetch(
                        `https://rn-task-a7fc4-default-rtdb.firebaseio.com/orders.json`,
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                            id,
                            product_quantity,
                            price,
                            dateTime,
                            selected_date,
                            selected_time
                          })
                        }
                      );
                  
                      const resData = await response.json();
                      console.log(resData,'response')
                      setTimeout(() => {
                          setLoading(false);
                          AsyncStorage.setItem(
                            "product_quantity",
                            JSON.stringify({})
                          );
                          AsyncStorage.setItem(
                            "initial_cart",
                            JSON.stringify({})
                          );
                          setShowAwesomeAlert(true);
                      },1000)

                }}

            />
            }
            <AwesomeAlert
                show={showAwesomeAlert}
                showProgress={false}
                title="SUCCESS"
                message="Order Placed Successfully"
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="OKAY"
                confirmButtonColor="#00b382"
                onConfirmPressed={() => {
                    setShowAwesomeAlert(false)
                    props.navigation.navigate('Home');
                }}
            />
            <AwesomeAlert
                show={showErrorAlert}
                showProgress={false}
                title="Error"
                message="Select Delivery Date and Time"
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="OKAY"
                confirmButtonColor="#DD6B55"
                onConfirmPressed={() => {
                    setShowErrorAlert(false)
                }}
            />

        </View>
        </>
    )
}

export default CheckOut

CheckOut.navigationOptions = (navData) => {
    return {
      headerTitle: 'CHECK OUT', 
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: Colors.primary,
      },  
    };
}

const styles = StyleSheet.create({
    title: {
        fontWeight: "bold",
        fontSize: 28,
        margin:10,
        marginVertical: 30,
        color: Colors.primary
    },
    bottomBar:{
        position: 'absolute',
        bottom: 10,
        right: 10,
        padding: 20, 
    },
    bottomButton:{
        padding: 200,
        margin: 20,
        height: '100%',
        width: '100%',
        fontSize: 30,
    }
})
