import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import { useRouter } from 'expo-router'
import { styled } from 'nativewind'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'

import blurbg from '../src/assets/bg-blur.png'
import Strips from '../src/assets/stripes.svg'
import LOGOnlw from '../src/assets/nlw-spacetime.svg'
import { api } from '../src/lib/api'

import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

const StyledStripes = styled(Strips)

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/dfc791d3981215659db6 ',
}

export default function App() {
  const router = useRouter()

  const [hasLoadedFontes] = useFonts({
    Roboto_700Bold,
    Roboto_400Regular,
    BaiJamjuree_700Bold,
  })

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'dfc791d3981215659db6',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'spacetime',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })

    const { token } = response.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    // console.log(
    //   makeRedirectUri({
    //     scheme: 'spacetime',
    //   }),
    // )
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response])

  if (!hasLoadedFontes) {
    return null
  }
  return (
    <ImageBackground
      source={blurbg}
      className="relative flex-1 items-center bg-gray-900 px-8"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className="absolute left-2" />

      <View className="flex-1 items-center justify-center gap-6">
        <LOGOnlw />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Celecione momentos marcantes da sua jornada e compatilhe (se quise)
            com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
      <StatusBar style="light" />
    </ImageBackground>
  )
}
