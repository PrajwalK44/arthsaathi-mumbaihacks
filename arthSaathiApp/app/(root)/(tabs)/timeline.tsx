import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
      <View style={{ padding: 20, paddingBottom: 12 }}>
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 28,
            fontFamily: "Jakarta-Bold",
          }}
        >
          Timeline
        </Text>
        <Text
          style={{
            color: "#9CA3AF",
            fontSize: 14,
            fontFamily: "Jakarta-Regular",
            marginTop: 4,
          }}
        >
          Your financial journey
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
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
