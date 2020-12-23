import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';

import * as Animatable from 'react-native-animatable';

import { color, globalStyle } from '../utility';
import { InputField, RoundCornerButton } from '../component';
import { Store } from '../context/store';
import { LOADING_START, LOADING_STOP } from '../context/actions/type';
import loginRequest from '../network/login/index';
//import { keys, setAsyncStorage } from '../../asyncStorage';
import { keys, setAsyncStorage } from '../asyncStorage/index'
import { setUniqueValue, keyboardVerticalOffset } from '../utility/constants';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';

import AsyncStorage from '@react-native-community/async-storage';

const login = ({ navigation }) => {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;
    const [showLogo, toggleLogo] = useState(true);


    const [credentials, setcredentials] = useState({
        email: "",
        password: ""
    });
    const { email, password } = credentials;
    const handleOnChange = (name, value) => {
        setcredentials({
            ...credentials,
            [name]: value,
        })
    };

    const [data, setData] = React.useState({
        email: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const textInputChange = (val) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (val.length === 0) {
            setData({
                ...data,
                email: val,
                check_textInputChange: false
            });

        }
        else if (reg.test(val) === false) {
            //console.log("Email is Not Correct");
            //setState({ email: val })
            setData({
                ...data,
                email: val,
                check_textInputChange: false
            });
            return false;
        }
        else {
            setData({
                ...data,
                email: val,
                check_textInputChange: true
            });
        }
    };

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });

    };

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    };
    const onLoginPress = (email, password) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email) {
            alert("Email is required");
        }
        else if (reg.test(email) === false) {
            alert("Please Enter Valid Email");
        }
        else if (!password) {
            alert("Password is required")
        }
        else if (password.length < 6) {
            alert("Password must contain minimum 6 characters");
        }
        else if (email === 'admin@brandlock.io' && password === 'brandlock') {
            dispatchLoaderAction({
                type: LOADING_START,
            });
            setTimeout(() => {
                navigation.navigate("SignUp");
                dispatchLoaderAction({
                    type: LOADING_STOP,
                });
            }, 5000)


        }
        else {
            dispatchLoaderAction({
                type: LOADING_START,
            });
            loginRequest(email, password)
                .then((res) => {
                    if (!res.additionalUserInfo) {
                        dispatchLoaderAction({
                            type: LOADING_STOP,
                        });
                        alert(res);
                        return;
                    }

                    setAsyncStorage(keys.uuid, res.user.uid);
                    //console.warn("AsyncStorage: ",AsyncStorage);
                    setUniqueValue(res.user.uid);
                    //console.warn(res.user.uid);
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                    navigation.replace("Home");
                })
                .catch((err) => {
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                    alert(err);
                })
        }

    };
    // ON INPUT FOCUS

    const handleFocus = () => {
        setTimeout(() => {
            toggleLogo(false);
        }, 200);
    };
    // * ON INPUT BLUR

    const handleBlur = () => {
        setTimeout(() => {
            toggleLogo(true);
        }, 200);
    };


    return (
        <KeyboardAvoidingView
            style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
        //behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        //keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}>

                    <View style={styles.container}>
                        {/* <View style={styles.header, [globalStyle.containerCentered]}>
                            {
                                showLogo && (
                                    <View style={[globalStyle.containerCentered]}>
                                        <Logo />
                                    </View>
                                )
                            }
                        </View> */}
                        <Animatable.View style={styles.footer}
                            animation="fadeInUpBig"
                        >
                            <Text style={styles.text_footer}>Email</Text>
                            <View style={styles.action}>
                                <Entypo
                                    name="email"
                                    size={20}
                                    color="white"
                                />
                                <TextInput
                                    placeholder="@Email"
                                    placeholderTextColor="white"
                                    style={styles.textInput}
                                    autoCapitalize="none"
                                    onChangeText={(val) => textInputChange(val)}
                                />
                                {data.check_textInputChange ?
                                    <Animatable.View
                                        animation={'bounceIn'}
                                    >
                                        <FontAwesome
                                            name="check-circle"
                                            color="green"
                                            size={20}
                                        />
                                    </Animatable.View>
                                    : <Entypo name="circle-with-cross" size={24} color="red" />
                                }
                            </View>
                            <Text style={[styles.text_footer, {
                                color: 'white',
                                marginTop: 10
                            }]}>Password</Text>
                            <View style={styles.action}>
                                <FontAwesome
                                    name="lock"
                                    color={'white'}
                                    size={20}
                                />
                                <TextInput
                                    placeholder="@Password"
                                    placeholderTextColor="white"
                                    style={styles.textInput}
                                    secureTextEntry={data.secureTextEntry ? true : false}
                                    autoCapitalize="none"
                                    onChangeText={(val) => handlePasswordChange(val)}
                                />

                                <TouchableOpacity onPress={updateSecureTextEntry}>
                                    {data.secureTextEntry ?
                                        <FontAwesome
                                            name="eye-slash"
                                            color="grey"
                                            size={20}
                                        />
                                        :
                                        <FontAwesome
                                            name="eye"
                                            color="grey"
                                            size={20}
                                        />
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={styles.button}>
                            <TouchableOpacity
                                        style={[styles.signIn, {
                                            backgroundColor: color.BRAND,
                                            borderWidth: 1,
                                            marginTop: 15
                                        }]}
                                        onPress={() => { onLoginPress(data.email, data.password) }}
                                    >
                                {/* <TouchableOpacity style={styles.appButtonContainer} onPress={() => { onLoginPress(data.email, data.password) }}> */}
                                <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.textSign, {
                                                color: 'white'
                                            }]}>                    Sign In  </Text>
                                            <Octicons name="sign-in" size={24} color="white" />
                                            <Text>                      </Text>
                                        </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                        style={[styles.signIn, {
                                            backgroundColor: color.BRAND,
                                            borderWidth: 1,
                                            marginTop: 15
                                        }]}
                                        onPress={() => navigation.navigate("SignUp")}
                                    >
                                {/* <TouchableOpacity style={styles.appButtonContainer} onPress={() => { onLoginPress(data.email, data.password) }}> */}
                                <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.textSign, {
                                                color: 'white'
                                            }]}>                    Sign UP  </Text>
                                            <Octicons name="sign-in" size={24} color="white" />
                                            <Text>                      </Text>
                                        </View>
                            </TouchableOpacity>
                            </View>
                        </Animatable.View>

                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    appButtonContainer: {
        marginTop: 10,
        elevation: 8,
        backgroundColor: color.BRAND,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'black'
    },
    signUpButtonContainer: {
        marginTop: 10,
        elevation: 8,
        backgroundColor: "white",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: 'black'
    },
    signUpButtonText: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
        alignSelf: "center",

    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",

    },
    header: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingBottom: 50
    },
    footer: {
        flex: 1.5,
        backgroundColor: color.DARK_GRAY,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 30,

    },
    text_footer: {
        color: 'white',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: 'white',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 5
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default login;