import { router } from "expo-router";
import { useState } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import assessment data
const assessmentData = require("@/data/assessment-questions.json");

interface Option {
  label: string;
  value: string;
}

interface Question {
  id: string;
  category: string;
  text: string;
  type?: string;
  options: Option[];
}

export default function Survey() {
  const [currentStage, setCurrentStage] = useState<"baseline" | "deep_dive">(
    "baseline"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [baselineProfile, setBaselineProfile] = useState<string>("");
  const [deepDiveQuestions, setDeepDiveQuestions] = useState<Question[]>([]);
  const fadeAnim = new Animated.Value(1);

  const baselineQuestions: Question[] =
    assessmentData.data.flow.stage_1_baseline;

  const handleOptionSelect = (questionId: string, value: string) => {
    setResponses({ ...responses, [questionId]: value });

    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (currentStage === "baseline") {
        // Check if baseline stage is complete
        if (currentQuestionIndex === baselineQuestions.length - 1) {
          // Determine primary archetype from baseline
          const archetype = determineArchetype({
            ...responses,
            [questionId]: value,
          });
          setBaselineProfile(archetype);

          // Load deep dive questions
          loadDeepDiveQuestions(archetype);
          setCurrentStage("deep_dive");
          setCurrentQuestionIndex(0);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      } else {
        // Deep dive stage
        if (currentQuestionIndex === deepDiveQuestions.length - 1) {
          // Assessment complete - generate report
          generateReport();
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }
      fadeAnim.setValue(1);
    });
  };

  const determineArchetype = (allResponses: {
    [key: string]: string;
  }): string => {
    // Count archetype indicators
    const counts: { [key: string]: number } = {};
    Object.values(allResponses).forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });

    // Determine dominant archetype
    const sortedArchetypes = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const dominant = sortedArchetypes[0][0];

    // Map to primary archetypes
    if (
      dominant === "saver" ||
      dominant === "debt_averse" ||
      dominant === "hyper_aware"
    )
      return "saver";
    if (dominant === "investor") return "investor";
    if (dominant === "spender" || dominant === "satisfaction_prone")
      return "spender";
    if (dominant === "avoider" || dominant === "anxiety_prone")
      return "avoider";
    if (dominant === "debt_focused") return "debt_focused";

    return "universal";
  };

  const loadDeepDiveQuestions = (archetype: string) => {
    const deepDive = assessmentData.data.flow.stage_2_deep_dive;
    let questions: Question[] = [];

    // Load archetype-specific questions
    if (deepDive[archetype]) {
      questions = [...deepDive[archetype]];
    }

    // Always add universal questions
    if (deepDive.universal) {
      questions = [...questions, ...deepDive.universal];
    }

    setDeepDiveQuestions(questions);
  };

  const generateReport = () => {
    // Store responses and navigate to report
    router.push({
      pathname: "/(root)/assessment-report",
      params: {
        responses: JSON.stringify(responses),
        archetype: baselineProfile,
      },
    });
  };

  const currentQuestions =
    currentStage === "baseline" ? baselineQuestions : deepDiveQuestions;
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions =
    baselineQuestions.length + (deepDiveQuestions.length || 5);
  const currentProgress =
    currentStage === "baseline"
      ? currentQuestionIndex + 1
      : baselineQuestions.length + currentQuestionIndex + 1;

  if (!currentQuestion) {
    return (
      <SafeAreaView className="flex-1 bg-[#070707] items-center justify-center">
        <Text className="text-white text-lg font-jakarta-medium">
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#070707]">
      {/* Header */}
      <View className="p-6 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center"
          >
            <Text className="text-white text-lg">←</Text>
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-[#D7FF00] text-xs font-jakarta-bold">
              {currentStage === "baseline" ? "BASELINE" : "DEEP DIVE"}
            </Text>
            <Text className="text-gray-400 text-xs font-jakarta-regular">
              Question {currentProgress} of {totalQuestions}
            </Text>
          </View>
          <View className="w-10 h-10" />
        </View>

        {/* Progress Bar */}
        <View className="flex-row gap-1">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <View
              key={index}
              className="flex-1 h-1 rounded-full"
              style={{
                backgroundColor:
                  index < currentProgress - 1
                    ? "#4ECDC4"
                    : index === currentProgress - 1
                      ? "#D7FF00"
                      : "rgba(255, 255, 255, 0.1)",
              }}
            />
          ))}
        </View>

        {/* Category Badge */}
        <View className="mt-4">
          <View className="self-start bg-neutral-800 px-3 py-1.5 rounded-full">
            <Text className="text-gray-400 text-xs font-jakarta-medium">
              {currentQuestion.category.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Question Card */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View className="bg-neutral-900/95 rounded-3xl p-6 border border-white/10 mb-4">
            {/* Icon */}
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-[#D7FF00]/20 items-center justify-center mb-3 border-2 border-[#D7FF00]">
                <Text className="text-3xl">
                  {currentStage === "baseline" ? "🎯" : "🔍"}
                </Text>
              </View>
            </View>

            {/* Question Text */}
            <Text className="text-white text-xl font-jakarta-bold text-center mb-6 leading-7">
              {currentQuestion.text}
            </Text>

            {/* Options */}
            <View className="gap-3">
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    handleOptionSelect(currentQuestion.id, option.value)
                  }
                  className="rounded-2xl p-4 border-2 border-white/10 bg-neutral-800/50"
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <View className="flex-row items-center">
                    <View className="w-6 h-6 rounded-full border-2 border-gray-600 items-center justify-center mr-3">
                      <View className="w-3 h-3 rounded-full bg-[#D7FF00] opacity-0" />
                    </View>
                    <Text className="text-white text-base font-jakarta-regular flex-1 leading-6">
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Motivational Text */}
        <View className="bg-[#D7FF00]/10 rounded-2xl p-4 border border-[#D7FF00]/30">
          <Text className="text-gray-300 text-sm font-jakarta-regular text-center">
            💡 There are no right or wrong answers. Be honest with yourself.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
