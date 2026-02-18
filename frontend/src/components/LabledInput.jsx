import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { AppBoldText, AppSemiBoldText } from '../../styles/fonts';
import Colors from '../../styles/Colors';

const LabeledInput = ({ label, value, onChangeText, placeholder , customInputStyles , inputType , defaultValue , labelStyle }) => {
  return (
    <View style={styles.container}>
      <AppSemiBoldText style={[styles.label,labelStyle]}>{label}</AppSemiBoldText>
      <TextInput
        style={[styles.input , customInputStyles]}
        onChangeText={text => onChangeText(text)}
        value={value}
        placeholderTextColor={'gray'}
        placeholder={placeholder}
        inputMode={inputType}
        defaultValue={defaultValue}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    // flexDirection : 'row',
    alignItems : 'center'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#E2E8F0',
    borderWidth: 1.5,
    paddingHorizontal: 10,
    borderRadius : 5,
    outlineColor : Colors.primaryColor
  },
});

export default LabeledInput;
