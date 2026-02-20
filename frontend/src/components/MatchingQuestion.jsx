import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Checkbox, IconButton } from 'react-native-paper';
import Colors from '../../styles/Colors';
import QuestionRow from './QuestionRow';
import { TextInput as PaperInput } from "react-native-paper";
import { MCQComponent } from './OptionComponents';

export default function MatchingQuestion({ mode, question, options, questionNumber, setAllQuestions, allQuestions }) {

    if (mode === 'edit') {
        return (
            <View style={styles.container}>
                <QuestionRow question={question} questionNumber={questionNumber} setAllTestQuestions={setAllQuestions} allQuestions={allQuestions} />
                <View style={styles.optionsList}>
                    {options.map((opt, i) => {
                        return (
                            <View style={{ flexDirection: 'row', columnGap: 20, marginVertical: 10 }} >
                                <PaperInput
                                    label={`Left pair ${i + 1}`}
                                    mode='outlined'
                                    value={opt.optionText}
                                />
                                <PaperInput
                                    label={`right pair ${i + 1}`}
                                    mode='outlined'
                                    value={opt.matchingOptionProperties?.match}
                                />
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    }

    return (
        <>
            <QuestionRow
                question={{ ...question }}
                questionNumber={questionNumber}
                mode={mode}
            />
            {options.map((opt, i) => {
                return (
                    <View style={{ flexDirection: 'row', columnGap: 20, marginVertical: 10 }} >
                        <PaperInput
                            label={`Left pair ${i + 1}`}
                            mode='outlined'
                            value={opt.optionText}
                        />
                        <PaperInput
                            label={`right pair ${i + 1}`}
                            mode='outlined'
                            value={opt.matchingOptionProperties?.match}
                        />
                    </View>
                );
            })}
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: Colors.white,
        marginVertical: 5,
        shadowColor: Colors.shadowColor,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
        borderRadius: 8,
        marginHorizontal: 10
    },

    questionRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    questionNumber: {
        fontWeight: '700',
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    toolsRow: {
        flexDirection: 'row',
        marginRight: 6,
    },
    questionMark: {
        fontSize: 14,
        fontWeight: '500',
        alignSelf: 'center',
    },
    optionsList: {
        marginTop: 8,
        marginBottom: 12,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    optionsText: {
        fontSize: 15,
    },
    correctAnswerText: {
        color: 'green',
        fontWeight: 600,
        fontSize: 16
    },
    correctAnswerLabel: {
        fontWeight: 600,
        fontSize: 16
    }
});
