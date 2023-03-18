import React, { createContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { Producto, ProductsResponse } from '../interfaces/appInterfaces';
import cafeApi from '../api/cafeApi';
import { ImagePickerResponse } from 'react-native-image-picker/lib/typescript/types';

type ProductsContextProps = {
    products: Producto[];
    loadProducts: () => Promise<void>;
    addProduct: (categoryId: string, productName: string) => Promise<Producto>;
    updateProduct: (categoryId: string, productName: string, productId: string) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>;
    loadProductById: (id: string) => Promise<Producto>;
    uploadImage: (data: any, id: string) => Promise<void>; // TODO: cambiar ANY
}

export const ProductsContext = createContext({} as ProductsContextProps);


export const ProductsProvider = ({ children }: any) => {

    const [products, setProducts] = useState<Producto[]>([]);

    useEffect(() => {
        loadProducts();
    }, []);


    const loadProducts = async () => {
        const resp = await cafeApi.get<ProductsResponse>('/productos?limite=50');
        // setProducts([...products, ...resp.data.productos]);
        setProducts([...resp.data.productos]);
    };

    const addProduct = async (categoryId: string, productName: string): Promise<Producto> => {

        const resp = await cafeApi.post<Producto>('/productos', {
            nombre: productName,
            categoria: categoryId,
        });
        setProducts([...products, resp.data]);

        Alert.alert('Producto Agregado Correctamente', '', [{
            text: 'Ok',
        }]);

        return resp.data;

    };

    const updateProduct = async (categoryId: string, productName: string, productId: string) => {

        const resp = await cafeApi.put<Producto>(`/productos/${productId}`, {
            nombre: productName,
            categoria: categoryId,
        });

        setProducts(products.map(prod => {
            return (prod._id === productId) ? resp.data : prod;
        }));

        Alert.alert('Producto Actualizado Correctamente', '', [{
            text: 'Ok',
        }]);

    };

    const deleteProduct = async (id: string) => {

    };

    const loadProductById = async (id: string): Promise<Producto> => {
        const resp = await cafeApi.get<Producto>(`/productos/${id}`);
        return resp.data;
    };

    // TODO: cambiar ANY
    const uploadImage = async (data: ImagePickerResponse, id: string) => {

        if (!data.assets) { return; }

        const params = {
            name: data.assets[0].fileName,
            type: data.assets[0].type,
            uri: Platform.OS === 'ios' ? data.assets![0].uri!.replace('file://', '') : data.assets![0].uri!,
        };

        const fileToUpload = JSON.parse(JSON.stringify(params));

        const formData = new FormData();
        formData.append('archivo', fileToUpload);

        try {
            await cafeApi.put(`/uploads/productos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.log(error);
        }

    };

    return (
        <ProductsContext.Provider
            value={{
                products,
                loadProducts,
                addProduct,
                updateProduct,
                deleteProduct,
                loadProductById,
                uploadImage,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
};
