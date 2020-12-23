import React, {useState, useEffect} from 'react';
import { View, Text, Button, FlatList, ToastAndroid} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

import DropDownPicker from 'react-native-dropdown-picker';

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



var db = openDatabase({ name: 'UserDatabase.db' });

const search = ({navigation}) => {
    const [allbooks, setAllBooks] = useState([]);
    const [getScrollPosition, setScrollPosition] = useState(0);
    const[ cat, setCat] = useState('');

    

    //console.warn(allbooks);
    const getItem = (val) => {
        // var temp = [];
        // db.transaction((tx) => {
        //     tx.executeSql(
        //         'SELECT * FROM books where category = ?',
        //         [val],
        //         (tx, results) => {
        //             var temp = [];
        //             for (let i = 0; i < results.rows.length; ++i)
        //                 temp.push(results.rows.item(i));
        //                 setAllBooks(temp);
        //         }
        //     );
        // });   

        try {
            firebase
                .database()
                .ref('Books')
                .on('value', (dataSnapShot) => {
                    let books = [];
                    dataSnapShot.forEach((child) => {
                        if (val === child.val().cat) {
                            books.push({
                                id: child.val().id,
                                name: child.val().name,
                                img: child.val().img,
                                author: child.val().author,
                                cat: child.val().cat,
                                lang: child.val().lang,
                                pages: child.val().pages,
                                desc: child.val().desc,
                                source: child.val().source
                            });
                        }
                    });
    
                    setAllBooks(books);
                });
        } catch (error) {
            alert(error);
        }
    };

    const getOpacity = () => {
        if (deviceHeight < smallDeviceHeight) {
            return deviceHeight / 4;
        }
        else {
            return deviceHeight / 6;
        }
    };

    const nameTap = (id, img, name, author, category, lang, pages, desc, source) => {
        navigation.navigate("BookDetail", {
            id,
            name,
            img,
            author,
            category, 
            lang,
            pages,
            desc,
            source
            

        });
    };

    const imgTap = (img, name) => { 
        
        navigation.navigate("ShowFullImg", {
            name,
            img: img
        })
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
        <View style={{flex:1, backgroundColor: '#f08215'}}>
            <Text style={{fontSize:20, fontWeight: "bold", marginTop: 10, marginLeft: 155, marginBottom: 5}}>Category</Text>
            <DropDownPicker
                items={[
                    { label: 'Romance', value: 'Romance' },
                    { label: 'Novel', value: 'Novel' },
                    { label: 'Mystery', value: 'Mystery' },
                    { label: 'Action', value: 'Action' },
                ]}
                defaultIndex={0}
                containerStyle={{ height: 40 }}
                onChangeItem={item => getItem(item.value)}
            />
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
            


        </View>
    );
};

export default search;
