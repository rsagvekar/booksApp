import React from "react";
import {
    Image
} from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {createStackNavigator} from "@react-navigation/stack";

import { Home } from "../screens";
import ShowFullImg from '../screens/ShowFullImg';
import BookDetail from '../screens/BookDetail';
import Splash from '../screens/splash';
import Login from '../screens/login';
import SignUp from '../screens/signup';
import Bookmark from '../screens/Bookmarks';
import Search from '../screens/search';


import { icons, COLORS } from "../constants";
import {color} from "../utility";
import Read from "../screens/Read";

const Tab = createBottomTabNavigator();

const tabOptions = {
    showLabel: false,
    style: {
        height: "10%",
        backgroundColor: COLORS.black
    }
}

const HomeStack = createStackNavigator();
const HomeStackScreen = ({ navigation }) => (
    <HomeStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: color.BRAND
        },
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }}
    >
        <HomeStack.Screen name="Loading" component={Splash} 
        />
        <HomeStack.Screen name="Login" component={Login} 
        />
        <HomeStack.Screen name="SignUp" component={SignUp} 
        />
        <HomeStack.Screen name="Home" component={Home} options={{
            title: "Home",
        }}
        />
        <HomeStack.Screen name="ShowFullImg" component={ShowFullImg} 
        />
        <HomeStack.Screen name="BookDetail" component={BookDetail} 
        />
        <HomeStack.Screen name="Bookmark" component={Bookmark} 
        />

        
    </HomeStack.Navigator>
);

const SearchStack = createStackNavigator();
const SearchStackScreen = ({ navigation }) => (
    <SearchStack.Navigator screenOptions={{
        headerStyle: {
            backgroundColor: '#368dff'
        },
        headerTitleAlign: "center",
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold'
        }
    }}
    >
        <SearchStack.Screen name="Search" component={Search} options={{
            title: "Search",
        }} />
    </SearchStack.Navigator>
);

const Tabs = () => {
    return (
        <Tab.Navigator
            tabBarOptions={tabOptions}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    const tintColor = focused ? COLORS.white : COLORS.gray;

                    switch (route.name) {
                        case "Home":
                            return (
                                <Image
                                    source={icons.dashboard_icon}
                                    resizeMode="contain"
                                    style={{
                                        tintColor: tintColor,
                                        width: 25,
                                        height: 25
                                    }}
                                />
                            )

                        case "Search":
                            return (
                                <Image
                                    source={icons.search_icon}
                                    resizeMode="contain"
                                    style={{
                                        tintColor: tintColor,
                                        width: 25,
                                        height: 25
                                    }}
                                />
                            )

                        

                        
                    }
                }
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeStackScreen}
            />
            <Tab.Screen
                name="Search"
                component={SearchStackScreen}
            />
            
        </Tab.Navigator>
    )
}

export default Tabs;