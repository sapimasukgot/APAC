import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "../explore";
import index from "../index";
import LoadingScreenAwal from "../LoadingScreenAwal";
import Operation from "../Operation.jsx";


const Stack = createNativeStackNavigator();
export default function Awal(){
    return(
        <NavigationIndependentTree>
            <NavigationContainer>
                <TabNavigator />
                <Stack.Navigator 
                    initialRouteName="LoadingScreenAwal" 
                    screenOptions={{
                        headerShown: false  
                    }}
                >
                    <Stack.Screen name="LoadingScreenAwal" component={LoadingScreenAwal} />
                    <Stack.Screen name="index" component={index}/>
                    <Stack.Screen name="explore" component={LoginScreen} />
                    <Stack.Screen name="Operation" component={Operation}/>                    
                </Stack.Navigator>
            </NavigationContainer>
        </NavigationIndependentTree>
    )
}