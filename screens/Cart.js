import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Button,
  FlatList,
  View,
  ActivityIndicator,
  AsyncStorage,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import ProductItem from "../components/ProductItem";
import Colors from "../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";
import Counter from "react-native-counters";

var total_price = 0;

const FETCH_PRODUCTS = gql`
  query {
    get_products_delta(last_updated: "") {
      last_updated
      products {
        id
        product_template_id
        merchant_id
        warehouse_product_id
        fulfiller_reference_id
        brand_name
        brand_image
        image
        display_name
        trade_name
        unit_measure
        price
        format
        size
        is_available
        is_single
        wholesale_items
        tags
        mother_product_id
        meta
        is_new
        points_rate
        variant_name
        volume
        is_disabled
        max_qty
        substitutes
      }
    }
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(FETCH_PRODUCTS, {});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [reRenderProducts, setReRenderProducts] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState({});
  const [totalPrice, setTotalPrice] = useState();


  var products = [];
  // if (!products) return null;

  if (error) {
    console.error(error);
    return <Text>Error</Text>;
  }

  const fetchCart = async () => {
    var user_cart = await AsyncStorage.getItem("initial_cart");
    var product_quantity = {}
    if (user_cart) {
        user_cart = JSON.parse(user_cart);
        var cart_products = [];
        for (var key in products) {
          if(user_cart[products[key]["id"]]==1) {
              console.log(products[key]["id"],'id')
              cart_products.push(products[key])
              product_quantity[products[key]["id"]] = 1
              total_price+=products[key]["price"]
          }
        }
        setCartProducts(cart_products)
        setProductQuantity(product_quantity)
        setTotalPrice(total_price)
        // setCartItems(user_cart);
    } else {
      
    }
    setReRenderProducts(!reRenderProducts)
  };

  useEffect(() => {
      console.log('cart opened')
    fetchCart();
    console.log(productQuantity)
  }, []);

  if (loading) {
    console.log(loading, "loading");
    return <ActivityIndicator size={30} color="blue" />;
  }

  if (!loading) {
    products = data.get_products_delta.products;
    // products = [products[5]];
  }

  return (
    <View>
      <FlatList
        onRefresh={() => {}}
        refreshing={loading}
        data={cartProducts}
        keyExtractor={(item) => item.id}
        extraData={reRenderProducts}
        renderItem={(itemData) => (
          <ProductItem
            // image={itemData.item.image}
            image="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/10456354/2019/8/22/d56e75f6-f1a7-4fdd-b430-51befb36f88d1566454760527-Campus-Sutra-Men-Colourblocked-Casual-Spread-Shirt-290156645-1.jpg"
            title={itemData.item.display_name}
            price={productQuantity[itemData.item.id] * itemData.item.price}
            brand_name={itemData.item.brand_name}
            is_available={itemData.item.is_available}
            points_rate={itemData.item.points_rate}
            id={itemData.item.id}
            style={{left:'65%'}}
            onSelect={() => {
              // selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          >
            <Counter start={1} min={1} max={itemData.item.max_qty}
              onChange={(value) => {
                setProductQuantity({...productQuantity, [itemData.item.id]:value})
              }} />
          </ProductItem>
        )}
      />
    </View>
  );
};

export default Home;

Home.navigationOptions = (navData) => {
    return {
      headerTitle: 'CART', 
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: Colors.primary,
      },  
      headerRight: (
        <AntDesign name="check" 
          size={40}
          color="white"
          onPress={() => {
            
            navData.navigation.navigate('CheckOut',{total_price: total_price})

          }}
      />
      ),

    };
}

const styles = StyleSheet.create({});
