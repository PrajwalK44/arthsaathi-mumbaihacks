import { ScrollView, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Timeline() {
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
                This Week
              </Text>
              <Text
                style={{
                  color: "#4ECDC4",
                  fontSize: 24,
                  fontFamily: "Jakarta-Bold",
                }}
              >
                +₹8,240
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
                Transactions
              </Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 24,
                  fontFamily: "Jakarta-Bold",
                }}
              >
                47
              </Text>
            </View>
          </View>
        </View>

        {/* Transaction Groups */}
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
      </ScrollView>
    </SafeAreaView>
  );
}
