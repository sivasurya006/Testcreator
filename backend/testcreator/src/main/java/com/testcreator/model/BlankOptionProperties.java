package com.testcreator.model;

import org.apache.struts2.json.annotations.JSON;

import com.google.gson.JsonObject;

public class BlankOptionProperties implements OptionProperties {
	private Integer blankIdx;
	private Boolean isCaseSensitive;

	public BlankOptionProperties(Integer blankIdx, Boolean isCaseSensitive) {
	    this.blankIdx = blankIdx;
		this.isCaseSensitive = isCaseSensitive;
	}
	
	public BlankOptionProperties() {}
	
	public Integer getBlankIdx() {
		return blankIdx;
	}
	public void setBlankIdx(Integer blankIdx) {
		this.blankIdx = blankIdx;
	}
	public Boolean getIsCaseSensitive() {
		return isCaseSensitive;
	}
	public void setIsCaseSensitive(Boolean isCaseSensitive) {
		this.isCaseSensitive = isCaseSensitive;
	}

	@JSON(serialize = false)
	@Override
	public JsonObject getProperties() {
		JsonObject props = new JsonObject();
		props.addProperty("blankIdx", blankIdx);
		props.addProperty("isCaseSensitive", isCaseSensitive);
		return props;
	}
	
}
