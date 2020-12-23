import React, { useLayoutEffect, useState } from "react";
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Image,
    ScrollView,
    Animated,
    ToastAndroid
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { keys, setAsyncStorage } from '../asyncStorage/index'
import { UpdateUser } from '../network';
import { FONTS, COLORS, SIZES, icons } from "../constants";
import { color } from '../utility';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'UserDatabase.db' });

const LineDivider = () => {
    return (
        <View style={{ width: 1, paddingVertical: 5 }}>
            <View style={{ flex: 1, borderLeftColor: COLORS.lightGray2, borderLeftWidth: 1 }}></View>
        </View>
    )
}

const BookDetail = ({ route, navigation }) => {

    const { params } = route;
    const { id, name, img, author, cat, lang, pages, desc, source } = params;
    // let all = id + ' ' + name + ' ' + img + ' ' + author + ' ' + cat + ' ' + lang + ' ' + pages + ' ' + desc + ' ' + source;
    // alert(all);
    const [userToken, setUserToken] = useState('');
    const [title, setTitle] = useState(name);
    const [file, setFile] = useState(source);
    const [book, setBook] = React.useState(null);

    const [scrollViewWholeHeight, setScrollViewWholeHeight] = React.useState(1);
    const [scrollViewVisibleHeight, setScrollViewVisibleHeight] = React.useState(0);

    const indicator = new Animated.Value(0);

    const readFile = () => {
        navigation.navigate("Read", { title, file });
    };

    const bookmark = () => {

        db.transaction((tx) => {
            tx.executeSql(
              'SELECT * FROM bookmarks where id = ?',
              [id],
              (tx, results) => {
                var len = results.rows.length;
                console.log('len', len);
                if (len > 0) {
                  //setUserData(results.rows.item(0));
                  db.transaction((tx) => {
                    tx.executeSql(
                      'DELETE FROM  bookmarks where id=?',
                      [id],
                      (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            ToastAndroid.show("Bookmark Deleted", ToastAndroid.SHORT);
                        } else {
                            ToastAndroid.show("Failed to delete bookmark", ToastAndroid.SHORT);
                        }
                      }
                    );
                  });
                } else {
                    db.transaction(function (tx) {
                        tx.executeSql(
                          'INSERT INTO bookmarks (id, name, img, author, category, language, pages, desc, source) VALUES (?,?,?,?,?,?,?,?,?)',
                          [ id, name, img, author, cat, lang, pages, desc, source ],
                          (tx, results) => {
                            console.log('Results', results.rowsAffected);
                            if (results.rowsAffected > 0) {
                                ToastAndroid.show("Bookmark Added", ToastAndroid.SHORT);
                            } else ToastAndroid.show("Failed to add bookmark", ToastAndroid.SHORT);
                          }
                        );
                      });
                }
              }
            );
          });
        

    };

    React.useEffect(() => {
        try {
            let UT;
            setTimeout(async () => {
                UT = await AsyncStorage.getItem(keys.uuid);
                setUserToken(UT);
            }, 5000)

        } catch (error) {

        }
    }, []);


    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <MaterialIcons
                    name="bookmark-border"
                    size={26}
                    color="white"
                    style={{ right: 10 }}
                    onPress={() => navigation.navigate("Bookmark")}
                />
            )
        })

    }, [navigation]);

    function renderBookInfoSection() {
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={{ uri: img }}
                    resizeMode="cover"
                    blurRadius={4}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }}
                />


                {/* Navigation header */}
                <View style={{ flexDirection: 'row', paddingHorizontal: SIZES.radius, height: 80, alignItems: 'flex-end' }}>
                    <TouchableOpacity
                        style={{ marginLeft: SIZES.base }}
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={icons.back_arrow_icon}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: color.WHITE
                            }}
                        />
                    </TouchableOpacity>
                </View>

                {/* Book Cover */}
                <View style={{ flex: 5, alignItems: 'center' }}>
                    <Image
                        source={{ uri: img }}
                        resizeMode="contain"
                        style={{
                            flex: 1,
                            width: 200,
                            height: "auto"
                        }}
                    />
                </View>

                {/* Book Name and Author */}
                <View style={{ flex: 1.8, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ ...FONTS.h2, color: color.BLACK }}>{name}</Text>
                    <Text style={{ ...FONTS.body3, color: color.BLACK }}>{author}</Text>
                </View>

                {/* Book Info */}
                <View
                    style={{
                        flexDirection: 'row',
                        paddingVertical: 20,
                        margin: SIZES.padding,
                        borderRadius: SIZES.radius,
                        backgroundColor: "rgba(0,0,0,0.3)"
                    }}
                >

                    <LineDivider />

                    {/* Pages */}
                    {/* Rating */}
                    <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.white }}>Pages</Text>
                        <Text style={{ ...FONTS.h3, color: COLORS.white }}>{pages}</Text>
                        
                    </View>

                    <LineDivider />

                    {/* Pages */}
                    <View style={{ flex: 1, paddingHorizontal: SIZES.radius, alignItems: 'center' }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.white }}>Language</Text>
                        <Text style={{ ...FONTS.h3, color: COLORS.white }}>{lang}</Text>
                        
                    </View>

                    <LineDivider />

                    {/* Language */}
                    <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ ...FONTS.body4, color: COLORS.white }}>Category</Text>
                        <Text style={{ ...FONTS.h3, color: COLORS.white }}>{cat}</Text>
                        
                    </View>
                </View>
            </View>
        )
    }

    function renderBookDescription() {

        const indicatorSize = scrollViewWholeHeight > scrollViewVisibleHeight ? scrollViewVisibleHeight * scrollViewVisibleHeight / scrollViewWholeHeight : scrollViewVisibleHeight

        const difference = scrollViewVisibleHeight > indicatorSize ? scrollViewVisibleHeight - indicatorSize : 1

        return (
            <View style={{ flex: 1, flexDirection: 'row', padding: SIZES.padding }}>
                {/* Custom Scrollbar */}
                <View style={{ width: 4, height: "100%", backgroundColor: COLORS.gray1 }}>
                    <Animated.View
                        style={{
                            width: 4,
                            height: indicatorSize,
                            backgroundColor: COLORS.lightGray4,
                            transform: [{
                                translateY: Animated.multiply(indicator, scrollViewVisibleHeight / scrollViewWholeHeight).interpolate({
                                    inputRange: [0, difference],
                                    outputRange: [0, difference],
                                    extrapolate: 'clamp'
                                })
                            }]
                        }}
                    />
                </View>

                {/* Description */}
                <ScrollView
                    contentContainerStyle={{ paddingLeft: SIZES.padding2 }}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onContentSizeChange={(width, height) => {
                        setScrollViewWholeHeight(height)
                    }}
                    onLayout={({ nativeEvent: { layout: { x, y, width, height } } }) => {
                        setScrollViewVisibleHeight(height)
                    }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: indicator } } }],
                        { useNativeDriver: false }
                    )}
                >
                    <Text style={{ ...FONTS.h2, color: COLORS.white, marginBottom: SIZES.padding }}>Description</Text>
                    <Text style={{ ...FONTS.body2, color: COLORS.lightGray }}>{desc}</Text>

                </ScrollView>
            </View>
        )
    }

    function renderBottomButton() {
        return (

            <View style={{ flex: 1, flexDirection: 'row' }}>

                {/* Bookmark */}
                <TouchableOpacity
                    style={{
                        width: 60,
                        backgroundColor: COLORS.secondary,
                        marginLeft: SIZES.padding,
                        marginVertical: SIZES.base,
                        borderRadius: SIZES.radius,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => bookmark()}
                >
                    <Image
                        source={icons.bookmark_icon}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: COLORS.lightGray2
                        }}
                    />
                </TouchableOpacity>

                {/* Start Reading */}
                {/* <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.primary,
                        marginHorizontal: SIZES.base,
                        marginVertical: SIZES.base,
                        borderRadius: SIZES.radius,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={() => readFile()}
                >
                    <Text style={{ ...FONTS.h3, color: COLORS.white }}>Start Reading</Text>
                </TouchableOpacity> */}
            </View>
        )
    }

    if (name) {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.black }}>
                {/* Book Cover Section */}
                <View style={{ flex: 4 }}>
                    {renderBookInfoSection()}
                </View>

                {/* Description */}
                <View style={{ flex: 2 }}>
                    {renderBookDescription()}
                </View>

                {/* Buttons */}
                <View style={{ height: 70, marginBottom: 30 }}>
                    {renderBottomButton()}
                </View>
            </View>
        )
    } else {
        return (<></>)
    }

}

export default BookDetail;