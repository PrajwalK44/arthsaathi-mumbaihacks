import { icons } from "@/constants";
import { Tabs } from "expo-router";
import { Image, View, Platform } from "react-native";

const TabIcon = ({ focused, source }: { focused: boolean; source: any }) => (
  <View
    style={{
      width: 56,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: focused ? "#D7FF00" : "transparent",
        shadowColor: focused ? "#D7FF00" : "transparent",
        marginBottom: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: focused ? 0.4 : 0,
        shadowRadius: 8,
        elevation: focused ? 8 : 0,
      }}
    >
      <Image
        source={source}
        resizeMode="contain"
        style={{
          width: 28,
          height: 28,
          tintColor: focused ? "#070707" : "#FFFFFF",
          opacity: focused ? 1 : 0.85,
        }}
      />
    </View>
  </View>
);
const Layout = () => (
  <Tabs
    initialRouteName="home"
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: "rgba(51, 51, 51, 0.95)",
        borderRadius: 30,
        paddingBottom: 0,
        paddingTop: 0,
        overflow: "hidden",
        marginHorizontal: 16,
        marginBottom: Platform.OS === "ios" ? 24 : 36,
        height: 70,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
      },
      tabBarActiveTintColor: "#D7FF00",
      tabBarInactiveTintColor: "#FFFFFF",
    }}
  >
    <Tabs.Screen
      name="home"
      options={{
        title: "Home",
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.home} />
        ),
      }}
    />
    <Tabs.Screen
      name="timeline"
      options={{
        title: "Timeline",
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.timeline} />
        ),
      }}
    />
    <Tabs.Screen
      name="podcast"
      options={{
        title: "Podcast",
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.podcast} />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: "Profile",
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.profile} />
        ),
      }}
    />
  </Tabs>
);

export default Layout;
