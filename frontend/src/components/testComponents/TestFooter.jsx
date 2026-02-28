import { View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native'
import React from 'react'
import Colors from '../../../styles/Colors'
import { fonts } from '../../../styles/fonts'

export default function TestFooter({ havePrevious, haveNext, onNext, onPrevious }) {
  const { width } = useWindowDimensions();
  const isCompact = width < 640;

  return (
    <View style={[styles.container, isCompact ? styles.compactContainer : styles.regularContainer]}>
      <Pressable
        disabled={!havePrevious}
        onPress={onPrevious}
        style={[
          styles.btn,
          isCompact ? styles.compactBtn : styles.regularBtn,
          styles.previousBtn,
          !havePrevious && styles.disabledBtn,
        ]}
      >
        <Text style={[styles.buttonText, styles.previousBtnText]}>
          Previous
        </Text>
      </Pressable>

      <Pressable
        disabled={!haveNext}
        onPress={onNext}
        style={[
          styles.btn,
          isCompact ? styles.compactBtn : styles.regularBtn,
          styles.nextBtn,
          !haveNext && styles.disabledBtn,
        ]}
      >
        <Text style={[styles.buttonText, styles.nextBtnText]}>
          Next
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.borderColor,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  compactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  regularContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },

  btn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactBtn: {
    flex: 1,
  },
  regularBtn: {
    flex: 0,
    minWidth: 150,
    maxWidth: 170,
  },

  previousBtn: {
    backgroundColor: '#ddd',
  },

  nextBtn: {
    backgroundColor: Colors.primaryColor,
  },

  disabledBtn: {
    opacity: 0.5,
  },

  buttonText: {
    textAlign: 'center',
    fontFamily: fonts.medium,
    fontSize: 15,
  },

  previousBtnText: {
    color: '#000',
  },

  nextBtnText: {
    color: Colors.white,
  },
})
