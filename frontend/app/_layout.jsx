import {  Stack } from 'expo-router'
import AuthContextProvider from '../util/AuthContext'

export default function RootLayout() {
    return (
       <AuthContextProvider>
             <Stack screenOptions={{ headerShown: false , animation : 'fade' }} />
       </AuthContextProvider>
    )
}