import { router } from "expo-router";
import { useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Slider from "@react-native-community/slider";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface SurveyData {
  role: string;
  avg_monthly_income: number;
  income_volatility: string;
  savings_balance: number;
}

const Survey = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    role: "",
    avg_monthly_income: 22000,
    income_volatility: "",
    savings_balance: 0,
  });

  const cardAnimation = new Animated.Value(0);

  const roles = [
    {
      id: "delivery",
      label: "Delivery / Logistics",
      icon: "📦",
      subtitle: "Swiggy, Zomato, Porter",
    },
    {
      id: "rideshare",
      label: "Rideshare",
      icon: "🚗",
      subtitle: "Uber, Ola, Rapido",
    },
    {
      id: "freelance",
      label: "Freelance / Gig",
      icon: "💻",
      subtitle: "Design, Dev, Admin",
    },
    {
      id: "trade",
      label: "Skilled Trade",
      icon: "🛠️",
      subtitle: "Urban Company, Electrician",
    },
  ];

  const volatilities = [
    {
      id: "low",
      label: "Monthly",
      icon: "📅",
      subtitle: "Stable - Low Volatility",
    },
    {
      id: "medium",
      label: "Weekly",
      icon: "🗓️",
      subtitle: "Medium Volatility",
    },
    {
      id: "high",
      label: "Daily / Per Task",
      icon: "⚡",
      subtitle: "High Volatility",
    },
  ];

  const safetyNets = [
    {
      id: "low",
      label: "< 1 Week",
      icon: "🔴",
      value: 2000,
      subtitle: "~₹2k savings",
    },
    {
      id: "medium",
      label: "1 Month",
      icon: "🟠",
      value: 15000,
      subtitle: "~₹15k savings",
    },
    {
      id: "high",
      label: "3+ Months",
      icon: "🟢",
      value: 50000,
      subtitle: "~₹50k savings",
    },
  ];

  const handleNext = () => {
    if (currentCard < 3) {
      Animated.timing(cardAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentCard(currentCard + 1);
        cardAnimation.setValue(0);
      });
    } else {
      // Survey complete - navigate to home
      console.log("Survey Data:", surveyData);
      router.replace("/(root)/(tabs)/home");
    }
  };

  const canProceed = () => {
    switch (currentCard) {
      case 0:
        return surveyData.role !== "";
      case 1:
        return true; // Income slider always has a value
      case 2:
        return surveyData.income_volatility !== "";
      case 3:
        return surveyData.savings_balance !== 0;
      default:
        return false;
    }
  };

  const renderCard0 = () => (
    <View
      style={{
        backgroundColor: "rgba(30, 30, 30, 0.95)",
        borderRadius: 24,
        padding: 24,
        width: width - 48,
        borderWidth: 2,
        borderColor:
          surveyData.role !== "" ? "#D7FF00" : "rgba(255, 255, 255, 0.1)",
        shadowColor: "#D7FF00",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: surveyData.role !== "" ? 0.3 : 0,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <Text
        style={{
          color: "#D7FF00",
          fontSize: 14,
          fontFamily: "Jakarta-Medium",
          marginBottom: 8,
        }}
      >
        STEP 1 OF 4
      </Text>
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 24,
          fontFamily: "Jakarta-Bold",
          marginBottom: 24,
        }}
      >
        How do you earn your money?
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            onPress={() => setSurveyData({ ...surveyData, role: role.id })}
            style={{
              width: (width - 120) / 2,
              aspectRatio: 1,
              backgroundColor:
                surveyData.role === role.id ? "#D7FF00" : "#1E1E1E",
              borderRadius: 16,
              borderWidth: 2,
              borderColor:
                surveyData.role === role.id
                  ? "#D7FF00"
                  : "rgba(255, 255, 255, 0.1)",
              alignItems: "center",
              justifyContent: "center",
              padding: 12,
            }}
          >
            <Text style={{ fontSize: 36, marginBottom: 8 }}>{role.icon}</Text>
            <Text
              style={{
                color: surveyData.role === role.id ? "#070707" : "#FFFFFF",
                fontSize: 14,
                fontFamily: "Jakarta-Bold",
                textAlign: "center",
              }}
            >
              {role.label}
            </Text>
            <Text
              style={{
                color: surveyData.role === role.id ? "#333333" : "#9CA3AF",
                fontSize: 10,
                fontFamily: "Jakarta-Regular",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              {role.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCard1 = () => (
    <View
      style={{
        backgroundColor: "rgba(30, 30, 30, 0.95)",
        borderRadius: 24,
        padding: 24,
        width: width - 48,
        borderWidth: 2,
        borderColor: "#D7FF00",
        shadowColor: "#D7FF00",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <Text
        style={{
          color: "#D7FF00",
          fontSize: 14,
          fontFamily: "Jakarta-Medium",
          marginBottom: 8,
        }}
      >
        STEP 2 OF 4
      </Text>
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 24,
          fontFamily: "Jakarta-Bold",
          marginBottom: 32,
        }}
      >
        What is your average monthly earning?
      </Text>

      <View
        style={{
          backgroundColor: "#1E1E1E",
          borderRadius: 16,
          padding: 24,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#D7FF00",
            fontSize: 48,
            fontFamily: "Jakarta-Bold",
            marginBottom: 24,
          }}
        >
          ₹{(surveyData.avg_monthly_income / 1000).toFixed(0)}k
        </Text>

        <Slider
          style={{ width: "100%", height: 40 }}
          minimumValue={10000}
          maximumValue={50000}
          step={1000}
          value={surveyData.avg_monthly_income}
          onValueChange={(value) =>
            setSurveyData({ ...surveyData, avg_monthly_income: value })
          }
          minimumTrackTintColor="#D7FF00"
          maximumTrackTintColor="#333333"
          thumbTintColor="#D7FF00"
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginTop: 8,
          }}
        >
          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 12,
              fontFamily: "Jakarta-Regular",
            }}
          >
            ₹10k
          </Text>
          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 12,
              fontFamily: "Jakarta-Regular",
            }}
          >
            ₹50k+
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCard2 = () => (
    <View
      style={{
        backgroundColor: "rgba(30, 30, 30, 0.95)",
        borderRadius: 24,
        padding: 24,
        width: width - 48,
        borderWidth: 2,
        borderColor:
          surveyData.income_volatility !== ""
            ? "#D7FF00"
            : "rgba(255, 255, 255, 0.1)",
        shadowColor: "#D7FF00",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: surveyData.income_volatility !== "" ? 0.3 : 0,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <Text
        style={{
          color: "#D7FF00",
          fontSize: 14,
          fontFamily: "Jakarta-Medium",
          marginBottom: 8,
        }}
      >
        STEP 3 OF 4
      </Text>
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 24,
          fontFamily: "Jakarta-Bold",
          marginBottom: 24,
        }}
      >
        How often do you get paid?
      </Text>

      <View style={{ gap: 12 }}>
        {volatilities.map((vol) => (
          <TouchableOpacity
            key={vol.id}
            onPress={() =>
              setSurveyData({ ...surveyData, income_volatility: vol.id })
            }
            style={{
              backgroundColor:
                surveyData.income_volatility === vol.id ? "#D7FF00" : "#1E1E1E",
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor:
                surveyData.income_volatility === vol.id
                  ? "#D7FF00"
                  : "rgba(255, 255, 255, 0.1)",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 32, marginRight: 16 }}>{vol.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color:
                    surveyData.income_volatility === vol.id
                      ? "#070707"
                      : "#FFFFFF",
                  fontSize: 18,
                  fontFamily: "Jakarta-Bold",
                }}
              >
                {vol.label}
              </Text>
              <Text
                style={{
                  color:
                    surveyData.income_volatility === vol.id
                      ? "#333333"
                      : "#9CA3AF",
                  fontSize: 12,
                  fontFamily: "Jakarta-Regular",
                  marginTop: 2,
                }}
              >
                {vol.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCard3 = () => (
    <View
      style={{
        backgroundColor: "rgba(30, 30, 30, 0.95)",
        borderRadius: 24,
        padding: 24,
        width: width - 48,
        borderWidth: 2,
        borderColor:
          surveyData.savings_balance !== 0
            ? "#D7FF00"
            : "rgba(255, 255, 255, 0.1)",
        shadowColor: "#D7FF00",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: surveyData.savings_balance !== 0 ? 0.3 : 0,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <Text
        style={{
          color: "#D7FF00",
          fontSize: 14,
          fontFamily: "Jakarta-Medium",
          marginBottom: 8,
        }}
      >
        STEP 4 OF 4
      </Text>
      <Text
        style={{
          color: "#FFFFFF",
          fontSize: 24,
          fontFamily: "Jakarta-Bold",
          marginBottom: 24,
        }}
      >
        If you stopped working today, how long could you survive?
      </Text>

      <View style={{ gap: 12 }}>
        {safetyNets.map((net) => (
          <TouchableOpacity
            key={net.id}
            onPress={() =>
              setSurveyData({ ...surveyData, savings_balance: net.value })
            }
            style={{
              backgroundColor:
                surveyData.savings_balance === net.value
                  ? "#D7FF00"
                  : "#1E1E1E",
              borderRadius: 16,
              padding: 20,
              borderWidth: 2,
              borderColor:
                surveyData.savings_balance === net.value
                  ? "#D7FF00"
                  : "rgba(255, 255, 255, 0.1)",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 32, marginRight: 16 }}>{net.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color:
                    surveyData.savings_balance === net.value
                      ? "#070707"
                      : "#FFFFFF",
                  fontSize: 18,
                  fontFamily: "Jakarta-Bold",
                }}
              >
                {net.label}
              </Text>
              <Text
                style={{
                  color:
                    surveyData.savings_balance === net.value
                      ? "#333333"
                      : "#9CA3AF",
                  fontSize: 12,
                  fontFamily: "Jakarta-Regular",
                  marginTop: 2,
                }}
              >
                {net.subtitle}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCurrentCard = () => {
    switch (currentCard) {
      case 0:
        return renderCard0();
      case 1:
        return renderCard1();
      case 2:
        return renderCard2();
      case 3:
        return renderCard3();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#070707" }}>
      {/* Header */}
      <View style={{ padding: 24, paddingBottom: 16 }}>
        <Text
          style={{
            color: "#D7FF00",
            fontSize: 16,
            fontFamily: "Jakarta-Bold",
            marginBottom: 16,
          }}
        >
          Calibrating Digital Twin...
        </Text>

        {/* Progress Bar */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              style={{
                flex: 1,
                height: 4,
                backgroundColor:
                  index <= currentCard ? "#D7FF00" : "rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
              }}
            />
          ))}
        </View>
      </View>

      {/* Card Stack */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
        }}
      >
        {/* Background cards for depth effect */}
        {currentCard < 3 && (
          <View
            style={{
              position: "absolute",
              width: width - 68,
              height: 400,
              backgroundColor: "rgba(30, 30, 30, 0.3)",
              borderRadius: 24,
              top: "25%",
              transform: [{ scale: 0.92 }, { translateY: 20 }],
            }}
          />
        )}
        {currentCard < 2 && (
          <View
            style={{
              position: "absolute",
              width: width - 88,
              height: 400,
              backgroundColor: "rgba(30, 30, 30, 0.15)",
              borderRadius: 24,
              top: "25%",
              transform: [{ scale: 0.84 }, { translateY: 40 }],
            }}
          />
        )}

        {/* Active Card */}
        <Animated.View
          style={{
            transform: [
              {
                translateX: cardAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -width],
                }),
              },
            ],
          }}
        >
          {renderCurrentCard()}
        </Animated.View>
      </View>

      {/* Next Button */}
      <View
        style={{
          padding: 24,
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canProceed()}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: canProceed() ? "#D7FF00" : "#333333",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#D7FF00",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: canProceed() ? 0.4 : 0,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text style={{ fontSize: 24 }}>{currentCard === 3 ? "✓" : "→"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Survey;
