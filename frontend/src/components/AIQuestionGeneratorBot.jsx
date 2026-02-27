import React, { useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import Colors from '../../styles/Colors';
import { AppBoldText, AppRegularText, AppSemiBoldText } from '../../styles/fonts';

const AI_ASK_URL = 'https://ragaibot-production.up.railway.app/ai_chat/ask';
const AI_API_KEY = 'd54b307bf34ed2de1a84864714213e8a8fd12c29c47279e3ec4e72e67f66771b';

function extractTextFromResponse(data) {
  if (typeof data === 'string') return data;
  if (!data || typeof data !== 'object') return '';

  const candidates = [
    data.answer,
    data.response,
    data.message,
    data.result,
    data.output,
    data.text,
    data?.data?.answer,
    data?.data?.response,
    data?.data?.message,
  ];

  const found = candidates.find((item) => typeof item === 'string' && item.trim() !== '');
  if (found) return found;

  try {
    return JSON.stringify(data, null, 2);
  } catch (err) {
    return '';
  }
}

function sanitizeQuestionPayload(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;

  const type = String(parsed.type || '').toUpperCase();
  const validTypes = ['MCQ', 'SINGLE', 'BOOLEAN', 'FILL_BLANK', 'MATCHING'];
  if (!validTypes.includes(type)) return null;

  if (typeof parsed.questionText !== 'string' || !Array.isArray(parsed.options)) return null;

  const sanitized = {
    marks: Number(parsed.marks) || 0,
    questionText: parsed.questionText,
    type,
    options: parsed.options
      .filter((opt) => opt && typeof opt.optionText === 'string')
      .map((opt) => {
        const base = {
          optionText: opt.optionText,
          optionMark: Number(opt.optionMark) || 0,
        };

        if (type === 'MATCHING' && opt.matchingOptionProperties) {
          return {
            ...base,
            matchingOptionProperties: opt.matchingOptionProperties,
          };
        }

        if (type === 'FILL_BLANK' && opt.blankOptionProperties) {
          return {
            ...base,
            blankOptionProperties: opt.blankOptionProperties,
          };
        }

        return {
          ...base,
          correct: !!opt.correct,
        };
      }),
  };

  if (sanitized.options.length === 0) return null;
  return sanitized;
}

function extractFirstJsonBlock(text, startChar, endChar) {
  if (!text || typeof text !== 'string') return null;
  const start = text.indexOf(startChar);
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === startChar) depth += 1;
    if (ch === endChar) depth -= 1;
    if (depth === 0) {
      return text.slice(start, i + 1);
    }
  }
  return null;
}

function parseJsonSafe(text) {
  if (!text || typeof text !== 'string') return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}

function tryParseQuestionPayload(input) {
  if (!input) return null;

  if (typeof input === 'object') {
    const direct = sanitizeQuestionPayload(input);
    if (direct) return direct;
  }

  if (typeof input !== 'string') return null;
  const normalized = input.trim();
  const fenced = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? normalized;

  const candidates = [
    raw,
    raw.replace(/[“”]/g, '"').replace(/[‘’]/g, "'"),
    extractFirstJsonBlock(raw, '{', '}'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const parsed = parseJsonSafe(candidate);
    const sanitized = sanitizeQuestionPayload(parsed);
    if (sanitized) return sanitized;
  }
  return null;
}

function tryParseQuestionPayloadArray(input) {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map((item) => sanitizeQuestionPayload(item)).filter(Boolean);
  }

  if (typeof input !== 'string') return [];
  const normalized = input.trim();
  const fenced = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? normalized;

  const candidates = [
    raw,
    raw.replace(/[“”]/g, '"').replace(/[‘’]/g, "'"),
    extractFirstJsonBlock(raw, '[', ']'),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const parsed = parseJsonSafe(candidate);
    if (!Array.isArray(parsed)) continue;
    const sanitized = parsed.map((item) => sanitizeQuestionPayload(item)).filter(Boolean);
    if (sanitized.length > 0) return sanitized;
  }

  return [];
}

function parseQuestionListFromApiData(data) {
  const directList = tryParseQuestionPayloadArray(data);
  if (directList.length > 0) return directList;

  const directOne = tryParseQuestionPayload(data);
  if (directOne) return [directOne];

  if (!data || typeof data !== 'object') return [];

  const candidates = [
    data.questions,
    data.data?.questions,
    data.answer,
    data.response,
    data.message,
    data.result,
    data.output,
    data.text,
    data.data,
    data?.data?.answer,
    data?.data?.response,
    data?.data?.message,
    data?.data?.result,
    data?.data?.output,
    data?.data?.text,
  ];

  for (const candidate of candidates) {
    const parsedList = tryParseQuestionPayloadArray(candidate);
    if (parsedList.length > 0) return parsedList;

    const parsedOne = tryParseQuestionPayload(candidate);
    if (parsedOne) return [parsedOne];
  }

  return [];
}

export default function AIQuestionGeneratorBot({ onUseQuestion }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const askAi = async () => {
    setError('');
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(AI_ASK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${prompt.trim()}\n\nReturn JSON only. Prefer an array of questions. Each question must contain keys: marks, questionText, type, options.`,
          'x-api-key': AI_API_KEY,
        }),
      });

      const text = await response.text();
      let data = text;

      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        // API may return plain text, keep as-is.
      }

      if (!response.ok) {
        const message = extractTextFromResponse(data) || `Request failed (${response.status})`;
        setError(message);
        return;
      }

      const generatedQuestions = parseQuestionListFromApiData(data);
      if (generatedQuestions.length === 0) {
        const responseText = extractTextFromResponse(data);
        console.log('AI raw response:', responseText);
        setError('Could not parse AI JSON. I logged raw AI response in console.');
        return;
      }

      try {
        setSaving(true);
        for (const question of generatedQuestions) {
          await onUseQuestion(question);
        }
        setPrompt('');
        setIsOpen(false);
      } catch (saveErr) {
        setError('Question generation worked, but saving question failed. Please try again.');
      } finally {
        setSaving(false);
      }
    } catch (err) {
      setError('Failed to contact AI service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Pressable style={styles.fab} onPress={() => setIsOpen(true)}>
        <Ionicons name="sparkles-outline" size={22} color={Colors.white} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <View style={styles.headerRow}>
              <View style={styles.titleRow}>
                <AntDesign name="robot" size={20} color={Colors.primaryColor} />
                <AppBoldText style={styles.title}>AI Question Generator</AppBoldText>
              </View>
              <Pressable onPress={() => setIsOpen(false)}>
                <AntDesign name="close" size={20} color={Colors.secondaryColor} />
              </Pressable>
            </View>

            <AppSemiBoldText style={styles.label}>Prompt</AppSemiBoldText>
            <TextInput
              style={styles.input}
              multiline
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Generate one MCQ on Operating Systems ...."
              placeholderTextColor={Colors.lightFont}
            />

            <View style={styles.actionRow}>
              <Pressable style={styles.cancelBtn} onPress={() => setIsOpen(false)}>
                <AppRegularText>Close</AppRegularText>
              </Pressable>
              <Pressable style={styles.askBtn} onPress={askAi}>
                {loading || saving ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <AppRegularText style={{ color: Colors.white }}>Ask AI</AppRegularText>
                )}
              </Pressable>
            </View>

            {!!error && <AppSemiBoldText style={styles.error}>{error}</AppSemiBoldText>}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    ...(Platform.OS === 'web' ? { boxShadow: Colors.blackBoxShadow } : {}),
  },
  overlay: {
    flex: 1,
    backgroundColor: Colors.dimBg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  modalCard: {
    width: '100%',
    maxWidth: 760,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 18,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: Colors.secondaryColor,
    fontSize: 18,
  },
  label: {
    fontSize: 14,
    color: Colors.secondaryColor,
  },
  input: {
    minHeight: 90,
    maxHeight: 180,
    borderColor: Colors.borderColor,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    color: Colors.secondaryColor,
    backgroundColor: Colors.bgColor,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    backgroundColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  askBtn: {
    minWidth: 88,
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  error: {
    color: '#DC2626',
    fontSize: 13,
  },
});
