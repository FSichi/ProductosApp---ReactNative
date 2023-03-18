/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProductsContext } from '../context/ProductsContext';
import { StackScreenProps } from '@react-navigation/stack';
import { ProductsStackParams } from '../navigator/ProductsNavigator';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductsScreen'> { }

export const ProductsScreen = ({ navigation }: Props) => {

    const { products, loadProducts } = useContext(ProductsContext);

    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{ marginRight: 10 }}
                    onPress={() => navigation.navigate('ProductScreen', {})}
                >
                    <Text>Agregar</Text>
                </TouchableOpacity>
            ),
        });
    }, []);

    const loadProductsFromBackend = async () => {
        setIsRefreshing(true);
        await loadProducts();
        setIsRefreshing(false);
    };


    //TODO: Pull to Refresh.

    return (
        <View style={{ flex: 1, marginHorizontal: 10 }}>

            <FlatList
                style={{ marginTop: 10, marginBottom: 10 }}
                data={products}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.itemContainer}
                        onPress={
                            () => navigation.navigate('ProductScreen', {
                                id: item._id,
                                name: item.nombre,
                            })
                        }
                    >
                        <Text style={styles.productName}>{item.nombre}</Text>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={loadProductsFromBackend}
                    />
                }
            />

        </View>
    );
};

const styles = StyleSheet.create({
    productName: {
        fontSize: 20,
        marginLeft: 10,
        color: 'white',
    },
    itemContainer: {
        marginVertical: 5,
        backgroundColor: '#5856D6',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    itemSeparator: {
        borderBottomWidth: 2,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        marginVertical: 12,
    },
});
