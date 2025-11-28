import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

interface LoadingScreenProps {
  messages: string[];
  onComplete?: () => void;
  duration?: number; // Total duration in milliseconds
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  messages,
  onComplete,
  duration = 3000,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const circuitAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Rotation animation for rings
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Circuit line expansion
    Animated.loop(
      Animated.sequence([
        Animated.timing(circuitAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(circuitAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Complete after duration
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (onComplete) onComplete();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotationReverse = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={{ opacity: fadeAnim }}
      className="flex-1 bg-[#070707] items-center justify-center"
    >
      {/* Background grid pattern */}
      <View className="absolute inset-0" style={{ opacity: 0.1 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={`h-${i}`}
            className="absolute w-full h-px bg-[#D7FF00]"
            style={{ top: (height / 20) * i }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={`v-${i}`}
            className="absolute h-full w-px bg-[#D7FF00]"
            style={{ left: (width / 20) * i }}
          />
        ))}
      </View>

      {/* Center Logo with Animations */}
      <View className="items-center justify-center">
        {/* Rotating outer ring */}
        <Animated.View
          className="absolute border-2 border-[#D7FF00]/30 rounded-full"
          style={{
            width: 280,
            height: 280,
            transform: [{ rotate: rotation }],
          }}
        >
          {/* Circuit nodes on ring */}
          {[0, 90, 180, 270].map((angle, i) => (
            <View
              key={i}
              className="absolute w-3 h-3 rounded-full bg-[#D7FF00] border border-[#D7FF00]"
              style={{
                top:
                  280 / 2 -
                  6 +
                  Math.sin((angle * Math.PI) / 180) * (280 / 2 - 6),
                left:
                  280 / 2 -
                  6 +
                  Math.cos((angle * Math.PI) / 180) * (280 / 2 - 6),
                shadowColor: "#D7FF00",
                shadowOpacity: 0.8,
                shadowRadius: 8,
              }}
            />
          ))}
        </Animated.View>

        {/* Counter-rotating middle ring */}
        <Animated.View
          className="absolute border-2 border-[#4ECDC4]/40 rounded-full"
          style={{
            width: 200,
            height: 200,
            transform: [{ rotate: rotationReverse }],
          }}
        >
          {/* Circuit nodes on middle ring */}
          {[45, 135, 225, 315].map((angle, i) => (
            <View
              key={i}
              className="absolute w-2 h-2 rounded-full bg-[#4ECDC4] border border-[#4ECDC4]"
              style={{
                top:
                  200 / 2 -
                  4 +
                  Math.sin((angle * Math.PI) / 180) * (200 / 2 - 4),
                left:
                  200 / 2 -
                  4 +
                  Math.cos((angle * Math.PI) / 180) * (200 / 2 - 4),
                shadowColor: "#4ECDC4",
                shadowOpacity: 0.6,
                shadowRadius: 6,
              }}
            />
          ))}
        </Animated.View>

        {/* Pulsing glow behind logo */}
        <Animated.View
          className="absolute rounded-full bg-[#D7FF00]"
          style={{
            width: 140,
            height: 140,
            opacity: glowOpacity,
            shadowColor: "#D7FF00",
            shadowOpacity: 0.8,
            shadowRadius: 40,
          }}
        />

        {/* AS Logo */}
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
          }}
          className="items-center justify-center"
        >
          <View
            className="items-center justify-center rounded-full border-4 border-[#D7FF00] bg-[#070707]"
            style={{
              width: 160,
              height: 160,
              shadowColor: "#D7FF00",
              shadowOpacity: 0.6,
              shadowRadius: 30,
            }}
          >
            <Text className="text-[#D7FF00] text-7xl font-jakarta-bold">
              AS
            </Text>
          </View>
        </Animated.View>

        {/* Circuit lines radiating from center */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <Animated.View
            key={`line-${i}`}
            className="absolute bg-[#D7FF00]"
            style={{
              width: 2,
              height: circuitAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 100],
              }),
              transform: [{ rotate: `${angle}deg` }, { translateY: -50 }],
              transformOrigin: "bottom",
              opacity: circuitAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.6, 0],
              }),
            }}
          />
        ))}
      </View>

      {/* Loading messages */}
      <View
        className="absolute px-8"
        style={{ bottom: height * 0.15, width: width }}
      >
        {messages.map((message, index) => (
          <View key={index} className="flex-row items-center mb-2">
            <Text className="text-[#D7FF00] text-sm font-jakarta-mono mr-2">
              &gt;&gt;
            </Text>
            <Text className="text-[#D7FF00] text-sm font-jakarta-regular flex-1">
              {message}
            </Text>
          </View>
        ))}
      </View>

      {/* Floating labels */}
      <View
        className="absolute"
        style={{ top: height * 0.25, right: width * 0.1 }}
      >
        <View className="bg-[#D7FF00]/10 border border-[#D7FF00] px-3 py-1 rounded">
          <Text className="text-[#D7FF00] text-xs font-jakarta-mono">
            NEURAL DATA
          </Text>
        </View>
      </View>

      <View
        className="absolute"
        style={{ top: height * 0.45, left: width * 0.05 }}
      >
        <View className="bg-[#D7FF00]/10 border border-[#D7FF00] px-3 py-1 rounded">
          <Text className="text-[#D7FF00] text-xs font-jakarta-mono">
            GAMER EXECUTIONS
          </Text>
        </View>
      </View>

      <View
        className="absolute"
        style={{ bottom: height * 0.35, right: width * 0.15 }}
      >
        <View className="bg-[#D7FF00]/10 border border-[#D7FF00] px-3 py-1 rounded">
          <Text className="text-[#D7FF00] text-xs font-jakarta-mono">
            RISK PROFILE
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default LoadingScreen;
