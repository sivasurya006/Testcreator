import { View, Text, StyleSheet, Modal, TouchableOpacity, useWindowDimensions } from 'react-native'
import React from 'react'
import Colors from '../../styles/Colors'
import { AppBoldText, AppSemiBoldText, fonts } from '../../styles/fonts'
import { Icon } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import RenderHTML from 'react-native-render-html'
import FillInBlankQuestionView from './testComponents/FillInBlankQuestionView'
import MatchingQuestionView from './testComponents/MatchingQuestionView'
import QuestionView from './testComponents/QuestionView'
import McqQuestion from './McqQuestion'
import SingleChoiceQuestion from './SingleChoiceQuestion'
import FillInBlankQuestion from './FillIntheBlankQuestion'
import MatchingQuestion from './MatchingQuestion'
import BooleanQuestion from './BooleanQuestion';
import { AntDesign } from '@expo/vector-icons'

export default function DetailedTestReport({ isResultPageOpen, onExit, totalMarks, questions }) {


    const numberOfQuestion = questions?.length;
    const correctQuestions = questions?.reduce((sum, question) => question.givenMarks > 0 ? sum + 1 : sum, 0) || 0;
    // console.log("no question  ========================================= ",numberOfQuestion)

    // console.log("correc question  ========================================= ",correctQuestions)

    // console.log("avg  ========================================= ", )

    console.log("Total ", questions)

    const { width } = useWindowDimensions();

    return (
        <Modal
            visible={isResultPageOpen}
            animationType="fade"
            onRequestClose={onExit}
            onDismiss={onExit}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <AppBoldText style={styles.topHeaderText}>
                        Test Report
                    </AppBoldText>

                    <TouchableOpacity onPress={onExit} style={styles.closeButton}>
                        <AntDesign name="close" size={24} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', gap: 50, margin: 50, flexWrap: 'wrap' }}>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <Icon name="check-circle" size={30} color="white" />
                            <Text style={styles.headerText}>Total Marks</Text>
                        </View>
                        <View style={styles.resultContainer}>
                            <Text style={styles.totalMarksText}>{totalMarks}</Text>
                        </View>
                        {/* <TouchableOpacity style={styles.button} onPress={onExit}>
                            <Text style={styles.buttonText}>Back to home</Text>
                        </TouchableOpacity> */}
                    </View>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <Icon name="check-circle" size={30} color="white" />
                            <Text style={styles.headerText}>Score</Text>
                        </View>
                        <View style={styles.resultContainer}>
                            <Text style={styles.totalMarksText}>{Math.floor((correctQuestions / numberOfQuestion) * 100) + "%"}</Text>
                        </View>

                    </View>
                    <View style={styles.modalContainer}>
                        <View style={styles.header}>
                            <Icon name="check-circle" size={30} color="white" />
                            <Text style={styles.headerText}>Correct Questions</Text>
                        </View>
                        <View style={styles.resultContainer}>
                            <Text style={styles.totalMarksText}>{correctQuestions}</Text>
                        </View>

                    </View>
                </View>
                <ScrollView style={{
                    flex: 1,
                    maxWidth: 1200,
                    width: '100%',
                    boxShadow: Colors.blackBoxShadow,
                    marginHorizontal: 10,
                    elevation: 6,
                    borderRadius: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 20,
                    backgroundColor: Colors.white
                }}>
                    {
                        questions?.map((ques, index) => (
                            <View key={ques.id} style={{}}>
                                {
                                    getQuestion(ques, index + 1)
                                }
                            </View>
                        ))
                    }
                </ScrollView>

            </View>

        </Modal>
    )
}

function getQuestion(item, index) {
    switch (item.type) {
        case 'SINGLE':
            return (
                <SingleChoiceQuestion
                    mode="report"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                />
            );
        case "MCQ":
            return (
                <McqQuestion
                    mode="report"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                />
            )
        case 'BOOLEAN': {
            return (
                <BooleanQuestion
                    mode="report"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                />
            )
        }
        case "FILL_BLANK": {
            return (
                <FillInBlankQuestion
                    mode="report"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                />
            )
        }
        case "MATCHING": {
            return (
                <MatchingQuestion
                    mode="report"
                    question={item}
                    options={item.options}
                    questionNumber={index}
                />
            )
        }
        default:
            return null;
    }
}


const styles = StyleSheet.create({
    container: {
        userSelect: 'none',
        backgroundColor: Colors.bgColor,
        padding: 20,
        flex: 1,
        alignItems: 'center',

    },
    topHeaderText: {
        fontSize: 28,
        textAlign: 'center',
        // margin: 10,
    },
    totalMark: {
        fontSize: 24,
        color: 'black'
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: '#009B4D',
        borderRadius: 10,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        marginLeft: 10,
        fontWeight: 'bold',
    },
    resultContainer: {
        marginBottom: 20,
    },
    totalMarksText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    button: {
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#28a745',
        fontWeight: 'bold',
    },
    headerContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20,
    },

    closeButton: {
        position: 'absolute',
        right: 0,
    },
})