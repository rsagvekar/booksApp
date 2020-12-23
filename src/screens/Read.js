import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

const Read = ({route, navigation}) => {
    const { params } = route;
    const { title, file } = params;
    

    return(
        <View>
            <WebView source={{ uri: file }} />
        </View>
    );
};

export default Read;