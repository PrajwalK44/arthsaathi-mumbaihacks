import { router } from "expo-router";
import { useState } from "react";
import {
  Animated,
  Dimensions,
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
    <View className="bg-neutral-900/95 rounded-3xl p-6 border-2 shadow-2xl" style={{
      width: width - 48,
      borderColor: surveyData.role !== "" ? "#D7FF00" : "rgba(255, 255, 255, 0.1)",
      shadowColor: "#D7FF00",
      shadowOpacity: surveyData.role !== "" ? 0.3 : 0,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    }}>
      <Text className="text-[#D7FF00] text-sm font-jakarta-medium mb-2">
        STEP 1 OF 4
      </Text>
      <Text className="text-white text-2xl font-jakarta-bold mb-6">
        How do you earn your money?
      </Text>

      <View className="flex-row flex-wrap gap-3">
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            onPress={() => setSurveyData({ ...surveyData, role: role.id })}
            className="rounded-2xl border-2 items-center justify-center p-3"
            style={{
              width: (width - 120) / 2,
              aspectRatio: 1,
              backgroundColor: surveyData.role === role.id ? "#D7FF00" : "#1E1E1E",
              borderColor: surveyData.role === role.id ? "#D7FF00" : "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Text className="text-4xl mb-2">{role.icon}</Text>
            <Text
              className="text-sm font-jakarta-bold text-center"
              style={{ color: surveyData.role === role.id ? "#070707" : "#FFFFFF" }}
            >
              {role.label}
            </Text>
            <Text
              className="text-xs font-jakarta-regular text-center mt-1"
              style={{ color: surveyData.role === role.id ? "#333333" : "#9CA3AF" }}
            >
              {role.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCard1 = () => (
    <View className="bg-neutral-900/95 rounded-3xl p-6 border-2 border-[#D7FF00] shadow-2xl" style={{
      width: width - 48,
      shadowColor: "#D7FF00",
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    }}>
      <Text className="text-[#D7FF00] text-sm font-jakarta-medium mb-2">
        STEP 2 OF 4
      </Text>
      <Text className="text-white text-2xl font-jakarta-bold mb-8">
        What is your average monthly earning?
      </Text>

      <View className="bg-neutral-800 rounded-2xl p-6 items-center">
        <Text className="text-[#D7FF00] text-5xl font-jakarta-bold mb-6">
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

        <View className="flex-row justify-between w-full mt-2">
          <Text className="text-gray-400 text-xs font-jakarta-regular">
            ₹10k
          </Text>
          <Text className="text-gray-400 text-xs font-jakarta-regular">
            ₹50k+
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCard2 = () => (
    <View className="bg-neutral-900/95 rounded-3xl p-6 border-2 shadow-2xl" style={{
      width: width - 48,
      borderColor: surveyData.income_volatility !== "" ? "#D7FF00" : "rgba(255, 255, 255, 0.1)",
      shadowColor: "#D7FF00",
      shadowOpacity: surveyData.income_volatility !== "" ? 0.3 : 0,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    }}>
      <Text className="text-[#D7FF00] text-sm font-jakarta-medium mb-2">
        STEP 3 OF 4
      </Text>
      <Text className="text-white text-2xl font-jakarta-bold mb-6">
        How often do you get paid?
      </Text>

      <View className="gap-3">
        {volatilities.map((vol) => (
          <TouchableOpacity
            key={vol.id}
            onPress={() =>
              setSurveyData({ ...surveyData, income_volatility: vol.id })
            }
            className="rounded-2xl p-5 border-2 flex-row items-center"
            style={{
              backgroundColor: surveyData.income_volatility === vol.id ? "#D7FF00" : "#1E1E1E",
              borderColor: surveyData.income_volatility === vol.id ? "#D7FF00" : "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Text className="text-3xl mr-4">{vol.icon}</Text>
            <View className="flex-1">
              <Text
                className="text-lg font-jakarta-bold"
                style={{ color: surveyData.income_volatility === vol.id ? "#070707" : "#FFFFFF" }}
              >
                {vol.label}
              </Text>
              <Text
                className="text-xs font-jakarta-regular mt-0.5"
                style={{ color: surveyData.income_volatility === vol.id ? "#333333" : "#9CA3AF" }}
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
    <View className="bg-neutral-900/95 rounded-3xl p-6 border-2 shadow-2xl" style={{
      width: width - 48,
      borderColor: surveyData.savings_balance !== 0 ? "#D7FF00" : "rgba(255, 255, 255, 0.1)",
      shadowColor: "#D7FF00",
      shadowOpacity: surveyData.savings_balance !== 0 ? 0.3 : 0,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    }}>
      <Text className="text-[#D7FF00] text-sm font-jakarta-medium mb-2">
        STEP 4 OF 4
      </Text>
      <Text className="text-white text-2xl font-jakarta-bold mb-6">
        If you stopped working today, how long could you survive?
      </Text>

      <View className="gap-3">
        {safetyNets.map((net) => (
          <TouchableOpacity
            key={net.id}
            onPress={() =>
              setSurveyData({ ...surveyData, savings_balance: net.value })
            }
            className="rounded-2xl p-5 border-2 flex-row items-center"
            style={{
              backgroundColor: surveyData.savings_balance === net.value ? "#D7FF00" : "#1E1E1E",
              borderColor: surveyData.savings_balance === net.value ? "#D7FF00" : "rgba(255, 255, 255, 0.1)",
            }}
          >
            <Text className="text-3xl mr-4">{net.icon}</Text>
            <View className="flex-1">
              <Text
                className="text-lg font-jakarta-bold"
                style={{ color: surveyData.savings_balance === net.value ? "#070707" : "#FFFFFF" }}
              >
                {net.label}
              </Text>
              <Text
                className="text-xs font-jakarta-regular mt-0.5"
                style={{ color: surveyData.savings_balance === net.value ? "#333333" : "#9CA3AF" }}
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
    <SafeAreaView className="flex-1 bg-[#070707]">
      {/* Header */}
      <View className="p-6 pb-4">
        <Text className="text-[#D7FF00] text-base font-jakarta-bold mb-4">
          Calibrating Digital Twin...
        </Text>

        {/* Progress Bar */}
        <View className="flex-row gap-2">
          {[0, 1, 2, 3].map((index) => (
            <View
              key={index}
              className="flex-1 h-1 rounded-sm"
              style={{
                backgroundColor: index <= currentCard ? "#D7FF00" : "rgba(255, 255, 255, 0.1)",
              }}
            />
          ))}
        </View>
      </View>

      {/* Card Stack */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Background cards for depth effect */}
        {currentCard < 3 && (
          <View
            className="absolute bg-neutral-900/30 rounded-3xl"
            style={{
              width: width - 68,
              height: 400,
              top: "25%",
              transform: [{ scale: 0.92 }, { translateY: 20 }],
            }}
          />
        )}
        {currentCard < 2 && (
          <View
            className="absolute bg-neutral-900/15 rounded-3xl"
            style={{
              width: width - 88,
              height: 400,
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
      <View className="p-6 items-end">
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canProceed()}
          className="w-16 h-16 rounded-full items-center justify-center shadow-lg"
          style={{
            backgroundColor: canProceed() ? "#D7FF00" : "#333333",
            shadowColor: "#D7FF00",
            shadowOpacity: canProceed() ? 0.4 : 0,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          }}
        >
          <Text className="text-2xl">{currentCard === 3 ? "✓" : "→"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Survey;
