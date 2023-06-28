import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'
import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { ImageBackground } from 'react-native'
import { styled } from 'nativewind'
import blurbg from '../src/assets/bg-blur.png'
import Strips from '../src/assets/stripes.svg'
import { useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
const StyledStripes = styled(Strips)

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticate] = useState<null | boolean>(
    null,
  )

  const [hasLoadedFontes] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    BaiJamjuree_700Bold,
  })

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      console.log(!!token)
      setIsUserAuthenticate(!!token)
    })
  }, [])

  if (!hasLoadedFontes) {
    return <SplashScreen />
  }
  return (
    <ImageBackground
      source={blurbg}
      className="relative flex-1  bg-gray-900 "
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="memories" />
        <Stack.Screen name="new" />
      </Stack>
    </ImageBackground>
  )
}
