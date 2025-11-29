import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

interface PodcastEpisode {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  color: string;
  personaName: string;
  totalImpact: number;
  healthScore: number;
  dominantBehavior: string;
  timestamp: number;
  insights: string[];
}

export default function Podcast() {
  const [generatedPodcasts, setGeneratedPodcasts] = useState<PodcastEpisode[]>(
    []
  );
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastEpisode | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const topics = [
    { emoji: "💰", label: "Savings" },
    { emoji: "📈", label: "Investment" },
    { emoji: "💳", label: "Budgeting" },
    { emoji: "🎯", label: "Goals" },
    { emoji: "📊", label: "Planning" },
  ];

  // Load timeline and generate podcasts
  const loadTimelineAndGeneratePodcasts = React.useCallback(async () => {
    try {
      // Get current user
      const userStr = await AsyncStorage.getItem("arth_user");
      const user = userStr ? JSON.parse(userStr) : null;
      const userEmail = user?.email || "";

      const timeline = await AsyncStorage.getItem("arth_timeline");
      if (timeline) {
        const allEntries = JSON.parse(timeline);
        // Filter entries to only show current user's entries
        const entries = allEntries.filter(
          (entry: any) => !entry.userEmail || entry.userEmail === userEmail
        );

        // Generate podcasts from simulation entries
        const simulations = entries.filter((e: any) => e.type === "simulation");
        const podcasts: PodcastEpisode[] = simulations.map((sim: any) => {
          return generatePodcastFromSimulation(sim);
        });

        setGeneratedPodcasts(podcasts);
      }
    } catch (error) {
      console.error("Failed to load timeline:", error);
    }
  }, []);

  // Reload when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTimelineAndGeneratePodcasts();
    }, [loadTimelineAndGeneratePodcasts])
  );

  useEffect(() => {
    loadTimelineAndGeneratePodcasts();
  }, [loadTimelineAndGeneratePodcasts]);

  // Generate podcast content from simulation data
  const generatePodcastFromSimulation = (simulation: any): PodcastEpisode => {
    const {
      personaName,
      totalImpact,
      healthScore,
      dominantBehavior,
      timestamp,
    } = simulation;

    const isPositive = totalImpact >= 0;
    const impact = Math.abs(totalImpact);

    // Generate insights based on simulation results
    const insights = [];

    if (isPositive) {
      insights.push(
        `You made strategic financial decisions that resulted in a positive impact of ₹${impact.toLocaleString("en-IN")}.`
      );
    } else {
      insights.push(
        `Your decisions led to a financial impact of -₹${impact.toLocaleString("en-IN")}. Let's explore how to improve.`
      );
    }

    if (healthScore >= 70) {
      insights.push(
        "Your financial health score is strong, indicating sustainable decision-making patterns."
      );
    } else if (healthScore >= 50) {
      insights.push(
        "Your financial health is moderate. There's room for improvement in your financial strategies."
      );
    } else {
      insights.push(
        "Your financial health needs attention. This podcast will guide you toward better financial stability."
      );
    }

    insights.push(
      `Your dominant behavioral pattern was "${dominantBehavior}". Understanding this helps in making better future decisions.`
    );

    const categoryMap: { [key: string]: { category: string; color: string } } =
      {
        "Cautious Saver": { category: "Risk Management", color: "#4ECDC4" },
        "Risk Taker": { category: "Investment Strategy", color: "#FF6B6B" },
        "Balanced Investor": {
          category: "Financial Planning",
          color: "#A78BFA",
        },
        "Impulse Spender": { category: "Budgeting", color: "#FFD93D" },
        "Strategic Planner": { category: "Wealth Building", color: "#D7FF00" },
      };

    const categoryInfo =
      categoryMap[dominantBehavior] || categoryMap["Balanced Investor"];

    const duration = `${Math.floor(12 + Math.random() * 8)} min`;

    return {
      id: timestamp.toString(),
      title: `Financial Journey Insights: ${personaName}`,
      description: `Deep dive into your simulation as ${personaName}. Learn from your decisions and discover actionable strategies to improve your financial health.`,
      duration,
      category: categoryInfo.category,
      color: categoryInfo.color,
      personaName,
      totalImpact,
      healthScore,
      dominantBehavior,
      timestamp,
      insights,
    };
  };

  // Podcast player controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate playback
      Animated.timing(progressAnim, {
        toValue: 100,
        duration: 30000, // 30 seconds for demo
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.stopAnimation();
    }
  };

  const handleClosePodcast = () => {
    setSelectedPodcast(null);
    setIsPlaying(false);
    progressAnim.setValue(0);
  };

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
                  await AsyncStorage.removeItem("arth_timeline").catch(
                    () => {}
                  );
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

        {/* Your Personalized Podcasts */}
        {generatedPodcasts.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontFamily: "Jakarta-Bold",
                marginBottom: 12,
              }}
            >
              Your Personalized Podcasts
            </Text>
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 12,
                fontFamily: "Jakarta-Regular",
                marginBottom: 16,
              }}
            >
              Based on your simulation experiences
            </Text>

            {generatedPodcasts.map((podcast, index) => (
              <TouchableOpacity
                key={podcast.id}
                onPress={() => setSelectedPodcast(podcast)}
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
                  borderLeftColor: podcast.color,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    backgroundColor: `${podcast.color}20`,
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
                    {podcast.title}
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
                        color: podcast.color,
                        fontSize: 10,
                        fontFamily: "Jakarta-Medium",
                      }}
                    >
                      {podcast.category}
                    </Text>
                    <Text style={{ color: "#9CA3AF", fontSize: 10 }}>•</Text>
                    <Text
                      style={{
                        color: "#9CA3AF",
                        fontSize: 10,
                        fontFamily: "Jakarta-Regular",
                      }}
                    >
                      {podcast.duration}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: podcast.color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 16 }}>▶</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

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

          {[
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
          ].map((episode, index) => (
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

      {/* Podcast Player Modal */}
      {selectedPodcast && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.95)",
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* Header with Close Button */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 8,
              }}
            >
              <TouchableOpacity onPress={handleClosePodcast}>
                <Text style={{ color: "#FFFFFF", fontSize: 28 }}>↓</Text>
              </TouchableOpacity>
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 12,
                  fontFamily: "Jakarta-Medium",
                }}
              >
                NOW PLAYING
              </Text>
              <View style={{ width: 28 }} />
            </View>

            {/* Player Controls at Top */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
              }}
            >
              {/* Progress Bar */}
              <View style={{ marginBottom: 16 }}>
                <View
                  style={{
                    height: 4,
                    backgroundColor: "#333333",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <Animated.View
                    style={{
                      height: "100%",
                      backgroundColor: selectedPodcast.color,
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      color: "#9CA3AF",
                      fontSize: 11,
                      fontFamily: "Jakarta-Regular",
                    }}
                  >
                    0:00
                  </Text>
                  <Text
                    style={{
                      color: "#9CA3AF",
                      fontSize: 11,
                      fontFamily: "Jakarta-Regular",
                    }}
                  >
                    {selectedPodcast.duration}
                  </Text>
                </View>
              </View>

              {/* Controls */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 32,
                }}
              >
                <TouchableOpacity>
                  <Text style={{ color: "#FFFFFF", fontSize: 24 }}>⏮</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={{ color: "#FFFFFF", fontSize: 24 }}>↺</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePlayPause}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: selectedPodcast.color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 28 }}>{isPlaying ? "⏸" : "▶"}</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={{ color: "#FFFFFF", fontSize: 24 }}>↻</Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Text style={{ color: "#FFFFFF", fontSize: 24 }}>⏭</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingBottom: 100,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Album Art */}
              <View
                style={{
                  width: "100%",
                  aspectRatio: 1,
                  borderRadius: 24,
                  backgroundColor: `${selectedPodcast.color}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 32,
                  borderWidth: 2,
                  borderColor: `${selectedPodcast.color}40`,
                }}
              >
                <Text style={{ fontSize: 120 }}>🎙️</Text>
              </View>

              {/* Track Info */}
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 24,
                    fontFamily: "Jakarta-Bold",
                    marginBottom: 8,
                  }}
                >
                  {selectedPodcast.title}
                </Text>
                <Text
                  style={{
                    color: selectedPodcast.color,
                    fontSize: 14,
                    fontFamily: "Jakarta-Medium",
                  }}
                >
                  {selectedPodcast.category} • {selectedPodcast.duration}
                </Text>
              </View>

              {/* Insights */}
              <View style={{ marginBottom: 32 }}>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontFamily: "Jakarta-Bold",
                    marginBottom: 16,
                  }}
                >
                  What You&apos;ll Learn
                </Text>
                {selectedPodcast.insights.map((insight, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: "#1E1E1E",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 12,
                      borderLeftWidth: 3,
                      borderLeftColor: selectedPodcast.color,
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 13,
                        fontFamily: "Jakarta-Regular",
                        lineHeight: 20,
                      }}
                    >
                      {insight}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Financial Summary */}
              <View
                style={{
                  backgroundColor: "#1E1E1E",
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 32,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontFamily: "Jakarta-Bold",
                    marginBottom: 16,
                  }}
                >
                  Your Simulation Results
                </Text>
                <View style={{ gap: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "#9CA3AF",
                        fontSize: 13,
                        fontFamily: "Jakarta-Regular",
                      }}
                    >
                      Total Impact
                    </Text>
                    <Text
                      style={{
                        color:
                          selectedPodcast.totalImpact >= 0
                            ? "#4ECDC4"
                            : "#FF6B6B",
                        fontSize: 14,
                        fontFamily: "Jakarta-Bold",
                      }}
                    >
                      {selectedPodcast.totalImpact >= 0 ? "+" : ""}₹
                      {Math.abs(selectedPodcast.totalImpact).toLocaleString(
                        "en-IN"
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "#9CA3AF",
                        fontSize: 13,
                        fontFamily: "Jakarta-Regular",
                      }}
                    >
                      Health Score
                    </Text>
                    <Text
                      style={{
                        color: "#D7FF00",
                        fontSize: 14,
                        fontFamily: "Jakarta-Bold",
                      }}
                    >
                      {selectedPodcast.healthScore.toFixed(0)}/100
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "#9CA3AF",
                        fontSize: 13,
                        fontFamily: "Jakarta-Regular",
                      }}
                    >
                      Behavior Pattern
                    </Text>
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 14,
                        fontFamily: "Jakarta-Medium",
                      }}
                    >
                      {selectedPodcast.dominantBehavior}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      )}
    </SafeAreaView>
  );
}
