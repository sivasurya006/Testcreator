package com.testcreator.dto;

import java.util.List;

public class TestReportDto {
	private List<QuestionDto> originalQuestions;
	private List<QuestionDto> selectedQuestios;
	private Integer totalMarks;
	
	public List<QuestionDto> getOriginalQuestions() {
		return originalQuestions;
	}
	public void setOriginalQuestions(List<QuestionDto> originalQuestions) {
		this.originalQuestions = originalQuestions;
	}
	public List<QuestionDto> getSelectedQuestios() {
		return selectedQuestios;
	}
	public void setSelectedQuestios(List<QuestionDto> selectedQuestios) {
		this.selectedQuestios = selectedQuestios;
	}
	public Integer getTotalMarks() {
		return totalMarks;
	}
	public void setTotalMarks(Integer totalMarks) {
		this.totalMarks = totalMarks;
	}
	
}
