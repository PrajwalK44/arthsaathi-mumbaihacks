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
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the city
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Scan line animation
    Animated.loop(
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
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

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height * 0.6],
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

      {/* 3D City Wireframe */}
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
        }}
        className="items-center justify-center"
      >
        <View className="items-center justify-center" style={{ height: 400 }}>
          {/* City wireframe - simplified representation */}
          <View className="items-center" style={{ width: width * 0.8 }}>
            {/* Tallest building */}
            <View
              className="border-2 border-[#D7FF00] bg-[#D7FF00]/5"
              style={{
                width: 60,
                height: 200,
                shadowColor: "#D7FF00",
                shadowOpacity: 0.6,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 0 },
              }}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <View
                  key={i}
                  className="border-b border-[#D7FF00]/30"
                  style={{ height: 20 }}
                />
              ))}
            </View>

            {/* Middle row of buildings */}
            <View
              className="flex-row gap-4 mt-4"
              style={{ width: width * 0.7 }}
            >
              {[150, 120, 180, 100].map((h, i) => (
                <View
                  key={i}
                  className="border-2 border-[#D7FF00] bg-[#D7FF00]/5 flex-1"
                  style={{
                    height: h,
                    shadowColor: "#D7FF00",
                    shadowOpacity: 0.4,
                    shadowRadius: 15,
                    shadowOffset: { width: 0, height: 0 },
                  }}
                >
                  {Array.from({ length: Math.floor(h / 20) }).map((_, j) => (
                    <View
                      key={j}
                      className="border-b border-[#D7FF00]/30"
                      style={{ height: 20 }}
                    />
                  ))}
                </View>
              ))}
            </View>

            {/* Base platform */}
            <View
              className="border-2 border-[#D7FF00] bg-[#D7FF00]/10 mt-4"
              style={{
                width: width * 0.8,
                height: 20,
                shadowColor: "#D7FF00",
                shadowOpacity: 0.8,
                shadowRadius: 30,
                shadowOffset: { width: 0, height: 10 },
              }}
            >
              <View className="flex-row h-full">
                {Array.from({ length: 30 }).map((_, i) => (
                  <View
                    key={i}
                    className="border-r border-[#D7FF00]/30 flex-1"
                  />
                ))}
              </View>
            </View>

            {/* Grid lines beneath */}
            <View className="mt-4" style={{ width: width * 0.8 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View
                  key={i}
                  className="border-b border-[#D7FF00]/20"
                  style={{ height: 8, opacity: 1 - i * 0.15 }}
                />
              ))}
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Scanning line effect */}
      <Animated.View
        className="absolute w-full h-px bg-[#D7FF00]"
        style={{
          top: height * 0.2,
          transform: [{ translateY: scanLineTranslateY }],
          shadowColor: "#D7FF00",
          shadowOpacity: 0.8,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 0 },
        }}
      />

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
