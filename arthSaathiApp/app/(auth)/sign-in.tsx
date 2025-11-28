import { Link, router } from "expo-router";
import { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ReactNativeModal } from "react-native-modal";

import { images } from "@/constants";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const onSignInPress = () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    // Mock auth: accept any non-empty credentials
    // Save minimal user profile locally
    const user = { email: form.email, createdAt: Date.now() };
    AsyncStorage.setItem("arth_user", JSON.stringify(user)).catch(() => {});
    setShowSuccessModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#121212" }}>
      <TouchableWithoutFeedback
        onPress={() => Keyboard.dismiss()}
        accessible={false}
      >
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={110}
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ position: "relative", width: "100%", height: 250 }}>
            <Image
              source={images.formHeader}
              style={{ zIndex: 0, width: "100%", height: 250 }}
            />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 22,
                fontFamily: "Jakarta-SemiBold",
                position: "absolute",
                bottom: 20,
                left: 20,
              }}
            >
              Welcome Back
            </Text>
          </View>

          <View style={{ padding: 20 }}>
            <Text
              style={{
                color: "#FFFFFF",
                marginBottom: 8,
                fontFamily: "Jakarta-Medium",
              }}
            >
              Email Address
            </Text>
            <TextInput
              ref={emailRef}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              blurOnSubmit={false}
              value={form.email}
              onChangeText={(value: string) =>
                setForm({ ...form, email: value })
              }
              placeholder="Enter email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                height: 52,
                borderRadius: 999,
                paddingHorizontal: 16,
                marginBottom: 12,
                fontFamily: "Jakarta-Regular",
              }}
            />

            <Text
              style={{
                color: "#FFFFFF",
                marginBottom: 8,
                fontFamily: "Jakarta-Medium",
              }}
            >
              Password
            </Text>
            <TextInput
              ref={passwordRef}
              returnKeyType="done"
              value={form.password}
              onChangeText={(value: string) =>
                setForm({ ...form, password: value })
              }
              placeholder="Enter password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={true}
              style={{
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                height: 52,
                borderRadius: 999,
                paddingHorizontal: 16,
                marginBottom: 12,
                fontFamily: "Jakarta-Regular",
              }}
            />

            <TouchableOpacity
              onPress={onSignInPress}
              style={{
                marginTop: 6,
                width: "100%",
                borderRadius: 999,
                backgroundColor: "#D7FF00",
                height: 52,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: "Jakarta-Bold", color: "#070707" }}>
                Sign In
              </Text>
            </TouchableOpacity>

            <Link
              href="/sign-up"
              style={{ alignSelf: "center", marginTop: 16 }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
                Don&apos;t have an account?{" "}
                <Text style={{ color: "#D7FF00" }}>Create Account</Text>
              </Text>
            </Link>
          </View>

          <ReactNativeModal
            isVisible={showSuccessModal}
            onBackdropPress={() => {
              setShowSuccessModal(false);
              router.replace("/(root)/(tabs)/home");
            }}
          >
            <View
              style={{
                backgroundColor: "#070707",
                paddingHorizontal: 20,
                paddingVertical: 24,
                borderRadius: 16,
                minHeight: 300,
                borderWidth: 1,
                borderColor: "rgba(215,255,0,0.12)",
              }}
            >
              <View
                style={{
                  width: 110,
                  height: 110,
                  alignSelf: "center",
                  marginVertical: 12,
                  borderRadius: 55,
                  backgroundColor: "rgba(215,255,0,0.06)",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: "#D7FF00",
                }}
              >
                <Text style={{ fontSize: 28 }}>✅</Text>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: "Jakarta-Bold",
                  textAlign: "center",
                  color: "#FFFFFF",
                }}
              >
                Signed In
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#9CA3AF",
                  textAlign: "center",
                  marginTop: 8,
                }}
              >
                You&apos;re now signed in.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowSuccessModal(false);
                  router.replace("/(root)/(tabs)/home");
                }}
                style={{
                  marginTop: 16,
                  width: "100%",
                  borderRadius: 8,
                  backgroundColor: "#D7FF00",
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Jakarta-Bold", color: "#070707" }}>
                  Go to Home
                </Text>
              </TouchableOpacity>
            </View>
          </ReactNativeModal>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
