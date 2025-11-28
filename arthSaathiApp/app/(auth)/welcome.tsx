import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Swiper from 'react-native-swiper'

import { onboarding } from '@/constants'

const Home = () => {
  const swiperRef = useRef<Swiper>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const isLastSlide = activeIndex === onboarding.length - 1

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-[#060607]">
      <TouchableOpacity
        onPress={() => router.replace('/(auth)/sign-up')}
        className="w-full flex justify-end items-end px-4 pt-4"
      >
        <Text
          className="text-white text-sm opacity-70"
          style={{ fontFamily: 'Jakarta-Medium' }}
        >
          Skip
        </Text>
      </TouchableOpacity>

      <Swiper
        ref={swiperRef}
        loop={false}
        containerStyle={{ height: '70%' }}
        dot={
          <View
            className="mx-2 bg-white/20 rounded-full"
            style={{ width: 18, height: 6 }}
          />
        }
        activeDot={
          <View
            className="mx-2 rounded-full"
            style={{ width: 34, height: 6, backgroundColor: '#D7FF00' }}
          />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View
            key={item.id}
            className="flex items-center justify-center px-6 pt-14 pb-6"
          >
            <Text
              className="text-white text-3xl mx-10 text-center"
              style={{ fontFamily: 'Jakarta-Bold', fontSize: 28 }}
            >
              {item.title}
            </Text>
            <View
              className="mt-10 mb-2 w-80 h-96 rounded-3xl bg-[#0B0B0B] items-center justify-center border border-white/5"
              style={{
                shadowColor: '#00FF66',
                shadowOffset: { width: 0, height: 18 },
                shadowOpacity: 0.22,
                shadowRadius: 48,
                elevation: 26,
              }}
            >
              <Image
                source={item.image}
                style={{ width: 320, height: 320, borderRadius: 20 }}
                resizeMode="cover"
              />
            </View>

            <Text
              className="text-center mx-10 mt-1 text-[#A3A3A3]"
              style={{ fontFamily: 'Jakarta-SemiBold', fontSize: 15 }}
            >
              {item.description}
            </Text>
          </View>
        ))}
      </Swiper>

      <TouchableOpacity
        activeOpacity={0.92}
        onPress={() =>
          isLastSlide
            ? router.replace('/(auth)/sign-up')
            : swiperRef.current?.scrollBy(1)
        }
        style={{
          width: '92%',
          height: 52,
          backgroundColor: '#D7FF00',
          borderRadius: 999,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
          marginBottom: 18,
        }}
      >
        <Text
          style={{ color: '#070707', fontFamily: 'Jakarta-Bold', fontSize: 16 }}
        >
          {isLastSlide ? 'Get Started' : 'Continue'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Home
