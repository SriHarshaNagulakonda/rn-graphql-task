import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';

import Card from './Card';

const ProductItem = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  const price = parseInt(props.price.toFixed(2));

  return (
    <Card style={styles.product}>
      <View style={styles.touchable}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: props.image }} />
              <View style={styles.imageTextContainer}>
                {props.is_available?
                  <Text style={{...styles.imageText,backgroundColor:'green'}}>AVAILABLE</Text>
                  :
                  <Text style={{...styles.imageText,backgroundColor:'red'}}>OUT OF STOCK</Text>
                }
                
            </View>
            </View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title+"   "}
                <Text style={styles.brandName}>
                    -{" "+props.brand_name}
                  </Text>
              </Text>
              <Text style={styles.price}>${price+"  "} 
                <Text style={styles.striked}>
                    ${price + price*0.2}
                  </Text>
              </Text>
            </View>
            <View style={styles.actions}>
              {props.children}
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  product: {
    height: 350,
    margin: 20,
  },
  touchable: {
    borderRadius: 10,
    overflow: 'hidden'
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  details: {
    alignItems: 'flex-start',
    height: '17%',
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
    color: '#222'
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
