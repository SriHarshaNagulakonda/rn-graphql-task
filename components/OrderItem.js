import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Button
} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import Card from './Card';

const ProductItem = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const order_id = Math.floor(Math.random() * 100000);


  const price = parseInt(props.price);
  const product_length = Object.keys(JSON.parse(props.product_quantity)).length;

  const date = new Date();
  const delivery_date = props.selected_date;

  const deliverery_status = date>delivery_date;

  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.details}>
              <Text style={styles.title}>{"#ORDER"+order_id}
                <Text style={styles.brandName}>
                    -{" "+product_length+" products"}
                </Text>
              </Text>
              <View style={{flexDirection: 'row'}}>
                  <Text style={styles.price}>${price+"  "} 
                      <Text style={styles.striked}>
                        ${price + price*0.2}
                      </Text>
                  </Text>                
                  <View     
                      style={{
                          alignItems: 'flex-end',
                          justifyContent: 'center',
                        }}
                      >
                  </View>
                  <View style={{position: 'absolute', left:'60%',...props.style}}>
                  {deliverery_status?
                        <Text style={{...styles.imageText,backgroundColor:'green'}}>DELIVERED</Text>
                        :
                        <Text style={{...styles.imageText,backgroundColor:'red'}}>NOT DELIVERED</Text>
                    }
                    {/* <Button title='View Products' color={Colors.red} /> */}
                  </View>
              </View>
              <Text style={styles.delivery_date}>
                Delivery Date: {delivery_date}
            </Text>
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
    delivery_date:{
        marginTop:10,
    },
  product: {
    height: 100,
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },

  details: {
    alignItems: 'flex-start',
    height: '100%',
    padding: 10
  },
  title: {
    fontSize: 20,
    marginVertical: 2,
    fontWeight: 'bold',
  },
  brandName:{
    fontWeight: 'normal',
    fontSize:18,
  },
  price: {
    fontSize: 20,
    color: '#222',
    alignItems: 'flex-start',
  },
  striked: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: '#888',
    fontSize:17,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '23%',
    paddingHorizontal: 20
  },
  imageTextContainer: {
    position: 'absolute',
     top: 0,
      left: 0,
      right: 0,
      height: 20,
      alignItems: 'flex-end',
      justifyContent: 'center',
  },
  imageText:{
    color:"#fff",
    padding:5,
    // margin:2,
  }
});

export default ProductItem;
