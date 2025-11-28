import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function Timeline() {
  const [timelineEntries, setTimelineEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTimeline = async () => {
    try {
      const timeline = await AsyncStorage.getItem("arth_timeline");
      if (timeline) {
        setTimelineEntries(JSON.parse(timeline));
      }
    } catch (error) {
      console.error("Failed to load timeline:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reload timeline when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTimeline();
    }, [])
  );

  useEffect(() => {
    loadTimeline();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    const daysAgo = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysAgo < 7) return `${daysAgo} days ago`;

    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

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

  // Group entries by date
  const groupedEntries = timelineEntries.reduce((groups: any, entry) => {
    const dateKey = formatDate(entry.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
    return groups;
  }, {});

  const transactions = [
    {
      date: "Today",
      items: [
        {
          type: "income",
          title: "Swiggy Delivery Payment",
          time: "2:30 PM",
          amount: 450,
          category: "Delivery",
        },
        {
          type: "expense",
          title: "Lunch at Cafe",
          time: "1:15 PM",
          amount: 180,
          category: "Food",
        },
        {
          type: "income",
          title: "Zomato Order Completed",
          time: "11:45 AM",
          amount: 380,
          category: "Delivery",
        },
      ],
    },
    {
      date: "Yesterday",
      items: [
        {
          type: "expense",
          title: "Mobile Recharge",
          time: "8:20 PM",
          amount: 299,
          category: "Bills",
        },
        {
          type: "income",
          title: "Daily Earnings",
          time: "6:30 PM",
          amount: 1200,
          category: "Delivery",
        },
        {
          type: "expense",
          title: "Grocery Shopping",
          time: "3:10 PM",
          amount: 850,
          category: "Shopping",
        },
      ],
    },
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

      <ScrollView
        style={{ flex: 1 }}
        className="mt-5"
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View
          style={{
            backgroundColor: "rgba(30, 30, 30, 0.95)",
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 11,
                  fontFamily: "Jakarta-Regular",
                  marginBottom: 6,
                }}
              >
                Simulations
              </Text>
              <Text
                style={{
                  color: "#4ECDC4",
                  fontSize: 24,
                  fontFamily: "Jakarta-Bold",
                }}
              >
                {timelineEntries.filter((e) => e.type === "simulation").length}
              </Text>
            </View>
            <View
              style={{
                width: 1,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            />
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 11,
                  fontFamily: "Jakarta-Regular",
                  marginBottom: 6,
                }}
              >
                Assessments
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 24,
                  fontFamily: "Jakarta-Bold",
                }}
              >
                {timelineEntries.filter((e) => e.type === "assessment").length}
              </Text>
            </View>
          </View>
        </View>

        {/* Timeline Entries */}
        {isLoading ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text style={{ color: "#9CA3AF", fontFamily: "Jakarta-Regular" }}>
              Loading timeline...
            </Text>
          </View>
        ) : timelineEntries.length === 0 ? (
          <View style={{ padding: 40, alignItems: "center" }}>
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 16,
                fontFamily: "Jakarta-Bold",
                marginBottom: 8,
              }}
            >
              No Activity Yet
            </Text>
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 13,
                fontFamily: "Jakarta-Regular",
                textAlign: "center",
              }}
            >
              Complete a persona simulation or assessment to see your activity
              here
            </Text>
          </View>
        ) : (
          Object.keys(groupedEntries).map((dateKey, groupIndex) => (
            <View key={groupIndex} style={{ marginBottom: 24 }}>
              <Text
                style={{
                  color: "#9CA3AF",
                  fontSize: 13,
                  fontFamily: "Jakarta-Bold",
                  marginBottom: 12,
                  textTransform: "uppercase",
                }}
              >
                {dateKey}
              </Text>

              {groupedEntries[dateKey].map((entry: any, itemIndex: number) => (
                <View
                  key={itemIndex}
                  style={{
                    backgroundColor: "#1E1E1E",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor:
                      entry.type === "simulation"
                        ? "rgba(215, 255, 0, 0.2)"
                        : "rgba(78, 205, 196, 0.2)",
                  }}
                >
                  {entry.type === "simulation" ? (
                    <>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: "rgba(215, 255, 0, 0.2)",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                          }}
                        >
                          <Text style={{ fontSize: 20 }}>
                            {getPersonaEmoji(entry.personaType)}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              color: "#FFFFFF",
                              fontSize: 14,
                              fontFamily: "Jakarta-Bold",
                              marginBottom: 2,
                            }}
                          >
                            {entry.personaName} Simulation
                          </Text>
                          <Text
                            style={{
                              color: "#9CA3AF",
                              fontSize: 11,
                              fontFamily: "Jakarta-Regular",
                            }}
                          >
                            {formatTime(entry.timestamp)} •{" "}
                            {entry.eventsCompleted} decisions
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{ flexDirection: "row", gap: 8, marginTop: 8 }}
                      >
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(215, 255, 0, 0.1)",
                            borderRadius: 8,
                            padding: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: "#9CA3AF",
                              fontSize: 10,
                              fontFamily: "Jakarta-Regular",
                            }}
                          >
                            Impact
                          </Text>
                          <Text
                            style={{
                              color:
                                entry.totalImpact >= 0 ? "#4ECDC4" : "#FF6B6B",
                              fontSize: 13,
                              fontFamily: "Jakarta-Bold",
                            }}
                          >
                            {entry.totalImpact >= 0 ? "+" : ""}₹
                            {entry.totalImpact.toLocaleString("en-IN")}
                          </Text>
                        </View>
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: "rgba(215, 255, 0, 0.1)",
                            borderRadius: 8,
                            padding: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: "#9CA3AF",
                              fontSize: 10,
                              fontFamily: "Jakarta-Regular",
                            }}
                          >
                            Health Score
                          </Text>
                          <Text
                            style={{
                              color: "#D7FF00",
                              fontSize: 13,
                              fontFamily: "Jakarta-Bold",
                            }}
                          >
                            {Math.round(entry.healthScore)}/100
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    <>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: "rgba(78, 205, 196, 0.2)",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                          }}
                        >
                          <Text style={{ fontSize: 20 }}>{entry.emoji}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              color: "#FFFFFF",
                              fontSize: 14,
                              fontFamily: "Jakarta-Bold",
                              marginBottom: 2,
                            }}
                          >
                            {entry.personaType}
                          </Text>
                          <Text
                            style={{
                              color: "#9CA3AF",
                              fontSize: 11,
                              fontFamily: "Jakarta-Regular",
                            }}
                          >
                            {formatTime(entry.timestamp)} • Dynamic Assessment
                          </Text>
                        </View>
                        <View
                          style={{
                            backgroundColor: "rgba(78, 205, 196, 0.2)",
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 12,
                          }}
                        >
                          <Text
                            style={{
                              color: "#4ECDC4",
                              fontSize: 10,
                              fontFamily: "Jakarta-Bold",
                            }}
                          >
                            COMPLETE
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              ))}
            </View>
          ))
        )}

        {/* Old Mock Transactions - Hidden when there are real entries */}
        {timelineEntries.length === 0 && (
          <>
            {transactions.map((group, groupIndex) => (
              <View key={groupIndex} style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 13,
                    fontFamily: "Jakarta-Bold",
                    marginBottom: 12,
                    textTransform: "uppercase",
                  }}
                >
                  {group.date}
                </Text>

                {group.items.map((item, itemIndex) => (
                  <View
                    key={itemIndex}
                    style={{
                      backgroundColor: "#1E1E1E",
                      borderRadius: 12,
                      padding: 16,
                      marginBottom: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor:
                        item.type === "income"
                          ? "rgba(78, 205, 196, 0.2)"
                          : "rgba(255, 107, 107, 0.2)",
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor:
                          item.type === "income"
                            ? "rgba(78, 205, 196, 0.2)"
                            : "rgba(255, 107, 107, 0.2)",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>
                        {item.type === "income" ? "↓" : "↑"}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 14,
                          fontFamily: "Jakarta-Bold",
                          marginBottom: 2,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          color: "#9CA3AF",
                          fontSize: 11,
                          fontFamily: "Jakarta-Regular",
                        }}
                      >
                        {item.time} • {item.category}
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: item.type === "income" ? "#4ECDC4" : "#FF6B6B",
                        fontSize: 16,
                        fontFamily: "Jakarta-Bold",
                      }}
                    >
                      {item.type === "income" ? "+" : "-"}₹{item.amount}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
