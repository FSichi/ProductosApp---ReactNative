/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { Background } from '../components/Background';
import { WhiteLogo } from '../components/WhiteLogo';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../themes/loginTheme';


interface Props extends StackScreenProps<any, any> { }

export const LoginScreen = ({ navigation }: Props) => {

    const { signIn, errorMessage, removeError } = useContext(AuthContext);

    const { email, password, onChange } = useForm({
        email: '',
        password: '',
    });

    useEffect(() => {

        if (errorMessage.length === 0) { return; }

        Alert.alert('Login Incorrecto', errorMessage, [{
            text: 'Ok',
            onPress: removeError,
        }]);

    }, [errorMessage]);


    const onLogin = () => {
        console.log(email, password);
        Keyboard.dismiss();

        signIn({ correo: email, password });
    };

    return (
        <>
            {/* Background */}
            <Background />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
            >

                <View style={loginStyles.formContainer}>

                    {/* Keyboard avoid view */}
                    <WhiteLogo />

                    <Text style={loginStyles.title}>Login</Text>

                    <Text style={loginStyles.label}>Email:</Text>
                    <TextInput
                        placeholder="Ingrese su Email"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        keyboardType="email-address"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS,
                        ]}
                        selectionColor="white"
                        autoCorrect={false}
                        autoCapitalize="none"

                        onSubmitEditing={onLogin}

                        value={email}
                        onChangeText={(value) => onChange(value, 'email')}
                    />

                    <Text style={loginStyles.label}>Password:</Text>
                    <TextInput
                        placeholder="*******"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        underlineColorAndroid="white"
                        secureTextEntry
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS,
                        ]}
                        selectionColor="white"
                        autoCorrect={false}
                        autoCapitalize="none"
                        onSubmitEditing={onLogin}

                        value={password}
                        onChangeText={(value) => onChange(value, 'password')}
                    />

                    {/* Boton Login */}

                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.button}
                            onPress={onLogin}
                        >
                            <Text style={loginStyles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Crear una Nueva Cuenta */}

                    <View style={loginStyles.newUserContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => navigation.replace('RegisterScreen')}
                        >
                            <Text style={loginStyles.buttonText}>Nueva Cuenta</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </KeyboardAvoidingView>

        </>
    );
};
