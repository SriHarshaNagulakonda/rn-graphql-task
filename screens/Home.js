import React, { useState } from 'react'
import { StyleSheet, Text,Button, FlatList, View, ActivityIndicator, AsyncStorage } from 'react-native'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ProductItem from '../components/ProductItem'
import Colors from '../constants/Colors';
import { Entypo } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';


const FETCH_PRODUCTS = gql`
query{
    get_products_delta(last_updated: ""){
      last_updated
      products{
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
  }`


const Home = () => {

    const { loading, error, data } = useQuery(FETCH_PRODUCTS,{});
    const [isRefreshing, setIsRefreshing] = useState(false);
    var products = [];
    // if (!products) return null;

    if (error) {
        console.error(error);
        return <Text>Error</Text>;
    }

    if (loading) {
        console.log(loading,'loading')
        return <ActivityIndicator size={30} color="blue" />;
    }

    if(!loading) {
        products = data.get_products_delta.products;
    }
    
    
    return (
        <View>
          <FlatList
      onRefresh={() => {}}
      refreshing={loading}
      data={products}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <ProductItem
          // image={itemData.item.image}
          image="https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/10456354/2019/8/22/d56e75f6-f1a7-4fdd-b430-51befb36f88d1566454760527-Campus-Sutra-Men-Colourblocked-Casual-Spread-Shirt-290156645-1.jpg"
          title={itemData.item.display_name}
          price={itemData.item.price}
          brand_name={itemData.item.brand_name}
          is_available={itemData.item.is_available}
          points_rate={itemData.item.points_rate}
          onSelect={() => {
            // selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          {/* <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
            //   selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          /> */}
          {/* <Button
            color={Colors.primary}
            title={"To Cart"}
            onPress={() => {
            //   dispatch(cartActions.addToCart(itemData.item));
            }}
          /> */}
          <Entypo name="shopping-cart" size={25} color={Colors.primary} />
          <EvilIcons name="cart" size={30} color={Colors.primary} />
          <MaterialIcons name="favorite-outline" size={24} color={Colors.red} />
          <MaterialIcons name="favorite" size={24} color={Colors.red} />
        </ProductItem>
      )}
    />

        </View>
    )
}

export default Home

const styles = StyleSheet.create({})
