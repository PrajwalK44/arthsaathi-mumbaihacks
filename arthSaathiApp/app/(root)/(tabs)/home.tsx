import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Import persona data
const personasData = require("@/data/personas.json");

export default function Home() {
  const personas = personasData.personas;

  const getPersonaEmoji = (type: string) => {
    const emojiMap: { [key: string]: string } = {
      logistics_delivery: "🛵",
      creative_freelancer: "💻",
      asset_heavy_gig: "🚗",
      micro_entrepreneur: "🧁",
      platform_technician: "🔧",
    };
    return emojiMap[type] || "👤";
  };

  const handlePersonaSelect = (personaId: string) => {
    // Navigate to persona simulation screen
    router.push({
      pathname: "/(root)/persona-simulation",
      params: { id: personaId },
    });
  };

  const handleGenerateCustom = () => {
    // Navigate to dynamic persona generation
    router.push("/(root)/dynamic-persona");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#070707]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="p-5 pb-3">
          <Text className="text-white text-3xl font-jakarta-bold">
            ArthSaathi
          </Text>
          <Text className="text-gray-400 text-sm font-jakarta-regular mt-1">
            Choose Your Financial Journey
          </Text>
        </View>

        {/* Generate Custom Persona Banner */}
        <View className="px-5 mb-6">
          <TouchableOpacity
            onPress={handleGenerateCustom}
            className="bg-[#D7FF00]/10 rounded-3xl p-6 border-2 border-[#D7FF00]/30"
          >
            <View className="flex-row items-center mb-2">
              <Text className="text-2xl mr-2">🤖</Text>
              <View className="bg-[#D7FF00] px-3 py-1 rounded-lg">
                <Text className="text-[#070707] text-xs font-jakarta-bold">
                  AI-POWERED
                </Text>
              </View>
            </View>
            <Text className="text-white text-xl font-jakarta-bold mb-2">
              Build Your Financial DNA
            </Text>
            <Text className="text-gray-300 text-sm font-jakarta-regular leading-5 mb-4">
              Take our 8-question assessment and get AI-generated insights into
              your money personality, spending patterns, and custom
              recommendations.
            </Text>
            <View className="flex-row items-center">
              <Text className="text-[#D7FF00] text-sm font-jakarta-bold">
                Start Assessment
              </Text>
              <Text className="text-[#D7FF00] text-lg ml-2">→</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Or Divider */}
        <View className="px-5 mb-6">
          <View className="flex-row items-center">
            <View className="flex-1 h-px bg-white/10" />
            <Text className="text-gray-400 text-xs font-jakarta-medium mx-4">
              OR CHOOSE A PRESET PERSONA
            </Text>
            <View className="flex-1 h-px bg-white/10" />
          </View>
        </View>

        {/* Persona Cards */}
        <View className="px-5">
          <Text className="text-white text-lg font-jakarta-bold mb-4">
            Pre-Built Personas
          </Text>

          {personas.map((persona: any) => (
            <TouchableOpacity
              key={persona.id}
              onPress={() => handlePersonaSelect(persona.id)}
              className="bg-neutral-900/95 rounded-2xl p-5 mb-4 border border-white/10"
            >
              {/* Header */}
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-neutral-800 items-center justify-center mr-3">
                    <Text className="text-3xl">
                      {getPersonaEmoji(persona.type)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-base font-jakarta-bold">
                      {persona.display_profile.name}
                    </Text>
                    <Text className="text-gray-400 text-xs font-jakarta-regular">
                      {persona.display_profile.role}
                    </Text>
                  </View>
                </View>
                <View className="bg-neutral-800 px-2 py-1 rounded-lg">
                  <Text className="text-gray-400 text-xs font-jakarta-medium">
                    {persona.display_profile.age} yrs
                  </Text>
                </View>
              </View>

              {/* Quote */}
              <View className="bg-neutral-800/50 rounded-xl p-3 mb-3">
                <Text className="text-gray-300 text-xs font-jakarta-regular italic">
                  &ldquo;{persona.display_profile.quote}&rdquo;
                </Text>
              </View>

              {/* Financial Stats */}
              <View className="flex-row gap-2 mb-3">
                <View className="flex-1 bg-neutral-800 rounded-lg p-2">
                  <Text className="text-gray-400 text-[10px] font-jakarta-regular">
                    Monthly Income
                  </Text>
                  <Text className="text-[#4ECDC4] text-sm font-jakarta-bold">
                    ₹
                    {(
                      persona.financial_baseline.avg_monthly_income / 1000
                    ).toFixed(0)}
                    k
                  </Text>
                </View>
                <View className="flex-1 bg-neutral-800 rounded-lg p-2">
                  <Text className="text-gray-400 text-[10px] font-jakarta-regular">
                    Savings
                  </Text>
                  <Text className="text-[#D7FF00] text-sm font-jakarta-bold">
                    ₹
                    {(
                      persona.financial_baseline.savings_balance / 1000
                    ).toFixed(0)}
                    k
                  </Text>
                </View>
                <View className="flex-1 bg-neutral-800 rounded-lg p-2">
                  <Text className="text-gray-400 text-[10px] font-jakarta-regular">
                    Debt
                  </Text>
                  <Text className="text-[#FF6B6B] text-sm font-jakarta-bold">
                    ₹{(persona.financial_baseline.debt_total / 1000).toFixed(0)}
                    k
                  </Text>
                </View>
              </View>

              {/* Location & Risk */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-xs mr-1">📍</Text>
                  <Text className="text-gray-400 text-xs font-jakarta-regular">
                    {persona.display_profile.location}
                  </Text>
                </View>
                <View className="bg-neutral-800 px-2 py-1 rounded">
                  <Text className="text-gray-400 text-[10px] font-jakarta-regular">
                    {persona.psychometric_profile.risk_appetite} Risk
                  </Text>
                </View>
              </View>

              {/* CTA */}
              <View className="mt-3 pt-3 border-t border-white/10">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white text-xs font-jakarta-medium">
                    Start Simulation
                  </Text>
                  <Text className="text-[#D7FF00] text-lg">›</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
