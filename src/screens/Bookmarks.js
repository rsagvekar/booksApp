import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Alert, SafeAreaView, FlatList, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { smallDeviceHeight, uuid } from '../utility/constants';
import { ShowUsers } from '../component';
import { color, globalStyle } from '../utility';
import { Item } from 'native-base';
import { deviceHeight } from '../utility/styleHelper/appStyle';
import { keys, setAsyncStorage } from '../asyncStorage/index'
import { DeleteBookMark } from '../network';
import firebase from '../firebase/config';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'UserDatabase.db' });

const Bookmark = ({navigation}) => {

    const [getScrollPosition, setScrollPosition] = useState(0);

    const [allbooks, setAllBooks] = useState([]);
    const [userToken, setUserToken] = useState('');

    useEffect(() => {
        db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM bookmarks',
                [],
                (tx, results) => {
                    var temp = [];
                    for (let i = 0; i < results.rows.length; ++i)
                        temp.push(results.rows.item(i));
                        setAllBooks(temp);
                }
            );
        });
    }, []);

    const nameTap = (id, img, name, author, category, language, pages, desc, source) => {
        navigation.navigate("BookDetail", {
            id,
            name,
            img,
            author,
            category, 
            language,
            pages,
            desc,
            source
            

        });
    };

    const bookmark = (id, img, name, author, cat, lang, pages, desc, source) => {

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


    const getOpacity = () => {
        if (deviceHeight < smallDeviceHeight) {
            return deviceHeight / 4;
        }
        else {
            return deviceHeight / 6;
        }
    };

    return (
        <SafeAreaView style={[globalStyle.flex1, { backgroundColor: color.BLACK }]}>
            <FlatList
                alwaysBounceVertical={false}
                data={allbooks}
                keyExtractor={(_, index) => index.toString()}
                onScroll={(event) => setScrollPosition(event.nativeEvent.contentOffset.y)}
                ListHeaderComponent={
                    <View
                        style={{
                            opacity: getScrollPosition < getOpacity()
                                ?
                                (getOpacity() - getScrollPosition) / 100
                                :
                                0,
                        }}
                    >
                    </View>
                }
                renderItem={({ item }) => (
                    <ShowUsers
                        name={item.name}
                        img={item.img}
                        // onImgTap={() => imgTap(item.img, item.name)}
                        onNameTap={() => nameTap(item.id, item.img, item.name, item.author, item.category, item.language,
                            item.pages, item.desc, item.source
                        )}
                        bookmark={() => bookmark(item.id, item.img, item.name, item.author, item.category, item.language,
                            item.pages, item.desc, item.source
                        )}
                    />
                )}
            />

        </SafeAreaView>
    );
};

export default Bookmark;

// try {
            //     let UT;
            //     setTimeout(async () => {
            //         UT = await AsyncStorage.getItem(keys.uuid);
            //         setUserToken(UT);
            //     }, 5000)

            // } catch (error) {
            //     console.log(error);
            // }
            // firebase 
            //     .database()
            //     .ref('users/' + userToken + '/favorite')
            //     .on('value', (dataSnapShot) => {
            //         let books = [];
            //         dataSnapShot.forEach((child) => {
            //                 books.push({
            //                     id: child.val().id,
            //                     name: child.val().name,
            //                     img: child.val().img,
            //                 });
            //                 setAllBooks(books); 
            //                 console.log(books);       
            //         });
            //         console.warn("fav: ", allbooks);
            //     });
            //let [flatListItems, setFlatListItems] = useState([]);
