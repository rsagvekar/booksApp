import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Alert, SafeAreaView, FlatList, ToastAndroid } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Store } from '../context/store';
import { LOADING_START, LOADING_STOP } from '../context/actions/type';
import firebase from '../firebase/config';
import { smallDeviceHeight, uuid} from '../utility/constants';
import { ShowUsers} from '../component';
import { color, globalStyle} from '../utility';
import { Item } from 'native-base';
import { deviceHeight} from '../utility/styleHelper/appStyle';
import { LogOutUser } from '../network';
import { clearAsyncStorage } from '../asyncStorage';
import { openDatabase } from 'react-native-sqlite-storage';

var db = openDatabase({ name: 'UserDatabase.db' });

const Home = ({ navigation }) => {

    const [getScrollPosition, setScrollPosition] = useState(0);

    const [allbooks, setAllBooks] = useState([]);

    useEffect(() => {
        try {
            // firebase
            //     .database()
            //     .ref('Books')
            //     .on('value', (dataSnapShot) => {
            //         let books = [];
            //         dataSnapShot.forEach((child) => {
            //                 books.push({
            //                     id: child.val().id,
            //                     name: child.val().name,
            //                     img: child.val().img,
            //                     author: child.val().author,
            //                     cat: child.val().cat,
            //                     lang: child.val().lang,
            //                     pages: child.val().pages,
            //                     desc: child.val().desc,
            //                     source: child.val().source
            //                 });
            //                 setAllBooks(books);
                            
            //         });
                    
                    
            //     });
            db.transaction((tx) => {
                tx.executeSql(
                    'SELECT * FROM books',
                    [],
                    (tx, results) => {
                        var temp = [];
                        for (let i = 0; i < results.rows.length; ++i)
                            temp.push(results.rows.item(i));
                            setAllBooks(temp);
                    }
                );
            });
        } catch (error) {
            alert(error);
        }
        db.transaction(function (txn) {
            txn.executeSql(
              "SELECT * FROM sqlite_master WHERE type='table' AND name='bookmarks'",
              [],
              function (tx, res) {
                console.log('item:', res.rows.length);
                if (res.rows.length == 0) {
                  txn.executeSql('DROP TABLE IF EXISTS bookmarks', []);
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS bookmarks(srno INTEGER PRIMARY KEY AUTOINCREMENT, id VARCHAR(20), name VARCHAR(500),  img VARCHAR(255), author VARCHAR(50), category VARCHAR(20), language VARCHAR(20), pages VARCHAR(20), desc VARCHAR(1000), source VARCHAR(200))',
                    []
                  );
                }
              }
            );
          });
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <MaterialIcons
                    name="logout"
                    size={26}
                    color="white"
                    style={{ right: 10 }}
                    onPress={() => Alert.alert("Logout", "Are you sure to logout ?", [
                        {
                            text: 'Yes',
                            onPress: () => logout(),
                        },
                        {
                            text: 'No'
                        }
                    ], {
                        cancelable: false
                    })}
                />
            )
        })

    }, [navigation]);

    const logout = () => {
        LogOutUser()
            .then(() => {
                clearAsyncStorage()
                    .then(() => {
                        navigation.navigate('Login');
                    })
                    .catch((err) => alert(err))
            })
            .catch((err) => alert(err))
    };

    // On Image Tap
    const imgTap = (img, name) => { 
        
        navigation.navigate("ShowFullImg", {
            name,
            img: img
        })
    };

    // ON NAME TAP
    const nameTap = (id, img, name, author, cat, lang, pages, desc, source) => {
        navigation.navigate("BookDetail", {
            id,
            name,
            img,
            author,
            cat, 
            lang,
            pages,
            desc,
            source
            

        });
    };


    // GET OPACITY
    const getOpacity = () => {
        if (deviceHeight < smallDeviceHeight) {
            return deviceHeight / 4;
        }
        else {
            return deviceHeight / 6;
        }
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

    return(
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
                    onImgTap={() => imgTap(item.img, item.name)}
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

export default Home;