import { router } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    createdAt?: number;
  } | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("arth_user")
      .then((s) => {
        if (s) setUser(JSON.parse(s));
      })
      .catch(() => {});
  }, []);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            // Clear any user data/tokens here
            AsyncStorage.removeItem("arth_user").catch(() => {});
            router.replace("/(auth)/welcome");
          },
        },
      ],
      { cancelable: true }
    );
  };
  const menuItems = [
    {
      section: "Account",
      items: [
        { icon: "👤", label: "Personal Information", chevron: true },
        { icon: "💼", label: "Work Profile", chevron: true },
        { icon: "🔒", label: "Privacy & Security", chevron: true },
      ],
    },
    {
      section: "Preferences",
      items: [
        { icon: "🔔", label: "Notifications", chevron: true },
        { icon: "🌙", label: "Dark Mode", toggle: true, value: true },
        { icon: "🌍", label: "Language", value: "English", chevron: true },
      ],
    },
    {
      section: "Support",
      items: [
        { icon: "💬", label: "Help Center", chevron: true },
        { icon: "📧", label: "Contact Support", chevron: true },
        { icon: "⭐", label: "Rate ArthSaathi", chevron: true },
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
          Profile
        </Text>
        <Text
          style={{
            color: "#9CA3AF",
            fontSize: 14,
            fontFamily: "Jakarta-Regular",
            marginTop: 4,
          }}
        >
          Manage your account
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: "rgba(30,30,30,0.95)",
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: "rgba(215,255,0,0.3)",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(215,255,0,0.12)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                borderWidth: 3,
                borderColor: "#D7FF00",
              }}
            >
              <Text style={{ fontSize: 36 }}>👤</Text>
            </View>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontFamily: "Jakarta-Bold",
                marginBottom: 4,
              }}
            >
              {user?.name || "Your Name"}
            </Text>
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 13,
                fontFamily: "Jakarta-Regular",
                marginBottom: 16,
              }}
            >
              {user?.email || "your.email@example.com"}
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 16,
                width: "100%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#1E1E1E",
                  borderRadius: 12,
                  padding: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#D7FF00",
                    fontSize: 20,
                    fontFamily: "Jakarta-Bold",
                  }}
                >
                  {user?.createdAt
                    ? Math.max(
                        0,
                        Math.floor((Date.now() - user.createdAt) / 86400000)
                      )
                    : 0}
                </Text>
                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 11,
                    fontFamily: "Jakarta-Regular",
                    marginTop: 2,
                  }}
                >
                  Days Active
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  backgroundColor: "#1E1E1E",
                  borderRadius: 12,
                  padding: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#4ECDC4",
                    fontSize: 20,
                    fontFamily: "Jakarta-Bold",
                  }}
                >
                  ₹0
                </Text>
                <Text
                  style={{
                    color: "#9CA3AF",
                    fontSize: 11,
                    fontFamily: "Jakarta-Regular",
                    marginTop: 2,
                  }}
                >
                  Total Saved
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <View
            key={sectionIndex}
            style={{ paddingHorizontal: 20, marginBottom: 24 }}
          >
            <Text
              style={{
                color: "#9CA3AF",
                fontSize: 13,
                fontFamily: "Jakarta-Bold",
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              {section.section}
            </Text>

            <View
              style={{
                backgroundColor: "#1E1E1E",
                borderRadius: 16,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 16,
                    borderBottomWidth:
                      itemIndex < section.items.length - 1 ? 1 : 0,
                    borderBottomColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Text style={{ fontSize: 22, marginRight: 12 }}>
                    {item.icon}
                  </Text>

                  <Text
                    style={{
                      flex: 1,
                      color: "#FFFFFF",
                      fontSize: 14,
                      fontFamily: "Jakarta-Medium",
                    }}
                  >
                    {item.label}
                  </Text>

                  {item.toggle && (
                    <View
                      style={{
                        width: 48,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: item.value ? "#D7FF00" : "#333333",
                        padding: 2,
                        justifyContent: "center",
                        alignItems: item.value ? "flex-end" : "flex-start",
                      }}
                    >
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: "#FFFFFF",
                        }}
                      />
                    </View>
                  )}

                  {item.value && !item.toggle && (
                    <Text
                      style={{
                        color: "#9CA3AF",
                        fontSize: 13,
                        fontFamily: "Jakarta-Regular",
                        marginRight: 8,
                      }}
                    >
                      {item.value}
                    </Text>
                  )}

                  {item.chevron && (
                    <Text style={{ color: "#9CA3AF", fontSize: 16 }}>›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              backgroundColor: "rgba(255, 107, 107, 0.1)",
              borderRadius: 12,
              padding: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "rgba(255, 107, 107, 0.3)",
            }}
          >
            <Text
              style={{
                color: "#FF6B6B",
                fontSize: 14,
                fontFamily: "Jakarta-Bold",
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View style={{ alignItems: "center", paddingBottom: 20 }}>
          <Text
            style={{
              color: "#9CA3AF",
              fontSize: 11,
              fontFamily: "Jakarta-Regular",
            }}
          >
            ArthSaathi v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
