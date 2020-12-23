import React, { useContext, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Keyboard, Platform, TouchableWithoutFeedback } from 'react-native';

import * as Animatable from 'react-native-animatable';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';

import { color, globalStyle } from '../utility';
import RoundCornerButton from '../component/button/RoundCornerButton/index';
import InputField from '../component/input/index';
//import Logo from '../component/logo/index';
import { Store } from '../context/store';
import { LOADING_START, LOADING_STOP } from '../context/actions/type';
import { AddUser } from '../network';
import SignUpRequest from '../network/signUp/index'
import { keys, setAsyncStorage } from '../asyncStorage';
import { setUniqueValue, keyboardVerticalOffset } from '../utility/constants';
import firebase from '../firebase/config';

const signup = ({ navigation }) => {
    const globalState = useContext(Store);
    const { dispatchLoaderAction } = globalState;
    const [showLogo, toggleLogo] = useState(true);
    const [credentials, setcredentials] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [data, setData] = React.useState({
        name: '',
        email: '',
        mobile: '',
        gender: '',
        password: '',
        confirm_password: '',
        check_maleInputChange: false,
        check_femaleInputChange: false,
        check_mobileInputChange: false,
        check_genderInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });

    const nameInputChange = (val) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const reg1 = /^[0]?[789]\d{9}$/;
        var spe = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (val.length === 0) {
            setData({
                ...data,
                name: val,
                check_textInputChange: false
            });
        }
        else if (reg.test(val)) {
            setData({
                ...data,
                name: val,
                check_textInputChange: false
            });
        }
        else if (spe.test(val)) {
            setData({
                ...data,
                name: val,
                check_textInputChange: false
            });
        }
        else {
            setData({
                ...data,
                name: val,
                check_textInputChange: true
            });
        }
    }

    const handleEmailChange = (val) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(val) === false) {
            //console.log("Email is Not Correct");
            //setState({ email: val })
            setData({
                ...data,
                email: val,
                check_emailInputChange: false
            });
            return false;
        }
        else {
            setData({
                ...data,
                email: val,
                check_emailInputChange: true
            });
        }
    }

    const handleMobileChange = (val) => {
        const reg = /^[0]?[789]\d{9}$/;
        if (reg.test(val) === false) {
            setData({
                ...data,
                mobile: val,
                check_mobileInputChange: false
            });
            return false;
        } else {
            setData({
                ...data,
                mobile: val,
                check_mobileInputChange: true
            });
            return true;
        }
    }

    const handleGenderInputChange = (val) => {
        if (val.length !== 0 && val === 'M' || val === 'm') {
            setData({
                ...data,
                gender: val,
                check_maleInputChange: true,
                check_femaleInputChange: false
            });
        }
        else if (val.length !== 0 && val === 'F' || val === 'f') {
            setData({
                ...data,
                gender: val,
                check_femaleInputChange: true,
                check_maleInputChange: false,
            });
        }
        else {
            setData({
                ...data,
                gender: val,
                check_maleInputChange: false,
                check_femaleInputChange: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

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

    const onSignUpPress = async (name, email, password, confirmPassword) => {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const reg1 = /^[0]?[789]\d{9}$/;
        var spe = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        
        if (!name)
        {
            alert("Name is required")
        }

        else if (reg.test(email) === false)
        {
            alert("Enter valid email")
        }
        else if (!email)
        {
            alert("Email is required")
        }
        else if (password.length < 6) {
            alert("Password must contain minimum 6 characters");
        }
        else if (!password) {
            alert("Password is required")
        }
        else if (password !== confirmPassword) {
            alert("Password and Confirm Password did not match")
        }
        else {
            dispatchLoaderAction({
                type: LOADING_START,
            });

            SignUpRequest(email, password)
                .then((res) => {
                    
                    if (!res.additionalUserInfo) {
                        dispatchLoaderAction({
                            type: LOADING_STOP,
                        });
                        alert(res);
                        return;
                    }
                    
                    let uid = firebase.auth().currentUser.uid;
                    setAsyncStorage(keys.uuid, uid);
                    setUniqueValue(uid);
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                    
                    AddUser(name, email, uid)
                        .then(() => {
                            setAsyncStorage(keys.uuid, uid);
                            setUniqueValue(uid);
                            dispatchLoaderAction({
                                type: LOADING_STOP,
                            });
                            navigation.replace('Home');
                        })
                        .catch((err) => {
                            dispatchLoaderAction({
                                type: LOADING_STOP,
                            });
                            console.log("Add User", err);
                            alert(err);
                        })
                })
                .catch((err) => {
                    dispatchLoaderAction({
                        type: LOADING_STOP,
                    });
                    console.log("SignUp Req", err);
                    alert(err);
                })
        }

    };
    return (
        <KeyboardAvoidingView
            style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}
        //behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={-40}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={[globalStyle.flex1, { backgroundColor: color.WHITE }]}>
                    <View style={styles.container}>

                            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                                <Text style={styles.text_footer}>Name</Text>
                                <View style={styles.action}>
                                    <FontAwesome
                                        name="user-circle-o"
                                        color="white"
                                        size={20}
                                    />
                                    <TextInput
                                        placeholder="@Name"
                                        placeholderTextColor="white"
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        onChangeText={(val) => nameInputChange(val)}
                                    />
                                    {data.check_textInputChange ?
                                        <Animatable.View
                                            animation="bounceIn"
                                        >
                                            <FontAwesome
                                                name="check-circle"
                                                color="green"
                                                size={20}
                                            />
                                        </Animatable.View>
                                        : <Entypo name="circle-with-cross" size={24} color="red" />}
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: '#0b0064',
                                        borderBottomWidth: 1,
                                    }}
                                />
                                <Text style={[styles.text_footer, {
                                    marginTop: 15
                                }]}>Email</Text>
                                <View style={styles.action}>
                                    <Entypo
                                        name="email"
                                        size={20}
                                        color="white"
                                    />
                                    <TextInput
                                        placeholder="@Email"
                                        placeholderTextColor="white"
                                        //secureTextEntry={data.secureTextEntry ? true : false}
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        onChangeText={(val) => handleEmailChange(val)}
                                    />
                                    {data.check_emailInputChange ?
                                        <Animatable.View
                                            animation="bounceIn"
                                        >
                                            <FontAwesome
                                                name="check-circle"
                                                color="green"
                                                size={20}
                                            />
                                        </Animatable.View>
                                        : <Entypo name="circle-with-cross" size={24} color="red" />}
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: '#0b0064',
                                        borderBottomWidth: 1,
                                    }}
                                />
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
                                            <Feather
                                                name="eye-off"
                                                color="white"
                                                size={20}
                                            />
                                            :
                                            <Feather
                                                name="eye"
                                                color="white"
                                                size={20}
                                            />
                                        }
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: '#0b0064',
                                        borderBottomWidth: 1,
                                    }}
                                /><Text style={[styles.text_footer, {
                                    color: 'white',
                                    marginTop: 10
                                }]}>Confirm Password</Text>
                                <View style={styles.action}>
                                    <FontAwesome
                                        name="lock"
                                        color={'white'}
                                        size={20}
                                    />
                                    <TextInput
                                        placeholder="@Confirm Password"
                                        placeholderTextColor="white"
                                        style={styles.textInput}
                                        secureTextEntry={data.confirm_secureTextEntry ? true : false}
                                        autoCapitalize="none"
                                        onChangeText={(val) => handleConfirmPasswordChange(val)}
                                    />
                                    <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
                                        {data.confirm_secureTextEntry ?
                                            <Feather
                                                name="eye-off"
                                                color="white"
                                                size={20}
                                            />
                                            :
                                            <Feather
                                                name="eye"
                                                color="white"
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
                                        onPress={() => { onSignUpPress( data.name, data.email, data.password, data.confirm_password ) }}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.textSign, {
                                                color: 'white'
                                            }]}>                    Sign Up  </Text>
                                            <FontAwesome name="sign-in" size={24} color="white" />
                                            <Text>                      </Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.signIn, {
                                            backgroundColor: color.BRAND,
                                            borderWidth: 1,
                                            marginTop: 15
                                        }]}
                                        onPress={() => navigation.navigate("Login")}
                                    >
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.textSign, {
                                                color: 'white'
                                            }]}>                    Sign In    </Text>
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
        flex: 3,
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

export default signup;