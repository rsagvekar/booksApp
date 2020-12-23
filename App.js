import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { BookDetail } from "./src/screens";
import Tabs from "./src/navigation/tabs";
import Splash from "./src/screens/splash";
import { StoreProvider } from './src/context/store';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent"
    }
}

const Stack = createStackNavigator();

const App = () => {
    return (
      <StoreProvider>
        <NavigationContainer theme={theme}>
            <Tabs />
            {/* <Splash /> */}
        </NavigationContainer>
      </StoreProvider>
    )
}

export default App;