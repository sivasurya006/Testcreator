import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '../../../../../styles/Colors';
import SubmissionsHeader from '../../../../../src/components/submissions/SubmissionsHeader';
import { ActivityIndicator } from 'react-native-paper';
import api from '../../../../../util/api';
import { useGlobalSearchParams } from 'expo-router';

import { FlatList } from 'react-native-gesture-handler';
import GradeScreen from '../../../../../src/screens/GradeScreen';
import { AppSemiBoldText } from '../../../../../styles/fonts';
import DetailedTestReport from '../../../../../src/components/DetailedTestReport';
import StudentTest from '../../../../../src/components/StudentTest';
import StudentTestLists from './tests';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { TextInput } from 'react-native';
export default function StudentSubmissions() {


  const [SubmittedTest, setSubmittedTest] = useState();
  const { classroomId, testId } = useGlobalSearchParams();
  const [Loading, setLoading] = useState();
  const [searchDate, setSearchDate] = useState("");
  useFocusEffect(
    useCallback(() => {
      setLoading(true)
      const get = async () => await getSubmittedTests(setSubmittedTest, classroomId);
      get();
      setLoading(false);
    }, [classroomId])
  );


  const filteredTests = SubmittedTest?.filter((item) => {
    if (!searchDate) return true;

    const formattedDate = new Date(item.createdAt * 1000)
      .toISOString()
      .split("T")[0]; 

    return formattedDate.includes(searchDate);
  });
  async function getSubmittedTests() {
    try {
      const result = await api.get(`/studenttest/getStudentSubmittedTests`, {

        headers: {
          'X-ClassroomId': classroomId

        }
      });
      if (result?.status == 200) {
        setSubmittedTest(result.data.reverse());
        console.log("submitted ", result.data);
      } else {

        console.log(`can't fetch created classrooms`);
      }
    } catch (err) {
      console.log(err)
    }
  }

  console.log("check if it pass", SubmittedTest)
  return (
    <View style={{ flex: 1 }}>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search by date (YYYY-MM-DD)"
          value={searchDate}
          onChangeText={setSearchDate}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredTests}
        keyExtractor={(item) => item.testId.toString()}
        renderItem={({ item }) => (
          <StudentTest data={item} isStudentTest={false} />
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
  },

  searchInput: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontSize: 14,
  },
})