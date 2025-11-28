import { icons } from '@/constants'
import { Tabs } from 'expo-router'
import { Image, View } from 'react-native'

const TabIcon = ({ focused, source }: { focused: boolean; source: any }) => (
  <View className="flex-1 justify-center items-center">
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${
        focused ? 'bg-[#D7FF00]' : ''
      }`}
    >
      <Image
        source={source}
        tintColor={focused ? '#070707' : '#FFFFFF'}
        resizeMode="contain"
        className="w-6 h-6"
      />
    </View>
  </View>
)
const Layout = () => (
  <Tabs
    initialRouteName="home"
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: '#333333',
        borderRadius: 50,
        paddingBottom: 0,
        overflow: 'hidden',
        marginHorizontal: 20,
        marginBottom: 20,
        height: 78,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
      },
    }}
  >
    <Tabs.Screen
      name="home"
      options={{
        title: 'Home',
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.home} />
        ),
      }}
    />
    <Tabs.Screen
      name="timeline"
      options={{
        title: 'Timeline',
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.timeline} />
        ),
      }}
    />
    <Tabs.Screen
      name="podcast"
      options={{
        title: 'Podcast',
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.podcast} />
        ),
      }}
    />
    <Tabs.Screen
      name="profile"
      options={{
        title: 'Profile',
        tabBarIcon: ({ focused }) => (
          <TabIcon focused={focused} source={icons.profile} />
        ),
      }}
    />
  </Tabs>
)

export default Layout
