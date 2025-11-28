import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Podcast() {
  const episodes = [
    {
      title: "Building Your Emergency Fund",
      duration: "15 min",
      category: "Savings",
      color: "#4ECDC4",
      plays: "2.3k",
    },
    {
      title: "Tax Saving Tips for Gig Workers",
      duration: "12 min",
      category: "Tax Planning",
      color: "#FFD93D",
      plays: "1.8k",
    },
    {
      title: "Investing 101: Start Small, Win Big",
      duration: "18 min",
      category: "Investment",
      color: "#A78BFA",
      plays: "3.1k",
    },
    {
      title: "Managing Irregular Income",
      duration: "14 min",
      category: "Budgeting",
      color: "#FF6B6B",
      plays: "2.7k",
    },
  ];

  const topics = [
    { emoji: "💰", label: "Savings" },
    { emoji: "📈", label: "Investment" },
    { emoji: "💳", label: "Budgeting" },
    { emoji: "🎯", label: "Goals" },
    { emoji: "📊", label: "Planning" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#070707" }}>
      {/* Header Bar */}
      <View className="px-5 py-4 flex-row items-center justify-between border-b border-white/10 bg-neutral-900/50">
        {/* AS Logo */}
        <View className="flex-row items-center gap-3">
          <View
            className="w-12 h-12 rounded-full border-2 border-[#D7FF00] bg-[#070707] items-center justify-center"
            style={{
              shadowColor: "#D7FF00",
              shadowOpacity: 0.4,
              shadowRadius: 8,
            }}
          >
            <Text className="text-[#D7FF00] text-xl font-jakarta-bold">AS</Text>
          </View>
          <View>
            <Text className="text-white text-lg font-jakarta-bold">
              ArthSaathi
            </Text>
            <Text className="text-gray-400 text-xs font-jakarta-regular">
              Financial Journey
            </Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Sign Out", "Are you sure you want to sign out?", [
              { text: "Cancel", style: "cancel" },
              {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                  await AsyncStorage.removeItem("arth_user").catch(() => {});
                  router.replace("/(auth)/welcome");
                },
              },
            ]);
          }}
          className="bg-neutral-800 px-4 py-2 rounded-full border border-white/10"
        >
          <Text className="text-white text-xs font-jakarta-medium">
            ↗ Logout
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ padding: 15, paddingBottom: 12 }}>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontFamily: "Jakarta-Bold",
          }}
        >
          Learn & Grow
        </Text>
        <Text
          style={{
            color: "#9CA3AF",
            fontSize: 14,
            fontFamily: "Jakarta-Regular",
            marginTop: 4,
          }}
        >
          Financial literacy podcasts
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Banner */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: "rgba(215, 255, 0, 0.1)",
              borderRadius: 20,
              padding: 24,
              borderWidth: 2,
              borderColor: "rgba(215, 255, 0, 0.3)",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 24, marginRight: 8 }}>🎙️</Text>
              <View
                style={{
                  backgroundColor: "#D7FF00",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                }}
              >
                <Text
                  style={{
                    color: "#070707",
                    fontSize: 10,
                    fontFamily: "Jakarta-Bold",
                  }}
                >
                  NEW
                </Text>
              </View>
            </View>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 20,
                fontFamily: "Jakarta-Bold",
                marginBottom: 8,
              }}
            >
              Financial Freedom for Gig Workers
            </Text>
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 13,
                fontFamily: "Jakarta-Regular",
                marginBottom: 16,
              }}
            >
              Learn how to take control of your finances with proven strategies
              from experts.
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#D7FF00",
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#070707",
                  fontSize: 14,
                  fontFamily: "Jakarta-Bold",
                }}
              >
                Play Now • 22 min
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Topics */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: "Jakarta-Bold",
              marginBottom: 12,
            }}
          >
            Browse Topics
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {topics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  backgroundColor: "#1E1E1E",
                  borderRadius: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 18 }}>{topic.emoji}</Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontFamily: "Jakarta-Medium",
                  }}
                >
                  {topic.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Episodes */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: "Jakarta-Bold",
              marginBottom: 12,
            }}
          >
            Popular Episodes
          </Text>

          {episodes.map((episode, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "#1E1E1E",
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderLeftWidth: 4,
                borderColor: "rgba(255, 255, 255, 0.1)",
                borderLeftColor: episode.color,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  backgroundColor: `${episode.color}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 24 }}>🎧</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontFamily: "Jakarta-Bold",
                    marginBottom: 4,
                  }}
                >
                  {episode.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text
                    style={{
                      color: episode.color,
                      fontSize: 10,
                      fontFamily: "Jakarta-Medium",
                    }}
                  >
                    {episode.category}
                  </Text>
                  <Text style={{ color: "#9CA3AF", fontSize: 10 }}>•</Text>
                  <Text
                    style={{
                      color: "#9CA3AF",
                      fontSize: 10,
                      fontFamily: "Jakarta-Regular",
                    }}
                  >
                    {episode.duration}
                  </Text>
                  <Text style={{ color: "#9CA3AF", fontSize: 10 }}>•</Text>
                  <Text
                    style={{
                      color: "#9CA3AF",
                      fontSize: 10,
                      fontFamily: "Jakarta-Regular",
                    }}
                  >
                    {episode.plays} plays
                  </Text>
                </View>
              </View>

              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: episode.color,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 16 }}>▶</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
