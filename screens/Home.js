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
import { EvilIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";

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
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");
  const [latestCartChangedId, setLatestCartChangedId] = useState();


  const onDismissSnackBar = () => setSnackBarVisible(false);


  var products = [];
  // if (!products) return null;

  if (error) {
    console.error(error);
    return <Text>Error</Text>;
  }

  const fetchCart = async () => {
    var user_cart = await AsyncStorage.getItem("initial_cart");
    if (!user_cart) {
      console.log("no cart items");
      // const set = await AsyncStorage.setItem('initial_cart',JSON{})
      const initial_cart = {};
      for (var key in products) {
        initial_cart[products[key]["id"]] = 0;
      }
      console.log(initial_cart, "initial_cart");
      setCartItems(initial_cart);
    } else {
      user_cart = JSON.parse(user_cart);
      for (var key in products) {
        if(!user_cart.hasOwnProperty(products[key]["id"]))
          user_cart[products[key]["id"]] = 0;
      }
      setCartItems(user_cart);
    }
  };



  useEffect(() => {
    fetchCart();
  }, [loading]);

  useEffect(() => {
    console.log('updating the async')
    AsyncStorage.setItem(
      "initial_cart",
      JSON.stringify(cartItems)
    );
},[cartItems]);


  if (loading) {
    console.log(loading, "loading");
    return <ActivityIndicator size={30} color="blue" />;
  }

  if (!loading) {
    console.log(loading, "loading");
    products = data.get_products_delta.products;
    // products = [products[5]];
  }

  const addToCart = (id) => {
    setLatestCartChangedId(id);
    setSnackBarVisible(true);
    setTimeout(() => {
      setSnackBarVisible(false);
    }, 3000);
    console.log(id, cartItems[id],'added to cart');
    if(cartItems[id]==0){
      setCartItems({...cartItems,[id]:1});
      setSnackBarText("Added to Cart");
    }
    else{
      setCartItems({...cartItems,[id]:0});
      setSnackBarText("Removed from Cart");
      // setReRenderProducts(!reRenderProducts)
    }
    console.log(id, cartItems[id],'added to cart');
    setReRenderProducts(!reRenderProducts)
  };


  return (
    <View>
      <FlatList
        onRefresh={() => {}}
        refreshing={loading}
        data={products}
        keyExtractor={(item) => item.id}
        extraData={reRenderProducts}
        renderItem={(itemData) => (
          <ProductItem
            // image={itemData.item.image}
            image="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/10456354/2019/8/22/d56e75f6-f1a7-4fdd-b430-51befb36f88d1566454760527-Campus-Sutra-Men-Colourblocked-Casual-Spread-Shirt-290156645-1.jpg"
            title={itemData.item.display_name}
            price={itemData.item.price}
            brand_name={itemData.item.brand_name}
            is_available={itemData.item.is_available}
            points_rate={itemData.item.points_rate}
            id={itemData.item.id}
            onSelect={() => {
              // selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          >
            {/* <Entypo name="shopping-cart" size={25} color={Colors.primary} /> */}
            <View style={{ flexDirection: "row", right: 5 }}>
              {cartItems[itemData.item.id] == 0 ? (
                <EvilIcons
                  name="cart"
                  size={40}
                  color={Colors.primary}
                  onPress={() => addToCart(itemData.item.id)}
                />
              ) : (
                <Entypo name="shopping-cart" size={32} onPress={() => addToCart(itemData.item.id)} color={Colors.primary} />
              )}
              <MaterialIcons
                name="favorite-outline"
                size={30}
                color={Colors.red}
              />
            </View>
            {/* <MaterialIcons name="favorite" size={24} color={Colors.red} /> */}
          </ProductItem>
        )}
      />
    <Snackbar
        visible={snackBarVisible}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Dissmiss",
          onPress: onDismissSnackBar,
        },
        {
          label: "UNDO",
          onPress: () => setTimeout(() => {
              setSnackBarVisible(false);
              addToCart(latestCartChangedId)
            },1500),
          color:"#f0ad4e"
        }
      }
      >
        {snackBarText}
      </Snackbar>

    </View>
  );
};

export default Home;

Home.navigationOptions = (navData) => {
    return {
      headerTitle: 'All Products',
      headerRight: (
        <EvilIcons
          name="cart"
          size={40}
          color="white"
          onPress={() => navData.navigation.navigate('Cart')}
        />
      ),
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: Colors.primary,
      },  
    };
}

const styles = StyleSheet.create({});
