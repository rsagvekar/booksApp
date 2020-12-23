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
            // db.transaction((tx) => {
            //     tx.executeSql(
            //         'SELECT * FROM books',
            //         [],
            //         (tx, results) => {
            //             var temp = [];
            //             for (let i = 0; i < results.rows.length; ++i)
            //                 temp.push(results.rows.item(i));
            //                 setAllBooks(temp);
            //         }
            //     );
            // });


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
                  txn.executeSql('DROP TABLE IF EXISTS books', []);
                  txn.executeSql(
                    'CREATE TABLE IF NOT EXISTS books(srno INTEGER PRIMARY KEY AUTOINCREMENT, id VARCHAR(20), name VARCHAR(500),  img VARCHAR(255), author VARCHAR(50), category VARCHAR(20), language VARCHAR(20), pages VARCHAR(20), desc VARCHAR(1000), source VARCHAR(200))',
                    []
                  );
                  db.transaction(function (tx) {
                    tx.executeSql(
                      'INSERT INTO books (id, name, img, author, category, language, pages, desc, source) VALUES (?,?,?,?,?,?,?,?,?)',
                      [ "N2", "Emma", "https://library.manybooks.net/live/read-book/121571/158/cover_image.jpg", " Jane Austen", "Novel", "English", "381", "The main character, Emma Woodhouse, is described in the opening paragraph as ''handsome, clever, and rich'' but is also rather spoiled. As a result of the recent marriage of her former governess, Emma prides herself on her ability to matchmake, and proceeds to take under her wing an illegitimate orphan, Harriet Smith, whom she hopes to marry off to the vicar, Mr Elton. So confident is she that she persuades Harriet to reject a proposal from a young farmer who is a much more suitable partner for the girl.", "https://drive.google.com/file/d/1h6V-2BCynagEF3Zt98Ao26iup02fIb7K/view?usp=sharing" ],
                      (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            console.log("added");
                            //ToastAndroid.show("Bookmark Added", ToastAndroid.SHORT);
                        } else {
                            console.log("error");
                        }//ToastAndroid.show("Failed to add bookmark", ToastAndroid.SHORT);
                      }
                    );
                  });
                  db.transaction(function (tx) {
                    tx.executeSql(
                      'INSERT INTO books (id, name, img, author, category, language, pages, desc, source) VALUES (?,?,?,?,?,?,?,?,?)',
                      [ "N1", "Fast as the Wind", "https://library.manybooks.net/live/read-book/150463/35618/OEBPS/@public@vhost@g@gutenberg@html@files@35618@35618-h@images@cover.jpg", "Nat Gould", "Novel", "English", "173", "Yet another of Gould's splendid stories of love, adventure and horse racing.", "https://drive.google.com/file/d/1sPs5cxl4pR6DdQ_EWst5ZJjJghZm7unk/view?usp=sharing" ],
                      (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            console.log("added");
                            //ToastAndroid.show("Bookmark Added", ToastAndroid.SHORT);
                        } else {
                            console.log("error");
                        }//ToastAndroid.show("Failed to add bookmark", ToastAndroid.SHORT);
                      }
                    );
                  });
                  db.transaction(function (tx) {
                    tx.executeSql(
                      'INSERT INTO books (id, name, img, author, category, language, pages, desc, source) VALUES (?,?,?,?,?,?,?,?,?)',
                      [ "R2", "Healing The Heart", "https://library.manybooks.net/live/read-book/151703/empty/OEBPS/Images/cover.png", "Laura Scott", "Romance", "English", "57", "Dr. Gabe Allen has a rule about dating colleagues but when he meets ER nurse Larissa Brockman he's tempted to break his vow. Larissa's faith draws him back to the church he'd left behind, but when their lives are on the line Gabe discovers that Larissa is the one who needs to learn about the true meaning of forgiveness. And only Gabe can help heal her heart.", "https://drive.google.com/file/d/1hrlUpXuEKxQc90MTR3qxpnkZcYsQ7j-X/view?usp=sharing" ],
                      (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            console.log("added");
                            //ToastAndroid.show("Bookmark Added", ToastAndroid.SHORT);
                        } else {
                            console.log("error");
                        }//ToastAndroid.show("Failed to add bookmark", ToastAndroid.SHORT);
                      }
                    );
                  });
                  db.transaction(function (tx) {
                    tx.executeSql(
                      'INSERT INTO books (id, name, img, author, category, language, pages, desc, source) VALUES (?,?,?,?,?,?,?,?,?)',
                      [ "R1", "Pride and Prejudice", "https://library.manybooks.net/live/read-book/121576/1342/cover_image.jpg", " Jane Austen", "Romance", "English", "315", "Austen's finest comedy of manners portrays life in the genteel rural society of the early 1800s, and tells of the initial misunderstandings (and mutual enlightenment) between lively and quick witted Elizabeth Bennet and the haughty Mr. Darcy.", "https://drive.google.com/file/d/1HI-OB6D1Dq3LiNWlKf8NLVxTRfOxAk2D/view?usp=sharing","https://drive.google.com/file/d/1HI-OB6D1Dq3LiNWlKf8NLVxTRfOxAk2D/view?usp=sharing" ],
                      (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            console.log("added");
                            //ToastAndroid.show("Bookmark Added", ToastAndroid.SHORT);
                        } else {
                            console.log("error");
                        }//ToastAndroid.show("Failed to add bookmark", ToastAndroid.SHORT);
                      }
                    );
                  });
                  db.transaction(function (tx) {
                    tx.executeSql(
                      'INSERT INTO books (id, name, img, author, category, language, pages, desc, source) VALUES (?,?,?,?,?,?,?,?,?)',
                      [ "M1", "The After House", "https://library.manybooks.net/live/read-book/126529/2358/cover_image.jpg", " Mary Roberts Rinehart", "Mystery", "English", "165", "\"An astonishing story of love and mystery, which equals if not surpasses in interest those other lively stories of Mrs. Rinehart's. The novel is one of the sprightliest of the season and will add to the author's reputation as an inventor of 'queer' plots.\" — Philadelphia Record.", "https://drive.google.com/file/d/1te8urEqHFxctExQygsc61ICSCRVtb0sW/view?usp=sharing" ],
                      (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            console.log("added");
                            //ToastAndroid.show("Bookmark Added", ToastAndroid.SHORT);
                        } else {
                            console.log("error");
                        }//ToastAndroid.show("Failed to add bookmark", ToastAndroid.SHORT);
                      }
                    );
                  });
                  db.transaction(function (tx) {
                    tx.executeSql(
                      'INSERT INTO books (id, name, img, author, category, language, pages, desc, source) VALUES (?,?,?,?,?,?,?,?,?)',
                      [ "A1", "The Call of the Wild", "https://library.manybooks.net/live/read-book/125140/215/cover_image.jpg", " Jack London", "Action", "English", "78", "A domesticated and pampered dog's primordial instincts return when events find him serving as a sled dog in the treacherous, frigid Yukon during the hey-days of the 19th century Gold Rush.", "https://drive.google.com/file/d/1yepscAX8mVk9IPUSJrgMALeUuy2W5Mfd/view?usp=sharing" ],
                      (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            console.log("added");
                            //ToastAndroid.show("Bookmark Added", ToastAndroid.SHORT);
                        } else {
                            console.log("error");
                        }//ToastAndroid.show("Failed to add bookmark", ToastAndroid.SHORT);
                      }
                    );
                  });
                  db.transaction(function (tx) {
                    tx.executeSql(
                      'INSERT INTO books (id, name, img, author, category, language, pages, desc, source) VALUES (?,?,?,?,?,?,?,?,?)',
                      [ "M2", "The Demon Girl", "https://library.manybooks.net/live/read-book/149132/empty/cover_image.jpg", " Penelope Fletcher", "Mystery", "English", "208", "Rae Wilder has problems. Plunged into a world of dark magic, fierce creatures and ritual sacrifice, she is charged with a guarding a magical amulet. Rae finds herself beaten up, repeatedly, and forced to make a choice: to live and die human, or embrace her birth-right and wield magics that could turn her into something wicked, a force of nature nothing can control. ", "https://drive.google.com/file/d/1_Nr9OVb5VynjL7ihTiWzMyApOd4ELEo2/view?usp=sharing" ],
                      (tx, results) => {
                        console.log('Results', results.rowsAffected);
                        if (results.rowsAffected > 0) {
                            console.log("added");
                            //ToastAndroid.show("Bookmark Added", ToastAndroid.SHORT);
                        } else {
                            console.log("error");
                        }//ToastAndroid.show("Failed to add bookmark", ToastAndroid.SHORT);
                      }
                    );
                  });
                  
                }
              }
            );
          });

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
