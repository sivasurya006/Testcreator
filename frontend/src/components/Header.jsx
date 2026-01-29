import { View, Text , StyleSheet } from 'react-native'
import Colors from '../../styles/Colors'
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.container}>
        <FontAwesome6 name='school' size={20} color={Colors.white} style={styles.appLogo}/>
        <Text style={styles.appName}>Test Creator</Text>
    </View>
  )
}


const styles = StyleSheet.create({
    container : {
        height: 60,
        flexDirection: 'row',
        backgroundColor:Colors.secondaryColor,
        alignItems : 'center',
        paddingLeft : 20,
        borderBottomWidth : 0.5,
        borderBottomColor : Colors.charcoal
    },
    appLogo : {
        marginRight : 10
    },
    appName : {
        fontSize : 20,
        color:Colors.white,
    },
   
});