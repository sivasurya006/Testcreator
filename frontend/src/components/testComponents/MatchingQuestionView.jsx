import { View, useWindowDimensions, StyleSheet, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import RenderHTML from 'react-native-render-html';
import { AppBoldText, AppMediumText } from '../../../styles/fonts';
import Colors from '../../../styles/Colors';
import { SimpleLineIcons } from '@expo/vector-icons';

export default function MatchingQuestionView({ question, selectedAnswers, setSelectedAnswers, preview = false }) {

  const lightMatchColors = [
    "#E3F2FD", // soft blue
    "#E8F5E9", // soft green
    "#FFF3E0", // soft orange
    "#F3E5F5", // soft purple
    "#E0F7FA", // soft cyan
    "#FCE4EC", // soft pink
    "#FFFDE7", // soft yellow
    "#ECEFF1"  // soft gray blue
  ];



  const { width } = useWindowDimensions();
  const isWide = width >= 600;
  const options = question.options;

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState({});
  const [usedColors, setUsedColors] = useState({});
  const [shuffledRight, setShuffledRight] = useState([]);
  const [answers, setAnswers] = useState([]);


  useEffect(() => {
    console.log(answers)
  }, [answers])

  // Initialize answers and restore saved selections when question changes
  useEffect(() => {
    const saved = selectedAnswers?.[question.questionId];
    const newMatchedPairs = {};
    const newUsedColors = {};
    const initialAnswers = options.map((o, idx) => {
      const savedAnswer = saved ? saved[idx] : null;
      if (savedAnswer && savedAnswer.selectedRightIndex !== undefined) {
        newMatchedPairs[idx] = savedAnswer.selectedRightIndex;
        newUsedColors[idx] = savedAnswer.pairColor;
        newUsedColors["right-" + savedAnswer.selectedRightIndex] = savedAnswer.pairColor;
        return {
          optionId: o.optionId,
          selectedRightIndex: savedAnswer.selectedRightIndex,
          pairColor: savedAnswer.pairColor
        };
      }
      return { optionId: o.optionId, selectedRightIndex: undefined, pairColor: '' };
    });

    setMatchedPairs(newMatchedPairs);
    setUsedColors(newUsedColors);
    setAnswers(initialAnswers);
    setSelectedLeft(null);
    // maintain original right order instead of shuffling
    setShuffledRight(options.map((item, index) => ({ ...item, originalIndex: index })));
  }, [question.questionId, selectedAnswers]);

  // right items remain in their original order; no random shuffle needed
  // function shuffleRight() { ... } removed


  function handleLeft(index) {
    if (matchedPairs[index] !== undefined) return;
    setSelectedLeft(index);
  }

  function handleRight(rightItem) {
    if (selectedLeft === null) return;
    if (matchedPairs[selectedLeft] !== undefined) return;

    const alreadyUsed = Object.values(matchedPairs).includes(rightItem.originalIndex);
    if (alreadyUsed) return;

    const color = lightMatchColors[Object.keys(matchedPairs).length % lightMatchColors.length];


    const newMatchedPairs = { ...matchedPairs };
    newMatchedPairs[selectedLeft] = rightItem.originalIndex;
    setMatchedPairs(newMatchedPairs);

    const newUsedColors = { ...usedColors };
    newUsedColors[selectedLeft] = color;
    newUsedColors["right-" + rightItem.originalIndex] = color;
    setUsedColors(newUsedColors);

    const newAnswers = [...answers];
    newAnswers[selectedLeft] = {
      optionId: options[selectedLeft].optionId,
      selectedRightIndex: rightItem.originalIndex,
      pairColor: color,
      matchingOptionProperties: {
        match: options[rightItem.originalIndex].matchingOptionProperties.match
      }
    };
    setAnswers(newAnswers);


    setSelectedAnswers({
      ...selectedAnswers,
      [question.questionId]: newAnswers
    });

    setSelectedLeft(null);
  }

  function handleReset() {
    setMatchedPairs({});
    setUsedColors({});
    setAnswers(options.map(o => ({ optionId: o.optionId, selectedRightIndex: undefined, pairColor: '' })));
    setSelectedLeft(null);
    // maintain original right ordering on reset
    setShuffledRight(options.map((item, index) => ({ ...item, originalIndex: index })));
    setSelectedAnswers({
      ...selectedAnswers,
      [question.questionId]: options.map(o => ({ optionId: o.optionId, selectedRightIndex: undefined, pairColor: '' }))
    });
  }

  // reorder feature removed per user request


  return (
    <View>
      <View style={styles.topBar}>
        <Pressable onPress={handleReset} style={styles.refreshBtn}>
          <AppMediumText style={{ color: 'white', fontWeight: 'bold', marginRight: 8 }}>Reset</AppMediumText>
          <SimpleLineIcons name="refresh" size={20} />
        </Pressable>
      </View>

      {/* Question */}
      <RenderHTML
        contentWidth={width - 40}
        source={{ html: question.questionText }}
        baseStyle={styles.htmlText}
      />


      <View style={[styles.container, isWide ? styles.row : styles.column]}>

        <View style={isWide ? { marginRight: 12 } : { marginBottom: 12, width: '100%' }}>
          {options.map((opt, index) => {
            const isMatched = matchedPairs[index] !== undefined;
            const pairColor = usedColors[index];

            return (
              <Pressable
                key={index}
                style={[
                  styles.box,
                  selectedLeft === index && styles.selectedBox,
                  isMatched && { backgroundColor: pairColor }
                ]}
                onPress={() => handleLeft(index)}
              >
                <AppMediumText style={[
                  styles.centerText,
                  (isMatched || selectedLeft === index) && {
                    color: '#0F172A',
                    fontWeight: '600'
                  }
                ]}>
                  {opt.optionText}
                </AppMediumText>
              </Pressable>
            );
          })}
        </View>
        <View style={isWide ? { marginRight: 12 } : { marginBottom: 12, width: '100%' }}>
          {shuffledRight.map((opt) => {
            const isMatched = Object.values(matchedPairs).includes(opt.originalIndex);
            const pairColor = usedColors["right-" + opt.originalIndex];

            return (
              <Pressable
                key={opt.originalIndex}
                style={[
                  styles.box,
                  isMatched && { backgroundColor: pairColor }
                ]}
                onPress={() => handleRight(opt)}
              >
                <AppMediumText style={[
                  styles.centerText,
                  isMatched && { color: 'black', fontWeight: 'bold' }
                ]}>
                  {opt.matchingOptionProperties.match}
                </AppMediumText>
              </Pressable>
            );
          })}
        </View>
        <View style={[{ justifyContent: 'center' }, isWide ? {} : { width: '100%' }] }>
          {/* {Object.keys(matchedPairs).length === 0 && (
            <AppMediumText style={{ fontSize: 16, fontStyle: 'italic', color: Colors.gray }}>
              No matches yet
            </AppMediumText>
          )} */}
          {/* {answers.map((ans, idx) => {
            if (ans.selectedRightIndex === undefined) return null;
            const leftText = options[idx].optionText;
            const rightText = shuffledRight.find(item => item.originalIndex === ans.selectedRightIndex)?.matchingOptionProperties.match;
            return (
              <AppBoldText
                key={idx}
                style={{ fontSize: 16, marginVertical: 30, fontWeight: 'bold', color: ans.pairColor }}
              >
                {leftText} = {rightText}
              </AppBoldText>
            );
          })} */}
        </View>
      </View>



    </View>
  );
}


const styles = StyleSheet.create({
  htmlText: {
    fontSize: 18,
    marginBottom: 20
  },
  container: {
    // base container; direction changed via helpers
    // spacing handled by margins on children
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  box: {
    padding: 16,
    minHeight: 60,
    borderWidth: 1,
    marginVertical: 8,
    borderRadius: 12,
    borderColor: Colors.borderColor,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    elevation: 2,
    flex: 1,
    maxWidth: 300 // prevent overly long boxes on wide screens
  },
  selectedBox: {
    backgroundColor: "#E0F2FE"
  },
  centerText: {
    textAlign: 'center'
  },
  topBar: {
    alignItems: 'flex-end',
    marginBottom: 10
  },
  refreshBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 25,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    // spacing handled via child margins
  },
  disabledBtn: {
    opacity: 0.5
  }
});