import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AssessmentReport() {
  const params = useLocalSearchParams();
  const responses = JSON.parse(params.responses as string);
  const archetype = params.archetype as string;

  const [activeTab, setActiveTab] = useState<"diagnosis" | "action" | "scores">(
    "diagnosis"
  );

  // Generate report data based on archetype
  const getReportData = () => {
    const archetypeMap: { [key: string]: any } = {
      saver: {
        title: "The Anxious Guardian",
        icon: "🛡️",
        color: "#4ECDC4",
        mindsetScores: {
          literacy: 75,
          anxiety: 85,
          discipline: 95,
          risk_tolerance: 15,
        },
        summary:
          "Your financial history suggests a background where money was scarce or a source of conflict. As a result, you have developed a 'Scarcity Mindset.' You are excellent at saving and avoiding debt, but your anxiety prevents you from enjoying your money or investing it for growth. You view money as a shield against danger rather than a tool for opportunity.",
        goodNews:
          "You have a superpower that 90% of people lack: discipline. Most people struggle with impulse control and consumer debt. You have the opposite traits. You are cautious, responsible, and have built a strong defense. However, in finance as in sports, defense keeps you in the game, but offense wins it.",
        keyBlockers: [
          "Fear of market volatility and investment risk",
          "Guilt associated with non-essential spending",
          "Hoarding cash that loses value to inflation (silent thief)",
          "Checking bank balance multiple times daily",
        ],
        actionPlan: [
          {
            title: "The 'Mandatory Fun' Rule",
            subtitle: "To cure guilt",
            description:
              "Open a separate account and put 5% of your monthly income into it. You MUST spend this money by month-end on something frivolous. If you save it, you've failed the assignment. By making spending a 'rule,' you trick your brain into accepting it as responsible.",
          },
          {
            title: "Automated 'Exposure Therapy'",
            subtitle: "To cure risk fear",
            description:
              "Set up automatic ₹5,000/month transfer into a low-cost index fund. You're forbidden from checking this account for 90 days. You can afford to lose ₹5,000. Over time, you'll see markets fluctuate, but the world doesn't end. This builds your 'investment muscle.'",
          },
          {
            title: "The 'CFO Meeting'",
            subtitle: "To cure anxiety",
            description:
              "Delete banking apps from your phone. Schedule a recurring Friday 9 AM calendar invite - this is your 'CFO Meeting.' This is the ONLY time you check balances and pay bills. Move from 'obsessive worrying' to 'strategic managing.'",
          },
        ],
      },
      investor: {
        title: "The Calculated Risk-Taker",
        icon: "📈",
        color: "#D7FF00",
        mindsetScores: {
          literacy: 85,
          anxiety: 35,
          discipline: 70,
          risk_tolerance: 90,
        },
        summary:
          "You understand that money is a tool for growth, not just security. You're willing to take calculated risks and have educated yourself on investment principles. However, your confidence in risk-taking may sometimes lead to overextension or neglecting emergency funds for immediate opportunities.",
        goodNews:
          "You have the growth mindset that builds wealth. You understand leverage, compounding, and opportunity cost. Most people stay poor because they're too afraid to invest. You're not one of them.",
        keyBlockers: [
          "Overconfidence leading to concentrated positions",
          "Neglecting liquid emergency funds",
          "Chasing returns without risk assessment",
          "FOMO (Fear of Missing Out) driving decisions",
        ],
        actionPlan: [
          {
            title: "The 'Sleep Well' Buffer",
            subtitle: "Balance growth with security",
            description:
              "Before investing another rupee, build 6 months of expenses in a high-yield savings account. This buffer lets you ride out market crashes without panic-selling. Your aggressive portfolio is only an asset if you can hold it.",
          },
          {
            title: "The 'Portfolio Audit'",
            subtitle: "Manage concentration risk",
            description:
              "Review your holdings monthly. If any single stock exceeds 20% of your portfolio, trim it. Wealth is built through returns; it's protected through diversification. Don't let one winning bet become a losing bet.",
          },
          {
            title: "The 'Red Flag' Checklist",
            subtitle: "Prevent emotional investing",
            description:
              "Before any investment, ask: (1) Can I explain this to my grandmother? (2) Would I be okay if this went to zero? (3) Am I buying because of FOMO? If you can't answer confidently, don't invest.",
          },
        ],
      },
      spender: {
        title: "The Experience Maximizer",
        icon: "🎪",
        color: "#FF6B6B",
        mindsetScores: {
          literacy: 55,
          anxiety: 40,
          discipline: 35,
          risk_tolerance: 60,
        },
        summary:
          "You believe money exists to be enjoyed, and you're not wrong. You prioritize experiences and immediate gratification over delayed rewards. However, 'Retail Therapy' and impulse purchases may be masking deeper emotional needs, and the lack of financial buffer creates future vulnerability.",
        goodNews:
          "You understand what many 'savers' don't: life is short, and experiences matter. The key is making sure today's fun doesn't steal from tomorrow's security. We're going to build a system that lets you enjoy life without the guilt or risk.",
        keyBlockers: [
          "Impulse buying as emotional coping mechanism",
          "Lack of budget leading to 'money disappears' feeling",
          "Hiding purchases from partners (shame spiral)",
          "No emergency fund for unexpected expenses",
        ],
        actionPlan: [
          {
            title: "The '24-Hour Rule'",
            subtitle: "Break impulse loops",
            description:
              "For any non-essential purchase over ₹5,000, wait 24 hours before buying. Add it to a wishlist. If you still want it tomorrow, buy it guilt-free. This breaks the dopamine-driven impulse while still allowing pleasure.",
          },
          {
            title: "The 'Fun Budget'",
            subtitle: "Spend without guilt",
            description:
              "Calculate 20% of your monthly income as your 'No Questions Asked' fund. This money is for experiences, treats, impulse buys - whatever. Once it's gone, it's gone. This prevents overspending while allowing freedom.",
          },
          {
            title: "The 'Future You' Fund",
            subtitle: "Build your safety net",
            description:
              "Automate 10% of income to a savings account you can't easily access. Label it 'Future You Fund.' This isn't for investing - it's your cushion. When you hit 3 months of expenses, you've won. Then keep going.",
          },
        ],
      },
      avoider: {
        title: "The Ostrich Syndrome",
        icon: "🙈",
        color: "#FFD93D",
        mindsetScores: {
          literacy: 40,
          anxiety: 95,
          discipline: 30,
          risk_tolerance: 10,
        },
        summary:
          "Financial anxiety has led you to avoid looking at bills, balances, and statements altogether. This avoidance creates a vicious cycle: the less you know, the more you fear, and the more you fear, the less you want to know. This paralysis is keeping you stuck in a dangerous place.",
        goodNews:
          "The fact that you're taking this assessment means you're ready to face this. Avoidance is a trauma response, not a character flaw. With the right system, you can reduce anxiety and take back control.",
        keyBlockers: [
          "Unopened bills and ignored statements",
          "No idea of actual net worth or debt total",
          "Paralysis preventing action on solvable problems",
          "Shame preventing asking for help",
        ],
        actionPlan: [
          {
            title: "The 'Financial Detox'",
            subtitle: "Face the numbers",
            description:
              "Set aside 2 hours this weekend. Open every bill, log into every account, write down every balance. Yes, it will be uncomfortable. But you're going to discover it's not as bad as the story in your head. Knowledge is the antidote to fear.",
          },
          {
            title: "The 'Accountability Partner'",
            subtitle: "Break the shame cycle",
            description:
              "Tell one trusted person about your financial situation. Ask them to check in weekly: 'Did you open your mail this week?' Shame thrives in silence. The moment you speak it out loud, it loses 50% of its power.",
          },
          {
            title: "The 'Micro-Win Strategy'",
            subtitle: "Build momentum",
            description:
              "Pick the smallest debt or bill you have. Pay it off completely this month, even if it's just ₹500. Then celebrate. Your brain needs to associate 'dealing with money' with 'winning,' not 'suffering.' Stack small wins.",
          },
        ],
      },
      debt_focused: {
        title: "The Burden Carrier",
        icon: "⚖️",
        color: "#9B59B6",
        mindsetScores: {
          literacy: 65,
          anxiety: 75,
          discipline: 80,
          risk_tolerance: 25,
        },
        summary:
          "Your debt feels like a moral failure, not just a mathematical problem. You're disciplined about payments, but the emotional weight of debt is affecting your self-worth and preventing you from seeing beyond 'just paying it off.' Debt is a tool that was misused - it doesn't define you.",
        goodNews:
          "Your discipline and focus on debt repayment show incredible strength. Many people ignore debt entirely. You're confronting it head-on. Now we need to shift from 'shame-driven payoff' to 'strategic elimination' while protecting your mental health.",
        keyBlockers: [
          "Viewing debt as personal failure vs. math problem",
          "Sacrificing all quality of life to pay minimums",
          "Not distinguishing between high-interest and low-interest debt",
          "Neglecting savings while paying off debt",
        ],
        actionPlan: [
          {
            title: "The 'Debt Triage' System",
            subtitle: "Strategic prioritization",
            description:
              "List all debts by interest rate. Attack highest-interest debt aggressively (credit cards, personal loans). For low-interest debt (student loans, mortgages), pay minimums and invest the difference. This is math, not morality.",
          },
          {
            title: "The 'Parallel Build' Method",
            subtitle: "Save while paying",
            description:
              "Even while in debt, save ₹2,000/month in an emergency fund. Why? Because one unexpected expense will force you back into debt. You need a buffer. Build to ₹20,000, then refocus on debt. This prevents backsliding.",
          },
          {
            title: "The 'Freedom Date' Vision",
            subtitle: "Shift from shame to strategy",
            description:
              "Calculate your exact debt-free date based on current payments. Pin it on your wall. This is your 'Financial Independence Day.' Every payment brings you closer. Debt is temporary; your worth is permanent.",
          },
        ],
      },
    };

    return archetypeMap[archetype] || archetypeMap.saver;
  };

  const reportData = getReportData();

  return (
    <SafeAreaView className="flex-1 bg-[#070707]">
      {/* Header */}
      <View className="p-6 pb-4">
        <View className="items-center mb-6">
          <View
            className="w-20 h-20 rounded-full items-center justify-center mb-3 border-4"
            style={{
              backgroundColor: `${reportData.color}20`,
              borderColor: reportData.color,
            }}
          >
            <Text className="text-4xl">{reportData.icon}</Text>
          </View>
          <Text
            className="text-xs font-jakarta-bold mb-1"
            style={{ color: reportData.color }}
          >
            YOUR FINANCIAL ARCHETYPE
          </Text>
          <Text className="text-white text-xl font-jakarta-bold text-center">
            {reportData.title}
          </Text>
        </View>

        {/* Tab Segmented Control */}
        <View className="flex-row bg-neutral-900/95 rounded-full p-1 border border-white/10">
          <TouchableOpacity
            onPress={() => setActiveTab("diagnosis")}
            className="flex-1 rounded-full py-3 items-center"
            style={{
              backgroundColor:
                activeTab === "diagnosis" ? reportData.color : "transparent",
            }}
          >
            <Text
              className="text-sm font-jakarta-bold"
              style={{
                color: activeTab === "diagnosis" ? "#070707" : "#999999",
              }}
            >
              Diagnosis
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("action")}
            className="flex-1 rounded-full py-3 items-center"
            style={{
              backgroundColor:
                activeTab === "action" ? reportData.color : "transparent",
            }}
          >
            <Text
              className="text-sm font-jakarta-bold"
              style={{
                color: activeTab === "action" ? "#070707" : "#999999",
              }}
            >
              Action Plan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("scores")}
            className="flex-1 rounded-full py-3 items-center"
            style={{
              backgroundColor:
                activeTab === "scores" ? reportData.color : "transparent",
            }}
          >
            <Text
              className="text-sm font-jakarta-bold"
              style={{
                color: activeTab === "scores" ? "#070707" : "#999999",
              }}
            >
              Scores
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
          {/* DIAGNOSIS TAB */}
          {activeTab === "diagnosis" && (
            <View>
              {/* Good News */}
              <View className="bg-[#4ECDC4]/10 rounded-2xl p-5 mb-4 border border-[#4ECDC4]/30">
                <Text className="text-[#4ECDC4] text-xs font-jakarta-bold mb-2">
                  ✅ THE GOOD NEWS
                </Text>
                <Text className="text-white text-base font-jakarta-bold mb-3">
                  You Have a Superpower
                </Text>
                <Text className="text-gray-300 text-sm font-jakarta-regular leading-6">
                  {reportData.goodNews}
                </Text>
              </View>

              {/* The Diagnosis */}
              <View className="bg-neutral-900/95 rounded-2xl p-5 mb-4 border border-white/10">
                <Text className="text-white text-base font-jakarta-bold mb-3">
                  🔍 The Diagnosis
                </Text>
                <Text className="text-gray-300 text-sm font-jakarta-regular leading-6">
                  {reportData.summary}
                </Text>
              </View>

              {/* Key Blockers */}
              <View
                className="rounded-2xl p-5 border"
                style={{
                  backgroundColor: `${reportData.color}10`,
                  borderColor: `${reportData.color}50`,
                }}
              >
                <Text
                  className="text-xs font-jakarta-bold mb-2"
                  style={{ color: reportData.color }}
                >
                  ⚠️ KEY BLOCKERS
                </Text>
                <Text className="text-white text-base font-jakarta-bold mb-3">
                  What&apos;s Holding You Back
                </Text>
                <View className="gap-2">
                  {reportData.keyBlockers.map(
                    (blocker: string, index: number) => (
                      <View key={index} className="flex-row items-start">
                        <Text
                          className="text-lg mr-2"
                          style={{ color: reportData.color }}
                        >
                          •
                        </Text>
                        <Text className="text-gray-300 text-sm font-jakarta-regular flex-1 leading-5">
                          {blocker}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>
          )}

          {/* ACTION PLAN TAB */}
          {activeTab === "action" && (
            <View>
              <Text className="text-white text-lg font-jakarta-bold mb-4">
                Your 3-Step Transformation Plan
              </Text>

              {reportData.actionPlan.map((step: any, index: number) => (
                <View
                  key={index}
                  className="bg-neutral-900/95 rounded-2xl p-5 mb-4 border border-white/10"
                >
                  <View className="flex-row items-start mb-3">
                    <View
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: reportData.color }}
                    >
                      <Text className="text-[#070707] text-base font-jakarta-bold">
                        {index + 1}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-base font-jakarta-bold">
                        {step.title}
                      </Text>
                      <Text
                        className="text-xs font-jakarta-medium mt-0.5"
                        style={{ color: reportData.color }}
                      >
                        {step.subtitle}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-gray-300 text-sm font-jakarta-regular leading-6">
                    {step.description}
                  </Text>
                </View>
              ))}

              {/* Closing Thought */}
              <View className="bg-[#D7FF00]/10 rounded-2xl p-5 border border-[#D7FF00]/30">
                <Text className="text-[#D7FF00] text-xs font-jakarta-bold mb-2">
                  💭 CLOSING THOUGHT
                </Text>
                <Text className="text-white text-sm font-jakarta-regular leading-6">
                  {archetype === "saver"
                    ? "You have spent your life building a fortress to keep poverty out. You have succeeded; you are safe now. It is time to lower the drawbridge slightly and let some enjoyment in. You have earned it."
                    : "Financial transformation isn't about becoming someone else. It's about taking your natural strengths and adding structure around your weaknesses. You've got this."}
                </Text>
              </View>
            </View>
          )}

          {/* SCORES TAB */}
          {activeTab === "scores" && (
            <View>
              <Text className="text-white text-lg font-jakarta-bold mb-4">
                Your Financial Mindset Scores
              </Text>

              {Object.entries(reportData.mindsetScores).map(
                ([key, value]: [string, any]) => (
                  <View key={key} className="mb-5">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-white text-base font-jakarta-medium capitalize">
                        {key.replace(/_/g, " ")}
                      </Text>
                      <Text
                        className="text-2xl font-jakarta-bold"
                        style={{
                          color:
                            value >= 70
                              ? "#4ECDC4"
                              : value >= 40
                                ? "#FFD93D"
                                : "#FF6B6B",
                        }}
                      >
                        {value}
                      </Text>
                    </View>
                    <View className="h-3 bg-neutral-800 rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${value}%`,
                          backgroundColor:
                            value >= 70
                              ? "#4ECDC4"
                              : value >= 40
                                ? "#FFD93D"
                                : "#FF6B6B",
                        }}
                      />
                    </View>
                    <Text className="text-gray-400 text-xs font-jakarta-regular mt-1">
                      {value >= 70
                        ? "Strong foundation"
                        : value >= 40
                          ? "Room for growth"
                          : "Needs attention"}
                    </Text>
                  </View>
                )
              )}

              {/* Score Interpretation */}
              <View className="bg-neutral-900/95 rounded-2xl p-5 border border-white/10">
                <Text className="text-white text-base font-jakarta-bold mb-3">
                  📊 What These Scores Mean
                </Text>
                <View className="gap-3">
                  <View>
                    <Text className="text-gray-400 text-xs font-jakarta-bold mb-1">
                      LITERACY
                    </Text>
                    <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                      Your understanding of financial concepts and tools
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-400 text-xs font-jakarta-bold mb-1">
                      ANXIETY
                    </Text>
                    <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                      How much financial stress affects your daily life
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-400 text-xs font-jakarta-bold mb-1">
                      DISCIPLINE
                    </Text>
                    <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                      Your ability to stick to plans and resist impulses
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-400 text-xs font-jakarta-bold mb-1">
                      RISK TOLERANCE
                    </Text>
                    <Text className="text-gray-300 text-sm font-jakarta-regular leading-5">
                      Your comfort level with financial uncertainty and
                      investing
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
              Explore Personas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
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
