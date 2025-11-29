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
import LoadingScreen from "@/components/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  sustainabilityScore: number;
  urgencyType: "Impulse" | "Strategic";
  psychologicalConsequence: string;
  opportunityCost: string;
  riskAssessment: string;
  regretLikelihood: number;
  wasOptimal: boolean;
}

const PersonaSimulation = () => {
  const params = useLocalSearchParams();
  const personaId = params.id as string;

  const [persona, setPersona] = useState<any>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>("");
  const [responses, setResponses] = useState<SimulationResponse[]>([]);
  const [showReport, setShowReport] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"event" | "future" | "psyche">(
    "event"
  );

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

    // Calculate decision quality metrics
    const betterChoicesCount = currentEvent.choices.filter(
      (c) =>
        c.financial_impact > selectedChoice.financial_impact &&
        c.future_liability <= selectedChoice.future_liability
    ).length;

    // Store response with comprehensive analytics
    const response: SimulationResponse = {
      selectedChoice,
      immediateImpact: selectedChoice.financial_impact,
      cumulativeImpact,
      behavioralPattern: selectedChoice.behavioral_tag,
      narrativeOutcome: selectedChoice.outcome_narrative,
      sustainabilityScore: Math.max(
        1,
        Math.min(10, 6 + Math.floor(selectedChoice.financial_impact / 5000))
      ),
      urgencyType:
        selectedChoice.future_liability > 0 ||
        selectedChoice.financial_impact < -2000
          ? "Impulse"
          : "Strategic",
      psychologicalConsequence:
        selectedChoice.financial_impact < 0
          ? "Relief at immediate solution, but lingering anxiety about future financial impact and sustainability."
          : selectedChoice.financial_impact > 0
            ? "Satisfaction from financial gain, but uncertainty about missed opportunities or future consequences."
            : "Mixed feelings of pragmatism and concern about long-term implications.",
      opportunityCost:
        selectedChoice.financial_impact < 0
          ? `Foregoing the chance to save or invest ₹${Math.abs(selectedChoice.financial_impact).toLocaleString("en-IN")} toward emergency funds or long-term goals.`
          : "Alternative paths that could have offered better risk-reward balance or security.",
      riskAssessment:
        selectedChoice.future_liability > 0
          ? `High risk: Future liability of ₹${selectedChoice.future_liability.toLocaleString("en-IN")} may lead to cash-flow pressure and increased debt burden.`
          : selectedChoice.financial_impact < -5000
            ? "Moderate risk: Significant immediate expense may reduce financial flexibility and emergency buffer."
            : selectedChoice.financial_impact < 0
              ? "Low to moderate risk: Manageable expense but requires monitoring for cumulative impact."
              : "Calculated decision with acceptable risk profile.",
      regretLikelihood:
        betterChoicesCount > 0 ? Math.min(0.8, betterChoicesCount * 0.3) : 0.2,
      wasOptimal: betterChoicesCount === 0,
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
        // Show loading screen before report
        setShowLoadingScreen(true);
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

    // Decision quality metrics
    const avgSustainability =
      responses.reduce((sum, r) => sum + r.sustainabilityScore, 0) /
      responses.length;
    const optimalDecisions = responses.filter((r) => r.wasOptimal).length;
    const avgRegretLikelihood =
      responses.reduce((sum, r) => sum + r.regretLikelihood, 0) /
      responses.length;
    const impulseCount = responses.filter(
      (r) => r.urgencyType === "Impulse"
    ).length;

    // Financial trajectory projections
    const monthlyAvgImpact = totalImpact / totalEvents;
    const projection3Month = {
      cumulativeImpact: monthlyAvgImpact * 3,
      projectedSavings: finalSavings + monthlyAvgImpact * 2,
      trend: monthlyAvgImpact >= 0 ? "positive" : "negative",
    };

    const projection6Month = {
      cumulativeImpact: monthlyAvgImpact * 6,
      projectedSavings: Math.max(0, finalSavings + monthlyAvgImpact * 5),
      debtTrajectory: finalDebt,
      healthScore: Math.max(
        0,
        Math.min(100, healthScore + monthlyAvgImpact / 1000)
      ),
    };

    const projection12Month = {
      cumulativeImpact: monthlyAvgImpact * 12,
      projectedSavings: Math.max(0, finalSavings + monthlyAvgImpact * 11),
      debtTrajectory: finalDebt,
      healthScore: Math.max(
        0,
        Math.min(100, healthScore + monthlyAvgImpact / 500)
      ),
      recoveryTimeMonths:
        totalImpact < 0
          ? Math.ceil(
              Math.abs(totalImpact) /
                (persona.financial_baseline.avg_monthly_income * 0.1)
            )
          : 0,
    };

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
      avgSustainability,
      optimalDecisions,
      avgRegretLikelihood,
      impulseCount,
      projection3Month,
      projection6Month,
      projection12Month,
    };
  };

  if (showLoadingScreen) {
    return (
      <LoadingScreen
        messages={[
          `Analyzing ${persona.name}'s financial choices...`,
          "Calculating cumulative impact...",
          "Mapping behavioral patterns...",
          "Generating predictive scenarios...",
        ]}
        onComplete={async () => {
          setShowLoadingScreen(false);
          setShowReport(true);

          // Save simulation to timeline
          const report = generateSimulationReport();

          // Get current user email
          const userStr = await AsyncStorage.getItem("arth_user");
          const user = userStr ? JSON.parse(userStr) : null;
          const userEmail = user?.email || "";

          const simulationEntry = {
            id: Date.now().toString(),
            type: "simulation",
            personaName: persona.display_profile.name,
            personaType: persona.type,
            totalImpact: report.totalImpact,
            finalSavings: report.finalSavings,
            healthScore: report.healthScore,
            dominantBehavior: report.dominantBehavior,
            eventsCompleted: totalEvents,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            userEmail: userEmail, // Add user email to filter entries by user
          };

          try {
            const existingTimeline =
              await AsyncStorage.getItem("arth_timeline");
            const timeline = existingTimeline
              ? JSON.parse(existingTimeline)
              : [];
            timeline.unshift(simulationEntry);
            // Keep only last 100 entries total (across all users)
            const trimmedTimeline = timeline.slice(0, 100);
            await AsyncStorage.setItem(
              "arth_timeline",
              JSON.stringify(trimmedTimeline)
            );
          } catch (error) {
            console.error("Failed to save simulation to timeline:", error);
          }
        }}
        duration={2500}
      />
    );
  }

  if (showReport) {
    const report = generateSimulationReport();

    return (
      <SafeAreaView className="flex-1 bg-[#070707]">
        {/* Header */}
        <View className="p-6 pb-4">
          <View className="items-center mb-6">
            <View className="w-20 h-20 rounded-full bg-[#D7FF00]/20 items-center justify-center mb-3 border-4 border-[#D7FF00]">
              <Text className="text-4xl">📊</Text>
            </View>
            <Text className="text-[#D7FF00] text-xs font-jakarta-bold mb-1">
              SIMULATION COMPLETE
            </Text>
            <Text className="text-white text-xl font-jakarta-bold text-center">
              {persona.display_profile.name}&apos;s Journey
            </Text>
            <Text className="text-gray-400 text-xs font-jakarta-regular mt-1">
              {totalEvents} Financial Decisions Analyzed
            </Text>
          </View>

          {/* Tab Segmented Control */}
          <View className="flex-row bg-neutral-900/95 rounded-full p-1 border border-white/10">
            <TouchableOpacity
              onPress={() => setActiveTab("event")}
              className="flex-1 rounded-full py-3 items-center"
              style={{
                backgroundColor:
                  activeTab === "event" ? "#D7FF00" : "transparent",
              }}
            >
              <Text
                className="text-sm font-jakarta-bold"
                style={{
                  color: activeTab === "event" ? "#070707" : "#999999",
                }}
              >
                Event
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("future")}
              className="flex-1 rounded-full py-3 items-center"
              style={{
                backgroundColor:
                  activeTab === "future" ? "#D7FF00" : "transparent",
              }}
            >
              <Text
                className="text-sm font-jakarta-bold"
                style={{
                  color: activeTab === "future" ? "#070707" : "#999999",
                }}
              >
                Future
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("psyche")}
              className="flex-1 rounded-full py-3 items-center"
              style={{
                backgroundColor:
                  activeTab === "psyche" ? "#D7FF00" : "transparent",
              }}
            >
              <Text
                className="text-sm font-jakarta-bold"
                style={{
                  color: activeTab === "psyche" ? "#070707" : "#999999",
                }}
              >
                Psyche
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6">
            {/* TAB 1: THE EVENT (IMMEDIATE IMPACT) */}
            {activeTab === "event" && (
              <View>
                {responses.map((response, index) => (
                  <View key={index} className="mb-4">
                    <Text className="text-white text-base font-jakarta-bold mb-3">
                      Event {index + 1}: {events[index].title}
                    </Text>

                    {/* Hero Card - Split Design */}
                    <View className="bg-neutral-900/95 rounded-3xl border border-white/10 overflow-hidden mb-4">
                      {/* Top Zone - Decision Made */}
                      <View className="bg-neutral-800 p-6">
                        <View className="flex-row items-center mb-4">
                          <View className="w-14 h-14 rounded-full bg-neutral-700 items-center justify-center mr-4">
                            <Text className="text-3xl">🔧</Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-gray-400 text-xs font-jakarta-regular mb-1">
                              YOUR DECISION
                            </Text>
                            <Text className="text-white text-base font-jakarta-bold">
                              {response.selectedChoice.text
                                .split("(")[0]
                                .trim()}
                            </Text>
                          </View>
                        </View>

                        {/* Financial Impact Badge */}
                        <View
                          className="self-start px-4 py-2 rounded-full"
                          style={{
                            backgroundColor:
                              response.immediateImpact >= 0
                                ? "rgba(78, 205, 196, 0.2)"
                                : "rgba(255, 107, 107, 0.2)",
                          }}
                        >
                          <Text
                            className="text-lg font-jakarta-bold"
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

                      {/* Bottom Zone - Psychological Analysis */}
                      <View
                        className="p-6"
                        style={{
                          backgroundColor: "rgba(255, 193, 7, 0.1)",
                          borderTopWidth: 2,
                          borderTopColor: "rgba(255, 193, 7, 0.3)",
                        }}
                      >
                        <Text className="text-gray-400 text-xs font-jakarta-regular mb-1">
                          PSYCHOLOGY
                        </Text>
                        <Text className="text-[#FFD93D] text-base font-jakarta-bold mb-3">
                          {response.behavioralPattern}
                        </Text>
                        <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                          {response.narrativeOutcome}
                        </Text>
                      </View>
                    </View>

                    {/* Insight Pills */}
                    <View className="flex-row gap-2 flex-wrap mb-4">
                      <View className="bg-neutral-900/95 border border-white/10 rounded-full px-4 py-2">
                        <Text className="text-gray-400 text-xs font-jakarta-regular">
                          Time Impact:{" "}
                          <Text className="text-white font-jakarta-bold">
                            {response.selectedChoice.time_impact}
                          </Text>
                        </Text>
                      </View>
                      <View className="bg-neutral-900/95 border border-white/10 rounded-full px-4 py-2">
                        <Text className="text-gray-400 text-xs font-jakarta-regular">
                          Decision:{" "}
                          <Text className="text-white font-jakarta-bold">
                            {response.urgencyType}
                          </Text>
                        </Text>
                      </View>
                      <View
                        className="border rounded-full px-4 py-2"
                        style={{
                          backgroundColor:
                            response.sustainabilityScore >= 7
                              ? "rgba(78, 205, 196, 0.1)"
                              : response.sustainabilityScore >= 4
                                ? "rgba(255, 211, 61, 0.1)"
                                : "rgba(255, 107, 107, 0.1)",
                          borderColor:
                            response.sustainabilityScore >= 7
                              ? "rgba(78, 205, 196, 0.3)"
                              : response.sustainabilityScore >= 4
                                ? "rgba(255, 211, 61, 0.3)"
                                : "rgba(255, 107, 107, 0.3)",
                        }}
                      >
                        <Text
                          className="text-xs font-jakarta-bold"
                          style={{
                            color:
                              response.sustainabilityScore >= 7
                                ? "#4ECDC4"
                                : response.sustainabilityScore >= 4
                                  ? "#FFD93D"
                                  : "#FF6B6B",
                          }}
                        >
                          Sustainability: {response.sustainabilityScore}/10
                        </Text>
                      </View>
                      {response.selectedChoice.future_liability > 0 && (
                        <View className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-full px-4 py-2">
                          <Text className="text-[#FF6B6B] text-xs font-jakarta-bold">
                            Future Risk: ₹
                            {response.selectedChoice.future_liability.toLocaleString(
                              "en-IN"
                            )}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Deep Analysis Card */}
                    <View className="bg-neutral-900/95 rounded-2xl p-5 border border-white/10 mb-6">
                      <Text className="text-white text-base font-jakarta-bold mb-4">
                        🧠 Deep Analysis
                      </Text>
                      <View className="gap-4">
                        <View>
                          <Text className="text-gray-400 text-xs font-jakarta-bold mb-1.5">
                            PSYCHOLOGICAL IMPACT
                          </Text>
                          <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                            {response.psychologicalConsequence}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-gray-400 text-xs font-jakarta-bold mb-1.5">
                            OPPORTUNITY COST
                          </Text>
                          <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                            {response.opportunityCost}
                          </Text>
                        </View>
                        <View>
                          <Text className="text-gray-400 text-xs font-jakarta-bold mb-1.5">
                            RISK ASSESSMENT
                          </Text>
                          <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                            {response.riskAssessment}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Decision Quality Badge */}
                    <View
                      className="rounded-2xl p-4 mb-6 border-2"
                      style={{
                        backgroundColor: response.wasOptimal
                          ? "rgba(78, 205, 196, 0.1)"
                          : "rgba(255, 107, 107, 0.1)",
                        borderColor: response.wasOptimal
                          ? "#4ECDC4"
                          : "#FF6B6B",
                      }}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <Text
                            className="text-xs font-jakarta-bold mb-1"
                            style={{
                              color: response.wasOptimal
                                ? "#4ECDC4"
                                : "#FF6B6B",
                            }}
                          >
                            DECISION QUALITY
                          </Text>
                          <Text className="text-white text-base font-jakarta-bold">
                            {response.wasOptimal
                              ? "Optimal Choice"
                              : "Sub-optimal Choice"}
                          </Text>
                        </View>
                        <View className="items-end">
                          <Text className="text-gray-400 text-xs font-jakarta-regular mb-1">
                            Regret Risk
                          </Text>
                          <Text
                            className="text-lg font-jakarta-bold"
                            style={{
                              color: response.wasOptimal
                                ? "#4ECDC4"
                                : "#FF6B6B",
                            }}
                          >
                            {(response.regretLikelihood * 100).toFixed(0)}%
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* TAB 2: THE BUTTERFLY EFFECT (TRAJECTORY) */}
            {activeTab === "future" && (
              <View>
                <Text className="text-white text-xl font-jakarta-bold mb-2">
                  12-Month Projection
                </Text>
                <Text className="text-gray-400 text-sm font-jakarta-regular mb-6">
                  The compound effect of your decisions
                </Text>

                {/* Decision Quality Overview */}
                <View
                  className="rounded-2xl p-5 mb-4 border-2"
                  style={{
                    backgroundColor:
                      report.optimalDecisions > totalEvents / 2
                        ? "rgba(78, 205, 196, 0.1)"
                        : "rgba(255, 107, 107, 0.1)",
                    borderColor:
                      report.optimalDecisions > totalEvents / 2
                        ? "#4ECDC4"
                        : "#FF6B6B",
                  }}
                >
                  <View className="flex-row items-center mb-3">
                    <Text className="text-3xl mr-3">
                      {report.optimalDecisions > totalEvents / 2 ? "✅" : "⚠️"}
                    </Text>
                    <View className="flex-1">
                      <Text
                        className="text-xs font-jakarta-bold mb-1"
                        style={{
                          color:
                            report.optimalDecisions > totalEvents / 2
                              ? "#4ECDC4"
                              : "#FF6B6B",
                        }}
                      >
                        OVERALL DECISION QUALITY
                      </Text>
                      <Text className="text-white text-lg font-jakarta-bold">
                        {report.optimalDecisions > totalEvents / 2
                          ? "Strong Financial Path"
                          : "High-Risk Path"}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2 flex-wrap">
                    <View className="bg-neutral-900/95 rounded-full px-3 py-1.5">
                      <Text className="text-gray-300 text-xs font-jakarta-regular">
                        Optimal:{" "}
                        <Text className="text-white font-jakarta-bold">
                          {report.optimalDecisions}/{totalEvents}
                        </Text>
                      </Text>
                    </View>
                    <View className="bg-neutral-900/95 rounded-full px-3 py-1.5">
                      <Text className="text-gray-300 text-xs font-jakarta-regular">
                        Regret Risk:{" "}
                        <Text className="text-white font-jakarta-bold">
                          {(report.avgRegretLikelihood * 100).toFixed(0)}%
                        </Text>
                      </Text>
                    </View>
                    <View className="bg-neutral-900/95 rounded-full px-3 py-1.5">
                      <Text className="text-gray-300 text-xs font-jakarta-regular">
                        Impulse:{" "}
                        <Text className="text-white font-jakarta-bold">
                          {report.impulseCount}/{totalEvents}
                        </Text>
                      </Text>
                    </View>
                    <View className="bg-neutral-900/95 rounded-full px-3 py-1.5">
                      <Text className="text-gray-300 text-xs font-jakarta-regular">
                        Sustainability:{" "}
                        <Text className="text-white font-jakarta-bold">
                          {report.avgSustainability.toFixed(1)}/10
                        </Text>
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Visual Graph Representation */}
                <View className="bg-neutral-900/95 rounded-3xl p-6 border border-white/10 mb-4">
                  <Text className="text-white text-base font-jakarta-bold mb-4">
                    Financial Trajectory
                  </Text>

                  {/* Graph Visualization */}
                  <View className="mb-6">
                    {/* Starting Point */}
                    <View className="flex-row items-center mb-3">
                      <View className="w-3 h-3 rounded-full bg-[#4ECDC4]" />
                      <Text className="text-gray-400 text-xs font-jakarta-regular ml-2">
                        Starting Savings: ₹
                        {persona.financial_baseline.savings_balance.toLocaleString(
                          "en-IN"
                        )}
                      </Text>
                    </View>

                    {/* Graph Lines Container */}
                    <View className="h-40 bg-neutral-800/50 rounded-xl p-4 mb-3 relative">
                      {/* Grid Lines */}
                      <View className="absolute inset-0 p-4">
                        <View className="h-full justify-between">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <View
                              key={i}
                              className="h-px bg-white/5"
                              style={{ width: "100%" }}
                            />
                          ))}
                        </View>
                      </View>

                      {/* Actual Path (Declining) */}
                      <View className="absolute bottom-4 left-4 right-4">
                        <View className="flex-row items-end justify-between h-32">
                          {/* 3 Month */}
                          <View className="items-center">
                            <View
                              className="w-2 rounded-full bg-[#FF6B6B]"
                              style={{
                                height: Math.max(
                                  20,
                                  (report.finalSavings /
                                    persona.financial_baseline
                                      .savings_balance) *
                                    100
                                ),
                              }}
                            />
                            <Text className="text-gray-500 text-[10px] font-jakarta-regular mt-2">
                              3M
                            </Text>
                          </View>

                          {/* 6 Month */}
                          <View className="items-center">
                            <View
                              className="w-2 rounded-full bg-[#FF6B6B]"
                              style={{
                                height: Math.max(
                                  15,
                                  (report.finalSavings /
                                    persona.financial_baseline
                                      .savings_balance) *
                                    80
                                ),
                              }}
                            />
                            <Text className="text-gray-500 text-[10px] font-jakarta-regular mt-2">
                              6M
                            </Text>
                          </View>

                          {/* 12 Month */}
                          <View className="items-center">
                            <View
                              className="w-2 rounded-full bg-[#FF6B6B]"
                              style={{
                                height: Math.max(
                                  10,
                                  (report.finalSavings /
                                    persona.financial_baseline
                                      .savings_balance) *
                                    60
                                ),
                              }}
                            />
                            <Text className="text-gray-500 text-[10px] font-jakarta-regular mt-2">
                              12M
                            </Text>
                          </View>
                        </View>
                      </View>

                      {/* Optimal Path Line (Dotted) */}
                      <View className="absolute top-1/2 left-4 right-4">
                        <View
                          style={{
                            borderTopWidth: 2,
                            borderTopColor: "#4ECDC4",
                            borderStyle: "dashed",
                          }}
                        />
                      </View>
                    </View>

                    {/* Legend */}
                    <View className="flex-row gap-4">
                      <View className="flex-row items-center">
                        <View className="w-3 h-3 rounded-full bg-[#FF6B6B] mr-2" />
                        <Text className="text-gray-400 text-xs font-jakarta-regular">
                          Your Path
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <View
                          className="w-3 h-0.5 bg-[#4ECDC4] mr-2"
                          style={{ borderStyle: "dashed" }}
                        />
                        <Text className="text-gray-400 text-xs font-jakarta-regular">
                          Optimal Path
                        </Text>
                      </View>
                    </View>

                    {/* Gap Analysis */}
                    <View className="mt-4 bg-[#FF6B6B]/10 rounded-xl p-4 border border-[#FF6B6B]/30">
                      <Text className="text-[#FF6B6B] text-xs font-jakarta-bold mb-1">
                        HIDDEN COST OF DECISIONS
                      </Text>
                      <Text className="text-white text-2xl font-jakarta-bold">
                        ₹{Math.abs(report.totalImpact).toLocaleString("en-IN")}
                      </Text>
                      <Text className="text-gray-400 text-xs font-jakarta-regular mt-1">
                        Total impact over {totalEvents} events
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Three Projection Cards */}
                <Text className="text-white text-base font-jakarta-bold mb-3">
                  Financial Projections
                </Text>

                {/* 3-Month Projection */}
                <View className="bg-neutral-900/95 rounded-2xl p-4 border border-white/10 mb-3">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-gray-400 text-xs font-jakarta-bold">
                      3-MONTH OUTLOOK
                    </Text>
                    <View
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor:
                          report.projection3Month.trend === "positive"
                            ? "rgba(78, 205, 196, 0.2)"
                            : "rgba(255, 107, 107, 0.2)",
                      }}
                    >
                      <Text
                        className="text-xs font-jakarta-bold"
                        style={{
                          color:
                            report.projection3Month.trend === "positive"
                              ? "#4ECDC4"
                              : "#FF6B6B",
                        }}
                      >
                        {report.projection3Month.trend.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-white text-sm font-jakarta-regular">
                      Cumulative Impact
                    </Text>
                    <Text
                      className="text-lg font-jakarta-bold"
                      style={{
                        color:
                          report.projection3Month.cumulativeImpact >= 0
                            ? "#4ECDC4"
                            : "#FF6B6B",
                      }}
                    >
                      {report.projection3Month.cumulativeImpact >= 0 ? "+" : ""}
                      ₹
                      {Math.abs(
                        report.projection3Month.cumulativeImpact
                      ).toLocaleString("en-IN")}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-gray-400 text-xs font-jakarta-regular">
                      Projected Savings
                    </Text>
                    <Text className="text-[#D7FF00] text-sm font-jakarta-bold">
                      ₹
                      {report.projection3Month.projectedSavings.toLocaleString(
                        "en-IN"
                      )}
                    </Text>
                  </View>
                </View>

                {/* 6-Month Projection */}
                <View className="bg-neutral-900/95 rounded-2xl p-4 border border-white/10 mb-3">
                  <Text className="text-gray-400 text-xs font-jakarta-bold mb-2">
                    6-MONTH OUTLOOK
                  </Text>
                  <View className="gap-2">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white text-sm font-jakarta-regular">
                        Cumulative Impact
                      </Text>
                      <Text
                        className="text-lg font-jakarta-bold"
                        style={{
                          color:
                            report.projection6Month.cumulativeImpact >= 0
                              ? "#4ECDC4"
                              : "#FF6B6B",
                        }}
                      >
                        {report.projection6Month.cumulativeImpact >= 0
                          ? "+"
                          : ""}
                        ₹
                        {Math.abs(
                          report.projection6Month.cumulativeImpact
                        ).toLocaleString("en-IN")}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-400 text-xs font-jakarta-regular">
                        Projected Savings
                      </Text>
                      <Text className="text-[#D7FF00] text-sm font-jakarta-bold">
                        ₹
                        {report.projection6Month.projectedSavings.toLocaleString(
                          "en-IN"
                        )}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-400 text-xs font-jakarta-regular">
                        Health Score
                      </Text>
                      <Text
                        className="text-sm font-jakarta-bold"
                        style={{
                          color:
                            report.projection6Month.healthScore >= 70
                              ? "#4ECDC4"
                              : report.projection6Month.healthScore >= 40
                                ? "#FFD93D"
                                : "#FF6B6B",
                        }}
                      >
                        {report.projection6Month.healthScore.toFixed(0)}/100
                      </Text>
                    </View>
                  </View>
                </View>

                {/* 12-Month Projection */}
                <View className="bg-neutral-900/95 rounded-2xl p-4 border border-white/10 mb-4">
                  <Text className="text-gray-400 text-xs font-jakarta-bold mb-2">
                    12-MONTH OUTLOOK
                  </Text>
                  <View className="gap-2">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-white text-sm font-jakarta-regular">
                        Cumulative Impact
                      </Text>
                      <Text
                        className="text-lg font-jakarta-bold"
                        style={{
                          color:
                            report.projection12Month.cumulativeImpact >= 0
                              ? "#4ECDC4"
                              : "#FF6B6B",
                        }}
                      >
                        {report.projection12Month.cumulativeImpact >= 0
                          ? "+"
                          : ""}
                        ₹
                        {Math.abs(
                          report.projection12Month.cumulativeImpact
                        ).toLocaleString("en-IN")}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-400 text-xs font-jakarta-regular">
                        Projected Savings
                      </Text>
                      <Text className="text-[#D7FF00] text-sm font-jakarta-bold">
                        ₹
                        {report.projection12Month.projectedSavings.toLocaleString(
                          "en-IN"
                        )}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-400 text-xs font-jakarta-regular">
                        Debt Trajectory
                      </Text>
                      <Text className="text-white text-sm font-jakarta-bold">
                        ₹
                        {report.projection12Month.debtTrajectory.toLocaleString(
                          "en-IN"
                        )}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <Text className="text-gray-400 text-xs font-jakarta-regular">
                        Health Score
                      </Text>
                      <Text
                        className="text-sm font-jakarta-bold"
                        style={{
                          color:
                            report.projection12Month.healthScore >= 70
                              ? "#4ECDC4"
                              : report.projection12Month.healthScore >= 40
                                ? "#FFD93D"
                                : "#FF6B6B",
                        }}
                      >
                        {report.projection12Month.healthScore.toFixed(0)}/100
                      </Text>
                    </View>
                    {report.projection12Month.recoveryTimeMonths > 0 && (
                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-400 text-xs font-jakarta-regular">
                          Recovery Time
                        </Text>
                        <Text className="text-[#FF6B6B] text-sm font-jakarta-bold">
                          {report.projection12Month.recoveryTimeMonths} months
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Trend Analysis */}
                <View className="bg-neutral-900/95 rounded-2xl p-5 border border-white/10">
                  <Text className="text-white text-base font-jakarta-bold mb-3">
                    📊 Trend Analysis
                  </Text>
                  <View className="gap-3">
                    <View className="flex-row items-center">
                      <View
                        className="w-2 h-2 rounded-full mr-3"
                        style={{
                          backgroundColor:
                            report.finalSavings >
                            persona.financial_baseline.savings_balance
                              ? "#4ECDC4"
                              : "#FF6B6B",
                        }}
                      />
                      <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                        Savings{" "}
                        {report.finalSavings >
                        persona.financial_baseline.savings_balance
                          ? "increased"
                          : "decreased"}{" "}
                        by ₹
                        {Math.abs(
                          report.finalSavings -
                            persona.financial_baseline.savings_balance
                        ).toLocaleString("en-IN")}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="w-2 h-2 rounded-full bg-[#FFD93D] mr-3" />
                      <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                        Average impact per decision: ₹
                        {Math.abs(report.avgImpact).toFixed(0)}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View
                        className="w-2 h-2 rounded-full mr-3"
                        style={{
                          backgroundColor:
                            report.positiveDecisions > totalEvents / 2
                              ? "#4ECDC4"
                              : "#FF6B6B",
                        }}
                      />
                      <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                        {report.positiveDecisions} out of {totalEvents}{" "}
                        decisions were financially positive
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* TAB 3: THE MIRROR (BEHAVIORAL) */}
            {activeTab === "psyche" && (
              <View>
                <Text className="text-white text-xl font-jakarta-bold mb-2">
                  The Road Not Taken
                </Text>
                <Text className="text-gray-400 text-sm font-jakarta-regular mb-6">
                  Alternative paths and behavioral insights
                </Text>

                {/* Archetype Badge */}
                <View className="items-center mb-6">
                  <View className="bg-gradient-to-br from-[#D7FF00]/20 to-[#4ECDC4]/20 rounded-3xl p-8 border-2 border-[#D7FF00] items-center w-full">
                    <Text className="text-gray-400 text-xs font-jakarta-bold mb-2">
                      YOUR ARCHETYPE
                    </Text>
                    <Text className="text-[#D7FF00] text-3xl font-jakarta-bold text-center">
                      {report.dominantBehavior.toUpperCase()}
                    </Text>
                    <View className="mt-4 bg-[#070707]/50 rounded-xl px-4 py-2">
                      <Text className="text-gray-300 text-xs font-jakarta-regular text-center">
                        Appeared{" "}
                        {report.behaviorCounts[report.dominantBehavior]}x in{" "}
                        {totalEvents} events
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Vulnerability Indicators */}
                <View className="bg-[#FF6B6B]/10 rounded-2xl p-5 mb-4 border border-[#FF6B6B]/30">
                  <Text className="text-[#FF6B6B] text-xs font-jakarta-bold mb-2">
                    🚨 VULNERABILITY INDICATORS
                  </Text>
                  <Text className="text-white text-base font-jakarta-bold mb-3">
                    Financial Risk Factors
                  </Text>
                  <View className="gap-2">
                    {responses.filter(
                      (r) =>
                        r.selectedChoice.future_liability > 0 ||
                        r.immediateImpact < -5000
                    ).length > 0 && (
                      <View className="flex-row items-start">
                        <Text className="text-[#FF6B6B] text-lg mr-2">•</Text>
                        <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                          High leverage or fixed expenses relative to variable
                          income
                        </Text>
                      </View>
                    )}
                    {report.impulseCount > totalEvents / 2 && (
                      <View className="flex-row items-start">
                        <Text className="text-[#FF6B6B] text-lg mr-2">•</Text>
                        <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                          Pattern of impulsive decisions over strategic planning
                          ({report.impulseCount} out of {totalEvents})
                        </Text>
                      </View>
                    )}
                    {report.finalSavings <
                      persona.financial_baseline.avg_monthly_income && (
                      <View className="flex-row items-start">
                        <Text className="text-[#FF6B6B] text-lg mr-2">•</Text>
                        <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                          Limited emergency fund buffer (less than one
                          month&apos;s income)
                        </Text>
                      </View>
                    )}
                    {report.riskDecisions > 2 && (
                      <View className="flex-row items-start">
                        <Text className="text-[#FF6B6B] text-lg mr-2">•</Text>
                        <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                          Multiple high-risk decisions increasing financial
                          exposure
                        </Text>
                      </View>
                    )}
                    {report.optimalDecisions < totalEvents / 2 && (
                      <View className="flex-row items-start">
                        <Text className="text-[#FF6B6B] text-lg mr-2">•</Text>
                        <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                          Majority of decisions were sub-optimal, missing better
                          alternatives
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Adaptive Capacity */}
                <View className="bg-neutral-900/95 rounded-2xl p-5 mb-4 border border-white/10">
                  <Text className="text-white text-base font-jakarta-bold mb-3">
                    💪 Adaptive Capacity
                  </Text>
                  <View className="gap-3">
                    <View>
                      <Text className="text-gray-400 text-xs font-jakarta-bold mb-1">
                        FINANCIAL RESILIENCE
                      </Text>
                      <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                        {report.finalSavings >=
                        persona.financial_baseline.avg_monthly_income * 2
                          ? "Strong - Multiple months of savings buffer available for shocks"
                          : report.finalSavings >=
                              persona.financial_baseline.avg_monthly_income
                            ? "Moderate - One month buffer exists, but repeated shocks could erode capacity"
                            : "Low - Minimal savings buffer, vulnerable to income disruptions"}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-gray-400 text-xs font-jakarta-bold mb-1">
                        DECISION PATTERN
                      </Text>
                      <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                        {report.optimalDecisions > totalEvents / 2
                          ? "Strategic - Majority of decisions prioritized long-term stability"
                          : report.impulseCount > totalEvents / 2
                            ? "Reactive - High proportion of impulse decisions under pressure"
                            : "Mixed - Balance between strategic and reactive choices"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* What If Scenarios - Per Event */}
                <Text className="text-white text-base font-jakarta-bold mb-3">
                  Alternative Decisions
                </Text>
                {responses.map((response, index) => {
                  const event = events[index];
                  const alternativeChoices = event.choices.filter(
                    (c) => c.id !== response.selectedChoice.id
                  );

                  return (
                    <View key={index} className="mb-4">
                      <Text className="text-gray-400 text-xs font-jakarta-regular mb-2">
                        Event {index + 1}: {event.title}
                      </Text>

                      {/* Your Choice Card */}
                      <View className="bg-neutral-900/95 rounded-2xl p-4 mb-2 border-2 border-[#D7FF00]">
                        <View className="flex-row items-start justify-between mb-2">
                          <View className="flex-1">
                            <View className="flex-row items-center mb-2">
                              <View className="bg-[#D7FF00] px-2 py-1 rounded mr-2">
                                <Text className="text-[#070707] text-[10px] font-jakarta-bold">
                                  YOUR CHOICE
                                </Text>
                              </View>
                              {response.immediateImpact < 0 ? (
                                <Text className="text-xs">⚠️</Text>
                              ) : (
                                <Text className="text-xs">✅</Text>
                              )}
                            </View>
                            <Text className="text-white text-sm font-jakarta-bold mb-1">
                              {response.selectedChoice.text
                                .split("(")[0]
                                .trim()}
                            </Text>
                            <Text className="text-gray-400 text-xs font-jakarta-regular">
                              {response.narrativeOutcome}
                            </Text>
                          </View>
                        </View>
                        <View className="flex-row items-center gap-2 flex-wrap">
                          <View
                            className="px-3 py-1 rounded-full"
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
                              {response.immediateImpact >= 0
                                ? "Saved"
                                : "Spent"}{" "}
                              ₹
                              {Math.abs(
                                response.immediateImpact
                              ).toLocaleString("en-IN")}
                            </Text>
                          </View>
                          {response.selectedChoice.future_liability > 0 && (
                            <View className="bg-[#FF6B6B]/20 px-3 py-1 rounded-full">
                              <Text className="text-[#FF6B6B] text-xs font-jakarta-bold">
                                Risk: High
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      {/* Alternative Choices */}
                      {alternativeChoices.slice(0, 2).map((altChoice) => {
                        const financialDiff =
                          altChoice.financial_impact - response.immediateImpact;
                        const wasBetter = altChoice.future_liability === 0;

                        return (
                          <View
                            key={altChoice.id}
                            className="bg-neutral-900/95 rounded-2xl p-4 mb-2 border border-white/10"
                          >
                            <View className="flex-row items-start justify-between mb-2">
                              <View className="flex-1">
                                <View className="flex-row items-center mb-2">
                                  <View className="bg-neutral-800 px-2 py-1 rounded mr-2">
                                    <Text className="text-gray-400 text-[10px] font-jakarta-bold">
                                      ALTERNATIVE
                                    </Text>
                                  </View>
                                  {wasBetter && (
                                    <Text className="text-xs">🛡️</Text>
                                  )}
                                </View>
                                <Text className="text-white text-sm font-jakarta-bold mb-1">
                                  {altChoice.text.split("(")[0].trim()}
                                </Text>
                                <Text className="text-gray-400 text-xs font-jakarta-regular">
                                  {altChoice.outcome_narrative}
                                </Text>
                              </View>
                            </View>
                            <View className="flex-row items-center gap-2 flex-wrap">
                              <View
                                className="px-3 py-1 rounded-full"
                                style={{
                                  backgroundColor:
                                    financialDiff > 0
                                      ? "rgba(255, 107, 107, 0.2)"
                                      : "rgba(78, 205, 196, 0.2)",
                                }}
                              >
                                <Text
                                  className="text-xs font-jakarta-bold"
                                  style={{
                                    color:
                                      financialDiff > 0 ? "#FF6B6B" : "#4ECDC4",
                                  }}
                                >
                                  {financialDiff > 0 ? "Cost" : "Saved"} ₹
                                  {Math.abs(financialDiff).toLocaleString(
                                    "en-IN"
                                  )}{" "}
                                  {financialDiff > 0 ? "more" : "less"}
                                </Text>
                              </View>
                              {wasBetter && (
                                <View className="bg-[#4ECDC4]/20 px-3 py-1 rounded-full">
                                  <Text className="text-[#4ECDC4] text-xs font-jakarta-bold">
                                    Guaranteed Safety
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  );
                })}

                {/* Behavioral Breakdown */}
                <View className="bg-neutral-900/95 rounded-2xl p-5 mb-4 border border-white/10">
                  <Text className="text-white text-base font-jakarta-bold mb-4">
                    🧠 Behavioral Breakdown
                  </Text>
                  <View className="gap-2">
                    {Object.entries(report.behaviorCounts).map(
                      ([behavior, count]) => {
                        const percentage =
                          ((count as number) / totalEvents) * 100;
                        return (
                          <View key={behavior}>
                            <View className="flex-row items-center justify-between mb-2">
                              <Text className="text-gray-300 text-sm font-jakarta-regular">
                                {behavior}
                              </Text>
                              <Text className="text-white text-sm font-jakarta-bold">
                                {count}x ({percentage.toFixed(0)}%)
                              </Text>
                            </View>
                            <View className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                              <View
                                className="h-full rounded-full"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor:
                                    behavior === report.dominantBehavior
                                      ? "#D7FF00"
                                      : "#4ECDC4",
                                }}
                              />
                            </View>
                          </View>
                        );
                      }
                    )}
                  </View>
                </View>

                {/* Peer Comparison */}
                <View className="bg-[#4ECDC4]/10 rounded-2xl p-5 mb-4 border border-[#4ECDC4]/30">
                  <Text className="text-[#4ECDC4] text-xs font-jakarta-bold mb-2">
                    👥 PEER COMPARISON
                  </Text>
                  <Text className="text-white text-sm font-jakarta-regular leading-5 mb-3">
                    Compared to similar{" "}
                    {persona.display_profile.occupation || "gig workers"} in
                    your demographic:
                  </Text>
                  <View className="gap-2">
                    <View className="flex-row items-start">
                      <Text className="text-[#4ECDC4] text-lg mr-2">•</Text>
                      <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                        Those who made{" "}
                        <Text className="text-[#D7FF00] font-jakarta-bold">
                          more cautious decisions
                        </Text>{" "}
                        maintained{" "}
                        <Text className="text-[#D7FF00] font-jakarta-bold">
                          40% higher savings
                        </Text>
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="text-[#4ECDC4] text-lg mr-2">•</Text>
                      <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                        Peers with{" "}
                        <Text className="text-[#D7FF00] font-jakarta-bold">
                          strategic planning
                        </Text>{" "}
                        experienced{" "}
                        <Text className="text-[#D7FF00] font-jakarta-bold">
                          30% less financial stress
                        </Text>
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="text-[#4ECDC4] text-lg mr-2">•</Text>
                      <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                        Your decision pattern is{" "}
                        {report.optimalDecisions > totalEvents / 2
                          ? "above"
                          : "below"}{" "}
                        average for your peer group
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Intervention Opportunities */}
                <View className="bg-[#D7FF00]/10 rounded-2xl p-5 border border-[#D7FF00]/30">
                  <Text className="text-[#D7FF00] text-xs font-jakarta-bold mb-2">
                    💡 INTERVENTION OPPORTUNITIES
                  </Text>
                  <Text className="text-white text-base font-jakarta-bold mb-3">
                    Recommended Actions
                  </Text>
                  <View className="gap-2">
                    <View className="flex-row items-start">
                      <Text className="text-[#D7FF00] text-lg mr-2">1.</Text>
                      <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                        Build emergency fund equal to 3 months of expenses
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="text-[#D7FF00] text-lg mr-2">2.</Text>
                      <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                        Access financial literacy resources focused on
                        cost-benefit analysis
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="text-[#D7FF00] text-lg mr-2">3.</Text>
                      <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                        Consider micro-credit options for proper asset
                        maintenance
                      </Text>
                    </View>
                    <View className="flex-row items-start">
                      <Text className="text-[#D7FF00] text-lg mr-2">4.</Text>
                      <Text className="text-gray-300 text-sm font-jakarta-regular flex-1">
                        Join peer support groups to share best practices
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View className="px-6 pt-6">
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
