/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StackScreenProps } from '@react-navigation/stack';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { ProductsStackParams } from '../navigator/ProductsNavigator';
import { ProductsContext } from '../context/ProductsContext';
import { useCategories } from '../hooks/useCategories';
import { useForm } from '../hooks/useForm';

interface Props extends StackScreenProps<ProductsStackParams, 'ProductScreen'> { }

export const ProductScreen = ({ navigation, route: { params } }: Props) => {

    const { id = '', name = '' } = params;

    const [tempUri, setTempUri] = useState<string>('');
    const { categories, isLoading } = useCategories();
    const { loadProductById, addProduct, updateProduct, uploadImage } = useContext(ProductsContext);

    const { _id, categoriaId, nombre, img, onChange, setFormValue } = useForm({
        _id: id,
        categoriaId: '',
        nombre: name,
        img: '',
    });



    useEffect(() => {
        navigation.setOptions({
            title: (nombre) ? nombre : 'Nuevo Producto',
        });
    }, [nombre]);

    useEffect(() => {
        loadProduct();
    }, []);


    const loadProduct = async () => {
        if (id.length === 0) { return; }
        const product = await loadProductById(id);
        setFormValue({
            _id: id,
            categoriaId: product.categoria._id,
            img: product.img || '',
            nombre,
        });
    };

    const saveOrUpdate = async () => {
        if (id.length > 0) {
            updateProduct(categoriaId, nombre, id);
        } else {
            const tempCategoriaId = categoriaId || categories[0]._id;
            const newProduct = await addProduct(tempCategoriaId, nombre);
            onChange(newProduct._id, '_id');
        }
    };

    const takePhoto = () => {
        launchCamera({
            mediaType: 'photo',
            quality: 0.5,
        }, (resp) => {
            if (resp.didCancel) { return; }
            if (!resp.assets[0].uri) { return; }
            setTempUri(resp.assets[0].uri);
            uploadImage(resp, _id);
        });
    };

    const takePhotoFromGallery = () => {
        launchImageLibrary({
            mediaType: 'photo',
            quality: 0.5,
        }, (resp) => {
            if (resp.didCancel) { return; }
            if (!resp.assets[0].uri) { return; }
            setTempUri(resp.assets[0].uri);
            uploadImage(resp, _id);
        });
    };

    return (
        <View style={styles.container}>

            <ScrollView>

                <Text style={styles.label}>Nombre del Producto: </Text>
                <TextInput
                    placeholder="Producto"
                    placeholderTextColor={'grey'}
                    style={styles.textInput}
                    value={nombre}
                    onChangeText={(value) => onChange(value, 'nombre')}
                />

                {/* Picker / Selector */}
                <Text style={styles.label}>Categoria: </Text>
                <Picker
                    selectedValue={categoriaId}
                    onValueChange={(value) => onChange(value, 'categoriaId')}
                    style={{ marginBottom: 15, color: 'black' }}
                >
                    {categories?.map(c =>
                        <Picker.Item
                            label={c.nombre}
                            value={c._id}
                            key={c._id}
                        />
                    )}
                </Picker>

                <Button
                    title="Guardar"
                    onPress={saveOrUpdate}
                    color="#5856D6"
                />

                {
                    (_id.length > 0) &&
                    (
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                            <Button
                                title="Camara"
                                onPress={takePhoto}
                                color="#5856D6"
                            />

                            <View style={{ width: 10 }} />

                            <Button
                                title="Galeria"
                                onPress={takePhotoFromGallery}
                                color="#5856D6"
                            />
                        </View>
                    )
                }

                {
                    (img.length > 0 && !tempUri) &&
                    (<Image source={{ uri: img }} style={styles.imgProduct} />)
                }

                {
                    (tempUri) &&
                    (<Image source={{ uri: tempUri }} style={styles.imgProduct} />)
                }

            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20,
    },
    label: {
        marginVertical: 5,
        fontSize: 18,
        color: 'black',
    },
    textInput: {
        marginTop: 10,
        marginBottom: 15,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderColor: 'rgba(0,0,0,0.2)',
        height: 45,
    },
    imgProduct: {
        width: '100%',
        height: 300,
        marginTop: 20,
        borderRadius: 20,
    },
});
