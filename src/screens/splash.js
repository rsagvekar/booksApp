import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Image } from 'react-native';
import { getAsyncStorage } from '../asyncStorage';
import { keys, setAsyncStorage } from '../asyncStorage/index'
import { color, globalStyle } from '../utility';
import { setUniqueValue } from '../utility/constants';

const Splash = ({ navigation }) => {
    const [gifs, setGifs] = useState([]);
    const [term, updateTerm] = useState('loading');
    const url = 'http://api.giphy.com/v1/gifs/search?api_key=4tnuP2OLe9SQYMKVlcv3Y38a0qRYbK7B&limit=1&q=books';

    useEffect(() => {
        setTimeout(async() => {
            try {
                const API_KEY = '4tnuP2OLe9SQYMKVlcv3Y38a0qRYbK7B';
                const BASE_URL = 'http://api.giphy.com/v1/gifs/search';
                const resJson = await fetch(`${BASE_URL}?api_key=${API_KEY}&q=${term}`);
                const res = await resJson.json();
                setGifs(res.data);
            } catch (error) {
                console.warn(error);
            }
        }, 5000);
        
        const redirect = setTimeout(() => {
            getAsyncStorage(keys.uuid)
                .then((uuid) => {
                    if (uuid) {
                        setUniqueValue(uuid)
                        navigation.navigate("Home");
                    }
                    else {
                        navigation.navigate("Login");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    navigation.navigate("Login")
                });
        }, 3000);
        return () => clearTimeout(redirect);
    }, [navigation]);

    return (
        <View style={[globalStyle.containerCentered, { backgroundColor: color.BLACK }]}>
            <Image
                resizeMode='contain'
                style={styles.image}
                source={{ uri: 'https://media2.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif' }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    view: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'darkblue'
    },
    textInput: {
        width: '100%',
        height: 50,
        color: 'white'
    },
    image: {
        width: 300,
        height: 150,
        borderWidth: 3,
        marginBottom: 5
    },
});

export default Splash;