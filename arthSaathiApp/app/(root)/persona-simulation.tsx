import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Choice {
  id: string;
  text: string;
  financial_impact: number;
  future_liability: number;
  behavioral_tag: string;
  outcome_narrative: string;
  time_impact: string;
}

interface Event {
  event_id: string;
  title: string;
  description: string;
  choices: Choice[];
}

interface SimulationResponse {
  selectedChoice: Choice;
  immediateImpact: number;
  cumulativeImpact: number;
  behavioralPattern: string;
  narrativeOutcome: string;
}

const PersonaSimulation = () => {
  const params = useLocalSearchParams();
  const personaId = params.id as string;

  const [persona, setPersona] = useState<any>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>("");
  const [responses, setResponses] = useState<SimulationResponse[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = new Animated.Value(1);

  // Load persona data
  useEffect(() => {
    const personasData = require("@/data/personas.json");
    const selectedPersona = personasData.personas.find(
      (p: any) => p.id === personaId
    );
    if (selectedPersona) {
      setPersona(selectedPersona);
      setIsLoading(false);
    }
  }, [personaId]);

  if (isLoading || !persona) {
    return (
      <SafeAreaView className="flex-1 bg-[#070707] items-center justify-center">
        <Text className="text-white text-lg font-jakarta-medium">
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  const events: Event[] = persona.events || [];
  const currentEvent = events[currentEventIndex];
  const totalEvents = Math.min(events.length, 8);

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
  };

  const handleSubmitChoice = () => {
    const selectedChoice = currentEvent.choices.find(
      (c) => c.id === selectedChoiceId
    );
    if (!selectedChoice) return;

    // Calculate cumulative impact
    const previousImpact = responses.reduce(
      (sum, r) => sum + r.immediateImpact,
      0
    );
    const cumulativeImpact = previousImpact + selectedChoice.financial_impact;

    // Store response
    const response: SimulationResponse = {
      selectedChoice,
      immediateImpact: selectedChoice.financial_impact,
      cumulativeImpact,
      behavioralPattern: selectedChoice.behavioral_tag,
      narrativeOutcome: selectedChoice.outcome_narrative,
    };

    setResponses([...responses, response]);

    // Fade out animation
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      if (currentEventIndex < totalEvents - 1) {
        // Move to next event
        setCurrentEventIndex(currentEventIndex + 1);
        setSelectedChoiceId("");
        fadeAnim.setValue(1);
      } else {
        // Show report
        setShowReport(true);
      }
    });
  };

  const generateSimulationReport = () => {
    const totalImpact = responses.reduce(
      (sum, r) => sum + r.immediateImpact,
      0
    );
    const finalSavings =
      persona.financial_baseline.savings_balance + totalImpact;
    const finalDebt = persona.financial_baseline.debt_total;

    // Analyze behavioral patterns
    const behaviorCounts: { [key: string]: number } = {};
    responses.forEach((r) => {
      const pattern = r.behavioralPattern;
      behaviorCounts[pattern] = (behaviorCounts[pattern] || 0) + 1;
    });

    const dominantBehavior = Object.keys(behaviorCounts).reduce((a, b) =>
      behaviorCounts[a] > behaviorCounts[b] ? a : b
    );

    // Calculate financial health score (0-100)
    const savingsRatio =
      finalSavings / persona.financial_baseline.avg_monthly_income;
    const debtRatio = finalDebt / persona.financial_baseline.avg_monthly_income;
    const healthScore = Math.max(
      0,
      Math.min(100, 50 + savingsRatio * 10 - debtRatio * 20)
    );

    // Generate insights
    const avgImpact = totalImpact / responses.length;
    const positiveDecisions = responses.filter(
      (r) => r.immediateImpact >= 0
    ).length;
    const riskDecisions = responses.filter((r) =>
      r.behavioralPattern.includes("Risk")
    ).length;

    return {
      totalImpact,
      finalSavings,
      finalDebt,
      dominantBehavior,
      healthScore,
      avgImpact,
      positiveDecisions,
      riskDecisions,
      behaviorCounts,
    };
  };

  if (showReport) {
    const report = generateSimulationReport();

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
                <Text className="text-5xl">📊</Text>
              </View>
              <Text className="text-[#D7FF00] text-sm font-jakarta-bold mb-2">
                SIMULATION COMPLETE
              </Text>
              <Text className="text-white text-2xl font-jakarta-bold text-center">
                {persona.display_profile.name}&apos;s Journey
              </Text>
              <Text className="text-gray-400 text-sm font-jakarta-regular mt-1">
                {totalEvents} Financial Decisions Analyzed
              </Text>
            </View>

            {/* Financial Summary */}
            <View className="bg-neutral-900/95 rounded-2xl p-5 mb-4 border border-white/10">
              <Text className="text-white text-lg font-jakarta-bold mb-4">
                💰 Financial Impact
              </Text>
              <View className="flex-row gap-3 mb-3">
                <View className="flex-1 bg-neutral-800 rounded-xl p-3">
                  <Text className="text-gray-400 text-xs font-jakarta-regular mb-1">
                    Total Impact
                  </Text>
                  <Text
                    className="text-lg font-jakarta-bold"
                    style={{
                      color: report.totalImpact >= 0 ? "#4ECDC4" : "#FF6B6B",
                    }}
                  >
                    ₹{Math.abs(report.totalImpact).toLocaleString("en-IN")}
                  </Text>
                  <Text className="text-gray-400 text-[10px] font-jakarta-regular">
                    {report.totalImpact >= 0 ? "Gained" : "Spent"}
                  </Text>
                </View>
                <View className="flex-1 bg-neutral-800 rounded-xl p-3">
                  <Text className="text-gray-400 text-xs font-jakarta-regular mb-1">
                    Final Savings
                  </Text>
                  <Text className="text-[#D7FF00] text-lg font-jakarta-bold">
                    ₹{report.finalSavings.toLocaleString("en-IN")}
                  </Text>
                  <Text
                    className="text-[10px] font-jakarta-regular"
                    style={{
                      color:
                        report.finalSavings >
                        persona.financial_baseline.savings_balance
                          ? "#4ECDC4"
                          : "#FF6B6B",
                    }}
                  >
                    {report.finalSavings >
                    persona.financial_baseline.savings_balance
                      ? "↑ Increased"
                      : "↓ Decreased"}
                  </Text>
                </View>
              </View>
              <View className="bg-neutral-800 rounded-xl p-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-400 text-xs font-jakarta-regular">
                    Financial Health Score
                  </Text>
                  <Text className="text-white text-base font-jakarta-bold">
                    {report.healthScore.toFixed(0)}/100
                  </Text>
                </View>
                <View className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${report.healthScore}%`,
                      backgroundColor:
                        report.healthScore >= 70
                          ? "#4ECDC4"
                          : report.healthScore >= 40
                            ? "#FFD93D"
                            : "#FF6B6B",
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Behavioral Analysis */}
            <View className="bg-neutral-900/95 rounded-2xl p-5 mb-4 border border-white/10">
              <Text className="text-white text-lg font-jakarta-bold mb-4">
                🧠 Behavioral Pattern
              </Text>
              <View className="bg-[#D7FF00]/10 rounded-xl p-4 mb-3 border border-[#D7FF00]/30">
                <Text className="text-[#D7FF00] text-xs font-jakarta-bold mb-1">
                  DOMINANT BEHAVIOR
                </Text>
                <Text className="text-white text-base font-jakarta-bold">
                  {report.dominantBehavior}
                </Text>
              </View>
              <View className="gap-2">
                {Object.entries(report.behaviorCounts).map(
                  ([behavior, count]) => (
                    <View
                      key={behavior}
                      className="flex-row items-center justify-between bg-neutral-800 rounded-lg p-3"
                    >
                      <Text className="text-white text-sm font-jakarta-regular flex-1">
                        {behavior}
                      </Text>
                      <View className="bg-[#D7FF00]/20 px-3 py-1 rounded-full">
                        <Text className="text-[#D7FF00] text-xs font-jakarta-bold">
                          {count}x
                        </Text>
                      </View>
                    </View>
                  )
                )}
              </View>
            </View>

            {/* Decision Quality */}
            <View className="bg-neutral-900/95 rounded-2xl p-5 mb-4 border border-white/10">
              <Text className="text-white text-lg font-jakarta-bold mb-4">
                🎯 Decision Quality
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-neutral-800 rounded-xl p-3">
                  <Text className="text-gray-400 text-xs font-jakarta-regular mb-1">
                    Positive Decisions
                  </Text>
                  <Text className="text-[#4ECDC4] text-2xl font-jakarta-bold">
                    {report.positiveDecisions}
                  </Text>
                  <Text className="text-gray-400 text-[10px] font-jakarta-regular">
                    out of {totalEvents}
                  </Text>
                </View>
                <View className="flex-1 bg-neutral-800 rounded-xl p-3">
                  <Text className="text-gray-400 text-xs font-jakarta-regular mb-1">
                    Risky Choices
                  </Text>
                  <Text className="text-[#FF6B6B] text-2xl font-jakarta-bold">
                    {report.riskDecisions}
                  </Text>
                  <Text className="text-gray-400 text-[10px] font-jakarta-regular">
                    high risk taken
                  </Text>
                </View>
              </View>
            </View>

            {/* Event Timeline */}
            <View className="mb-4">
              <Text className="text-white text-lg font-jakarta-bold mb-3">
                📅 Decision Timeline
              </Text>
              {responses.map((response, index) => (
                <View
                  key={index}
                  className="bg-neutral-900/95 rounded-xl p-4 mb-2 border border-white/10"
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-1">
                      <Text className="text-gray-400 text-xs font-jakarta-regular">
                        Event {index + 1}
                      </Text>
                      <Text className="text-white text-sm font-jakarta-medium mt-1">
                        {response.narrativeOutcome}
                      </Text>
                    </View>
                    <View
                      className="px-2 py-1 rounded-lg"
                      style={{
                        backgroundColor:
                          response.immediateImpact >= 0
                            ? "rgba(78, 205, 196, 0.2)"
                            : "rgba(255, 107, 107, 0.2)",
                      }}
                    >
                      <Text
                        className="text-xs font-jakarta-bold"
                        style={{
                          color:
                            response.immediateImpact >= 0
                              ? "#4ECDC4"
                              : "#FF6B6B",
                        }}
                      >
                        {response.immediateImpact >= 0 ? "+" : ""}₹
                        {Math.abs(response.immediateImpact).toLocaleString(
                          "en-IN"
                        )}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-neutral-800 px-2 py-1 rounded self-start">
                    <Text className="text-gray-400 text-[10px] font-jakarta-regular">
                      {response.behavioralPattern}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Key Insights */}
            <View className="bg-[#D7FF00]/10 rounded-2xl p-5 mb-4 border-2 border-[#D7FF00]/30">
              <Text className="text-white text-lg font-jakarta-bold mb-3">
                💡 Key Insights
              </Text>
              <View className="gap-2">
                <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                  • Your average financial impact per decision was{" "}
                  <Text className="text-white font-jakarta-bold">
                    ₹{Math.abs(report.avgImpact).toFixed(0)}
                  </Text>
                </Text>
                <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                  • You made{" "}
                  <Text className="text-white font-jakarta-bold">
                    {report.positiveDecisions}
                  </Text>{" "}
                  financially positive decisions
                </Text>
                <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                  • Your dominant behavior pattern is{" "}
                  <Text className="text-[#D7FF00] font-jakarta-bold">
                    {report.dominantBehavior}
                  </Text>
                </Text>
                <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                  • Final savings{" "}
                  {report.finalSavings >
                  persona.financial_baseline.savings_balance
                    ? "increased"
                    : "decreased"}{" "}
                  by{" "}
                  <Text className="text-white font-jakarta-bold">
                    ₹
                    {Math.abs(
                      report.finalSavings -
                        persona.financial_baseline.savings_balance
                    ).toLocaleString("en-IN")}
                  </Text>
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              onPress={() => router.replace("/(root)/(tabs)/home")}
              className="bg-[#D7FF00] rounded-2xl p-4 items-center mb-3"
            >
              <Text className="text-[#070707] text-base font-jakarta-bold">
                Back to Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowReport(false);
                setCurrentEventIndex(0);
                setResponses([]);
                setSelectedChoiceId("");
                fadeAnim.setValue(1);
              }}
              className="bg-neutral-800 rounded-2xl p-4 items-center"
            >
              <Text className="text-white text-base font-jakarta-bold">
                Restart Simulation
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
          <View className="items-center">
            <Text className="text-[#D7FF00] text-xs font-jakarta-bold">
              {persona.display_profile.name}
            </Text>
            <Text className="text-gray-400 text-xs font-jakarta-regular">
              Event {currentEventIndex + 1} of {totalEvents}
            </Text>
          </View>
          <View className="w-10 h-10" />
        </View>

        {/* Progress Bar */}
        <View className="flex-row gap-1">
          {Array.from({ length: totalEvents }).map((_, index) => (
            <View
              key={index}
              className="flex-1 h-1 rounded-full"
              style={{
                backgroundColor:
                  index < currentEventIndex
                    ? "#4ECDC4"
                    : index === currentEventIndex
                      ? "#D7FF00"
                      : "rgba(255, 255, 255, 0.1)",
              }}
            />
          ))}
        </View>

        {/* Financial Context */}
        <View className="mt-4 bg-neutral-900/95 rounded-xl p-3 flex-row justify-between">
          <View>
            <Text className="text-gray-400 text-xs font-jakarta-regular">
              Current Savings
            </Text>
            <Text className="text-[#D7FF00] text-base font-jakarta-bold">
              ₹
              {(
                persona.financial_baseline.savings_balance +
                responses.reduce((sum, r) => sum + r.immediateImpact, 0)
              ).toLocaleString("en-IN")}
            </Text>
          </View>
          <View>
            <Text className="text-gray-400 text-xs font-jakarta-regular">
              Monthly Income
            </Text>
            <Text className="text-[#4ECDC4] text-base font-jakarta-bold">
              ₹
              {persona.financial_baseline.avg_monthly_income.toLocaleString(
                "en-IN"
              )}
            </Text>
          </View>
        </View>
      </View>

      {/* Event Card */}
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <View className="bg-neutral-900/95 rounded-3xl p-6 border border-white/10 mb-4">
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-[#FF6B6B]/20 items-center justify-center mb-3 border-2 border-[#FF6B6B]">
                <Text className="text-3xl">⚠️</Text>
              </View>
              <Text className="text-white text-xl font-jakarta-bold text-center mb-2">
                {currentEvent.title}
              </Text>
            </View>

            <View className="bg-neutral-800/50 rounded-xl p-4 mb-4">
              <Text className="text-gray-300 text-sm font-jakarta-regular leading-6">
                {currentEvent.description}
              </Text>
            </View>

            <Text className="text-white text-base font-jakarta-bold mb-3">
              What will you do?
            </Text>

            <View className="gap-3">
              {currentEvent.choices.map((choice) => (
                <TouchableOpacity
                  key={choice.id}
                  onPress={() => handleChoiceSelect(choice.id)}
                  className="rounded-2xl p-4 border-2"
                  style={{
                    backgroundColor:
                      selectedChoiceId === choice.id ? "#D7FF00" : "#1E1E1E",
                    borderColor:
                      selectedChoiceId === choice.id
                        ? "#D7FF00"
                        : "rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <View className="flex-row items-start justify-between mb-2">
                    <Text
                      className="text-sm font-jakarta-bold flex-1"
                      style={{
                        color:
                          selectedChoiceId === choice.id
                            ? "#070707"
                            : "#FFFFFF",
                      }}
                    >
                      {choice.text}
                    </Text>
                    <View
                      className="w-6 h-6 rounded-full border-2 items-center justify-center ml-2"
                      style={{
                        borderColor:
                          selectedChoiceId === choice.id
                            ? "#070707"
                            : "#666666",
                        backgroundColor:
                          selectedChoiceId === choice.id
                            ? "#070707"
                            : "transparent",
                      }}
                    >
                      {selectedChoiceId === choice.id && (
                        <Text className="text-[#D7FF00] text-xs">✓</Text>
                      )}
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2 flex-wrap">
                    <View
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor:
                          selectedChoiceId === choice.id
                            ? "rgba(7, 7, 7, 0.3)"
                            : "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Text
                        className="text-xs font-jakarta-medium"
                        style={{
                          color:
                            selectedChoiceId === choice.id
                              ? choice.financial_impact >= 0
                                ? "#4ECDC4"
                                : "#FF6B6B"
                              : choice.financial_impact >= 0
                                ? "#4ECDC4"
                                : "#FF6B6B",
                        }}
                      >
                        {choice.financial_impact >= 0 ? "+" : ""}₹
                        {Math.abs(choice.financial_impact).toLocaleString(
                          "en-IN"
                        )}
                      </Text>
                    </View>
                    <View
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor:
                          selectedChoiceId === choice.id
                            ? "rgba(7, 7, 7, 0.3)"
                            : "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Text
                        className="text-xs font-jakarta-regular"
                        style={{
                          color:
                            selectedChoiceId === choice.id
                              ? "#070707"
                              : "#999999",
                        }}
                      >
                        {choice.time_impact}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Submit Button */}
      <View className="p-6 pt-3">
        <TouchableOpacity
          onPress={handleSubmitChoice}
          disabled={!selectedChoiceId}
          className="rounded-2xl p-4 items-center"
          style={{
            backgroundColor: selectedChoiceId ? "#D7FF00" : "#333333",
          }}
        >
          <Text
            className="text-base font-jakarta-bold"
            style={{ color: selectedChoiceId ? "#070707" : "#666666" }}
          >
            {currentEventIndex === totalEvents - 1
              ? "Complete Simulation"
              : "Make Decision"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PersonaSimulation;
