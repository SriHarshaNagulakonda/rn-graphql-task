import React,{useEffect, useState} from 'react'
import { StyleSheet,FlatList,ActivityIndicator, Text, AsyncStorage, View } from 'react-native'
import Colors from "../constants/Colors";

import OrderItem from '../components/OrderItem'

const Orders = (props) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [reRenderOrders, setReRenderOrders] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true)
    try{

        const response = await fetch(
          `https://rn-task-a7fc4-default-rtdb.firebaseio.com/orders.json`
        );

        if (!response.ok) {
          throw new Error('Something went wrong!');
        }

        const session = await AsyncStorage.getItem("user_object");
        const sessionObj = JSON.parse(session);
        const { verify_otp } = sessionObj.data;
        const { id } = verify_otp;
        console.log(id,'user id');
        
        const resData = await response.json();
        var loadedOrders = [];

        for(var key in resData){
            loadedOrders.push(resData[key])
        }

        loadedOrders = loadedOrders.filter(order => order.user_id === id)


        console.log(loadedOrders,'response')

      } catch (err) {
        // send to custom analytics server
        console.log(err)
        throw err;
      }
      setReRenderOrders(!reRenderOrders)
      setOrders(loadedOrders)
      setLoading(false)
  }

  // useEffect(() => {
  //     fetchOrders();
  // },[]);

  props.navigation.addListener('didFocus', () => {
    fetchOrders();
  });

  if(loading)
    return <ActivityIndicator size={30} color="blue" />;



  return (
    <View>
      <FlatList
        onRefresh={() => {}}
        refreshing={loading}
        data={orders}
        keyExtractor={(item) => item.id}
        extraData={reRenderOrders}
        renderItem={(itemData) => (
            // <Text>{itemData.item.price}</Text>
              <OrderItem
                  price={itemData.item.price}
                  product_quantity={itemData.item.product_quantity}
                  selected_date={itemData.item.selected_date}
                  onSelect={() =>
                    props.navigation.navigate('OrderProducts',{product_quantity:itemData.item.product_quantity})
                  }
              >
                </OrderItem>
              
          )}
      />
    </View>
  )
}

export default Orders

Orders.navigationOptions = (navData) => {
  return {
    headerTitle: 'All Orders',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: Colors.primary,
    },  
  };
}

const styles = StyleSheet.create({})
