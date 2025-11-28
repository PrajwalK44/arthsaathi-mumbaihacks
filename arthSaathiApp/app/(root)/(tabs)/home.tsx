import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#070707" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ padding: 20, paddingBottom: 12 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 28,
              fontFamily: "Jakarta-Bold",
            }}
          >
            ArthSaathi
          </Text>
          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 14,
              fontFamily: "Jakarta-Regular",
              marginTop: 4,
            }}
          >
            Your Financial Guardian
          </Text>
        </View>

        {/* Balance Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: "rgba(30, 30, 30, 0.95)",
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(215, 255, 0, 0.3)",
              shadowColor: "#D7FF00",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 12,
                fontFamily: "Jakarta-Medium",
                marginBottom: 8,
              }}
            >
              CURRENT BALANCE
            </Text>
            <Text
              style={{
                color: "#D7FF00",
                fontSize: 42,
                fontFamily: "Jakarta-Bold",
                marginBottom: 16,
              }}
            >
              ₹24,580
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 12,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <View>
                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 11,
                    fontFamily: "Jakarta-Regular",
                  }}
                >
                  This Month Income
                </Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 18,
                    fontFamily: "Jakarta-Bold",
                    marginTop: 4,
                  }}
                >
                  ₹32,400
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 11,
                    fontFamily: "Jakarta-Regular",
                  }}
                >
                  Expenses
                </Text>
                <Text
                  style={{
                    color: "#FF6B6B",
                    fontSize: 18,
                    fontFamily: "Jakarta-Bold",
                    marginTop: 4,
                  }}
                >
                  ₹7,820
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: "Jakarta-Bold",
              marginBottom: 12,
            }}
          >
            Quick Actions
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#1E1E1E",
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>💰</Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontFamily: "Jakarta-Medium",
                }}
              >
                Add Income
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#1E1E1E",
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>💸</Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontFamily: "Jakarta-Medium",
                }}
              >
                Add Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#1E1E1E",
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <Text style={{ fontSize: 24, marginBottom: 8 }}>🎯</Text>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontFamily: "Jakarta-Medium",
                }}
              >
                Set Goal
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Insights */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: "Jakarta-Bold",
              marginBottom: 12,
            }}
          >
            AI Insights
          </Text>
          <View
            style={{
              backgroundColor: "rgba(215, 255, 0, 0.1)",
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
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
              <Text style={{ fontSize: 20, marginRight: 8 }}>🤖</Text>
              <Text
                style={{
                  color: "#D7FF00",
                  fontSize: 14,
                  fontFamily: "Jakarta-Bold",
                }}
              >
                Digital Twin Analysis
              </Text>
            </View>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 13,
                fontFamily: "Jakarta-Regular",
                lineHeight: 20,
              }}
            >
              Your spending pattern shows you can save ₹3,200 more this month by
              reducing food delivery expenses by 40%.
            </Text>
          </View>
        </View>

        {/* Expense Breakdown */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontFamily: "Jakarta-Bold",
              marginBottom: 12,
            }}
          >
            Top Expenses
          </Text>
          {[
            {
              category: "Food & Dining",
              amount: 3200,
              color: "#FF6B6B",
              percent: 41,
            },
            {
              category: "Transportation",
              amount: 2400,
              color: "#4ECDC4",
              percent: 31,
            },
            {
              category: "Bills & Utilities",
              amount: 1820,
              color: "#FFD93D",
              percent: 23,
            },
            {
              category: "Entertainment",
              amount: 400,
              color: "#A78BFA",
              percent: 5,
            },
          ].map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#1E1E1E",
                borderRadius: 12,
                padding: 16,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontFamily: "Jakarta-Medium",
                  }}
                >
                  {item.category}
                </Text>
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontSize: 14,
                    fontFamily: "Jakarta-Bold",
                  }}
                >
                  ₹{item.amount}
                </Text>
              </View>
              <View
                style={{
                  height: 6,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${item.percent}%`,
                    backgroundColor: item.color,
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
