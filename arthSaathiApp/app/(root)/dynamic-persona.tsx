import { router } from "expo-router";
import { useState } from "react";
import {
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Question {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    value: string;
  }[];
}

interface Answer {
  questionId: string;
  selectedOption: string;
  value: string;
}

const DynamicPersona = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showReport, setShowReport] = useState(false);
  const cardAnimation = new Animated.Value(0);

  // Mock questions from backend
  const questions: Question[] = [
    {
      id: "q1",
      question: "What is your primary source of income?",
      options: [
        { id: "a", text: "Salary (Fixed monthly)", value: "salary" },
        { id: "b", text: "Freelance/Project-based", value: "freelance" },
        { id: "c", text: "Daily wages/Gig work", value: "gig" },
        { id: "d", text: "Business/Self-employed", value: "business" },
      ],
    },
    {
      id: "q2",
      question: "How predictable is your monthly income?",
      options: [
        {
          id: "a",
          text: "Very predictable (Same amount)",
          value: "predictable",
        },
        { id: "b", text: "Somewhat predictable (±20%)", value: "moderate" },
        {
          id: "c",
          text: "Unpredictable (Varies a lot)",
          value: "unpredictable",
        },
        { id: "d", text: "Seasonal (Good/Bad months)", value: "seasonal" },
      ],
    },
    {
      id: "q3",
      question: "What is your biggest financial worry?",
      options: [
        { id: "a", text: "Not having emergency savings", value: "emergency" },
        { id: "b", text: "Managing debt/loans", value: "debt" },
        { id: "c", text: "Planning for future goals", value: "goals" },
        { id: "d", text: "Daily survival/expenses", value: "survival" },
      ],
    },
    {
      id: "q4",
      question: "How do you typically make spending decisions?",
      options: [
        { id: "a", text: "I track and budget everything", value: "planned" },
        { id: "b", text: "I spend when I have money", value: "impulsive" },
        { id: "c", text: "I prioritize necessities first", value: "necessity" },
        { id: "d", text: "I often borrow/use credit", value: "credit" },
      ],
    },
    {
      id: "q5",
      question: "What best describes your financial goal for the next year?",
      options: [
        { id: "a", text: "Build emergency fund", value: "emergency_fund" },
        { id: "b", text: "Clear all debts", value: "debt_free" },
        { id: "c", text: "Save for big purchase", value: "big_purchase" },
        { id: "d", text: "Increase income streams", value: "income_increase" },
      ],
    },
    {
      id: "q6",
      question: "How comfortable are you with financial risk?",
      options: [
        { id: "a", text: "Very cautious (Safety first)", value: "low_risk" },
        { id: "b", text: "Moderate (Calculated risks)", value: "medium_risk" },
        { id: "c", text: "High (Big risks, big rewards)", value: "high_risk" },
        { id: "d", text: "Depends on the situation", value: "situational" },
      ],
    },
    {
      id: "q7",
      question: "What percentage of income do you currently save?",
      options: [
        { id: "a", text: "Less than 5%", value: "very_low" },
        { id: "b", text: "5-15%", value: "low" },
        { id: "c", text: "15-30%", value: "medium" },
        { id: "d", text: "More than 30%", value: "high" },
      ],
    },
    {
      id: "q8",
      question: "How often do you face unexpected expenses?",
      options: [
        { id: "a", text: "Rarely (Once a year)", value: "rare" },
        { id: "b", text: "Sometimes (Few times a year)", value: "occasional" },
        { id: "c", text: "Often (Monthly)", value: "frequent" },
        { id: "d", text: "Very often (Weekly)", value: "very_frequent" },
      ],
    },
  ];

  const handleOptionSelect = (optionId: string, value: string) => {
    setSelectedOption(optionId);
    const newAnswer: Answer = {
      questionId: questions[currentQuestion].id,
      selectedOption: optionId,
      value: value,
    };
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = newAnswer;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(answers[currentQuestion + 1]?.selectedOption || "");
        cardAnimation.setValue(0);
      });
    } else {
      // Generate report
      setShowReport(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      Animated.timing(cardAnimation, {
        toValue: -1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestion(currentQuestion - 1);
        setSelectedOption(answers[currentQuestion - 1]?.selectedOption || "");
        cardAnimation.setValue(0);
      });
    }
  };

  const generatePersonaReport = () => {
    // Analyze answers to generate persona traits
    const incomeSource = answers[0]?.value || "unknown";
    const predictability = answers[1]?.value || "unknown";
    const worry = answers[2]?.value || "unknown";
    const spendingStyle = answers[3]?.value || "unknown";
    const goal = answers[4]?.value || "unknown";
    const riskProfile = answers[5]?.value || "unknown";
    const savingsRate = answers[6]?.value || "unknown";
    const unexpectedExpenses = answers[7]?.value || "unknown";

    // Generate persona name based on profile
    let personaType = "Balanced Planner";
    let emoji = "⚖️";
    let description = "";
    let strengths: string[] = [];
    let challenges: string[] = [];
    let recommendations: string[] = [];

    // Simple logic to determine persona type
    if (incomeSource === "gig" && predictability === "unpredictable") {
      personaType = "Hustle Warrior";
      emoji = "⚡";
      description =
        "You thrive in the gig economy with irregular income. Your financial life is dynamic and requires smart cash flow management.";
      strengths = [
        "Adaptable to income fluctuations",
        "Multiple income streams",
        "Comfortable with uncertainty",
      ];
      challenges = [
        "Income volatility creates stress",
        "Difficult to budget long-term",
        "Emergency funds are critical",
      ];
      recommendations = [
        "Build 6-month emergency fund",
        "Track income patterns monthly",
        "Set aside 20% of each payment",
        "Use envelope budgeting method",
      ];
    } else if (spendingStyle === "planned" && savingsRate === "high") {
      personaType = "Strategic Saver";
      emoji = "🎯";
      description =
        "You're disciplined and forward-thinking. Your financial habits show strong planning and control.";
      strengths = [
        "Excellent budgeting skills",
        "High savings rate",
        "Goal-oriented approach",
      ];
      challenges = [
        "May be too restrictive",
        "Could miss growth opportunities",
        "Risk of burnout from over-control",
      ];
      recommendations = [
        "Explore investment options",
        "Balance saving with experiences",
        "Consider automating investments",
        "Set reward milestones",
      ];
    } else if (worry === "debt" || spendingStyle === "credit") {
      personaType = "Debt Navigator";
      emoji = "🧭";
      description =
        "You're managing debt while trying to build stability. You need a clear path to financial freedom.";
      strengths = [
        "Aware of debt situation",
        "Willing to make changes",
        "Seeking solutions",
      ];
      challenges = [
        "High-interest debt burden",
        "Limited savings capacity",
        "Credit dependency",
      ];
      recommendations = [
        "List all debts (highest interest first)",
        "Negotiate lower interest rates",
        "Use snowball/avalanche method",
        "Avoid new debt strictly",
      ];
    } else if (
      predictability === "seasonal" &&
      unexpectedExpenses === "frequent"
    ) {
      personaType = "Seasonal Survivor";
      emoji = "🌊";
      description =
        "Your income ebbs and flows with seasons. You need strategies to smooth out the peaks and valleys.";
      strengths = [
        "Experience with income fluctuation",
        "Resilient mindset",
        "Understand business cycles",
      ];
      challenges = [
        "Cashflow management in lean months",
        "Temptation to overspend in good months",
        "Planning for off-season",
      ];
      recommendations = [
        "Save 40% during peak season",
        "Create fixed monthly budget",
        "Diversify income sources",
        "Plan expenses for entire year",
      ];
    }

    return {
      personaType,
      emoji,
      description,
      strengths,
      challenges,
      recommendations,
      profile: {
        incomeSource,
        predictability,
        worry,
        spendingStyle,
        goal,
        riskProfile,
        savingsRate,
        unexpectedExpenses,
      },
    };
  };

  if (showReport) {
    const report = generatePersonaReport();

    return (
      <SafeAreaView className="flex-1 bg-[#070707]">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="p-6">
            <View className="items-center mb-6">
              <View className="w-24 h-24 rounded-full bg-[#D7FF00]/20 items-center justify-center mb-4 border-4 border-[#D7FF00]">
                <Text className="text-5xl">{report.emoji}</Text>
              </View>
              <Text className="text-[#D7FF00] text-sm font-jakarta-bold mb-2">
                YOUR DIGITAL TWIN
              </Text>
              <Text className="text-white text-2xl font-jakarta-bold text-center">
                {report.personaType}
              </Text>
            </View>

            {/* Description */}
            <View className="bg-neutral-900/95 rounded-2xl p-5 mb-4 border border-white/10">
              <Text className="text-gray-300 text-sm font-jakarta-regular leading-6">
                {report.description}
              </Text>
            </View>

            {/* Strengths */}
            <View className="mb-4">
              <Text className="text-white text-lg font-jakarta-bold mb-3">
                💪 Your Strengths
              </Text>
              {report.strengths.map((strength, index) => (
                <View
                  key={index}
                  className="bg-[#4ECDC4]/10 rounded-xl p-4 mb-2 border border-[#4ECDC4]/30 flex-row items-center"
                >
                  <Text className="text-[#4ECDC4] text-base mr-2">✓</Text>
                  <Text className="text-white text-sm font-jakarta-regular flex-1">
                    {strength}
                  </Text>
                </View>
              ))}
            </View>

            {/* Challenges */}
            <View className="mb-4">
              <Text className="text-white text-lg font-jakarta-bold mb-3">
                ⚠️ Key Challenges
              </Text>
              {report.challenges.map((challenge, index) => (
                <View
                  key={index}
                  className="bg-[#FF6B6B]/10 rounded-xl p-4 mb-2 border border-[#FF6B6B]/30 flex-row items-center"
                >
                  <Text className="text-[#FF6B6B] text-base mr-2">!</Text>
                  <Text className="text-white text-sm font-jakarta-regular flex-1">
                    {challenge}
                  </Text>
                </View>
              ))}
            </View>

            {/* Recommendations */}
            <View className="mb-4">
              <Text className="text-white text-lg font-jakarta-bold mb-3">
                🎯 AI Recommendations
              </Text>
              {report.recommendations.map((rec, index) => (
                <View
                  key={index}
                  className="bg-[#D7FF00]/10 rounded-xl p-4 mb-2 border border-[#D7FF00]/30 flex-row items-start"
                >
                  <Text className="text-[#D7FF00] text-sm font-jakarta-bold mr-2">
                    {index + 1}.
                  </Text>
                  <Text className="text-white text-sm font-jakarta-regular flex-1">
                    {rec}
                  </Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              onPress={() => router.replace("/(root)/(tabs)/home")}
              className="bg-[#D7FF00] rounded-2xl p-4 items-center mb-3"
            >
              <Text className="text-[#070707] text-base font-jakarta-bold">
                Start Your Journey
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowReport(false);
                setCurrentQuestion(0);
                setAnswers([]);
                setSelectedOption("");
              }}
              className="bg-neutral-800 rounded-2xl p-4 items-center"
            >
              <Text className="text-white text-base font-jakarta-bold">
                Retake Assessment
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
          <Text className="text-[#D7FF00] text-sm font-jakarta-bold">
            Question {currentQuestion + 1} of {questions.length}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="flex-row gap-1">
          {questions.map((_, index) => (
            <View
              key={index}
              className="flex-1 h-1 rounded-full"
              style={{
                backgroundColor:
                  index <= currentQuestion
                    ? "#D7FF00"
                    : "rgba(255, 255, 255, 0.1)",
              }}
            />
          ))}
        </View>
      </View>

      {/* Question Card */}
      <View className="flex-1 px-6">
        <Animated.View
          style={{
            transform: [
              {
                translateX: cardAnimation.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [width, 0, -width],
                }),
              },
            ],
          }}
        >
          <View className="bg-neutral-900/95 rounded-3xl p-6 border border-white/10">
            <Text className="text-white text-xl font-jakarta-bold mb-6 leading-7">
              {questions[currentQuestion].question}
            </Text>

            <View className="gap-3">
              {questions[currentQuestion].options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => handleOptionSelect(option.id, option.value)}
                  className="rounded-2xl p-4 border-2"
                  style={{
                    backgroundColor:
                      selectedOption === option.id ? "#D7FF00" : "#1E1E1E",
                    borderColor:
                      selectedOption === option.id
                        ? "#D7FF00"
                        : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-6 h-6 rounded-full border-2 items-center justify-center mr-3"
                      style={{
                        borderColor:
                          selectedOption === option.id ? "#070707" : "#666666",
                        backgroundColor:
                          selectedOption === option.id
                            ? "#070707"
                            : "transparent",
                      }}
                    >
                      {selectedOption === option.id && (
                        <Text className="text-[#D7FF00] text-xs">✓</Text>
                      )}
                    </View>
                    <Text
                      className="text-sm font-jakarta-medium flex-1"
                      style={{
                        color:
                          selectedOption === option.id ? "#070707" : "#FFFFFF",
                      }}
                    >
                      {option.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Navigation Buttons */}
      <View className="p-6 flex-row gap-3">
        {currentQuestion > 0 && (
          <TouchableOpacity
            onPress={handleBack}
            className="flex-1 bg-neutral-800 rounded-2xl p-4 items-center"
          >
            <Text className="text-white text-sm font-jakarta-bold">Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleNext}
          disabled={!selectedOption}
          className="flex-1 rounded-2xl p-4 items-center"
          style={{
            backgroundColor: selectedOption ? "#D7FF00" : "#333333",
          }}
        >
          <Text
            className="text-sm font-jakarta-bold"
            style={{ color: selectedOption ? "#070707" : "#666666" }}
          >
            {currentQuestion === questions.length - 1
              ? "Generate Report"
              : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DynamicPersona;
