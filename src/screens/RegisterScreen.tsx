import { StackScreenProps } from '@react-navigation/stack';
import React, { useContext, useEffect } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { WhiteLogo } from '../components/WhiteLogo';
import { useForm } from '../hooks/useForm';
import { loginStyles } from '../themes/loginTheme';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<any, any> { }


export const RegisterScreen = ({ navigation }: Props) => {

    const { signUp, errorMessage, removeError } = useContext(AuthContext);

    const { email, password, name, onChange } = useForm({
        name: '',
        email: '',
        password: '',
    });

    useEffect(() => {

        if (errorMessage.length === 0) { return; }

        Alert.alert('Registro Incorrecto', errorMessage, [{
            text: 'Ok',
            onPress: removeError,
        }]);

    }, [errorMessage]);

    const onRegister = () => {
        Keyboard.dismiss();
        signUp({ nombre: name, correo: email, password });
    };

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#5856D6' }}
                behavior={(Platform.OS === 'ios') ? 'padding' : 'height'}
            >

                <View style={loginStyles.formContainer}>

                    {/* Keyboard avoid view */}
                    <WhiteLogo />

                    <Text style={loginStyles.title}>Registro</Text>

                    <Text style={loginStyles.label}>Nombre:</Text>
                    <TextInput
                        placeholder="Ingrese su Nombre"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        underlineColorAndroid="white"
                        style={[
                            loginStyles.inputField,
                            (Platform.OS === 'ios') && loginStyles.inputFieldIOS,
                        ]}
                        selectionColor="white"
                        autoCorrect={false}
                        autoCapitalize="none"
                        onSubmitEditing={onRegister}

                        value={name}
                        onChangeText={(value) => onChange(value, 'name')}
                    />

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
                        onSubmitEditing={onRegister}

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
                        onSubmitEditing={onRegister}

                        value={password}
                        onChangeText={(value) => onChange(value, 'password')}
                    />

                    {/* Boton Login */}

                    <View style={loginStyles.buttonContainer}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.button}
                            onPress={onRegister}
                        >
                            <Text style={loginStyles.buttonText}>Crear Cuenta</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Crear una Nueva Cuenta */}

                    <TouchableOpacity
                        onPress={() => navigation.replace('LoginScreen')}
                        activeOpacity={0.8}
                        style={loginStyles.buttonReturn}
                    >
                        <Text style={loginStyles.buttonText}>Login</Text>
                    </TouchableOpacity>

                </View>

            </KeyboardAvoidingView>

        </>
    );
};
