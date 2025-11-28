// Mocked signup (no Clerk/backend) for local development
import { Link, router } from "expo-router";
import { useRef, useState } from "react";
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

// InputField removed: using native TextInput for controlled look
import { images } from "@/constants";

const SignUp = () => {
  // Mocked local signup state (no backend)
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // refs to move between inputs
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const confirmRef = useRef<TextInput | null>(null);
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });
  const [expectedCode] = useState("12345"); // mock verification code

  const onSignUpPress = async () => {
    // basic client-side validation
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // show verification modal (mock sending code)
    setVerification({ ...verification, state: "pending", error: "" });
  };

  const onPressVerify = async () => {
    // simple mock verification
    if (verification.code === expectedCode) {
      setVerification({ ...verification, state: "success", error: "" });
      setShowSuccessModal(true);
    } else {
      setVerification({
        ...verification,
        state: "failed",
        error: "Invalid verification code",
      });
    }
  };

  // Using KeyboardAwareScrollView (JS-only) so this works in Expo Go.
  // It will automatically scroll focused inputs into view.

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
              Create Your Account
            </Text>
          </View>

          <View style={{ padding: 20 }}>
            {/* Name */}
            <Text
              style={{
                color: "#FFFFFF",
                marginBottom: 8,
                fontFamily: "Jakarta-Medium",
              }}
            >
              Full Name
            </Text>
            <TextInput
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
              value={form.name}
              onChangeText={(value: string) =>
                setForm({ ...form, name: value })
              }
              placeholder="Enter name"
              placeholderTextColor="#9CA3AF"
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

            {/* Email */}
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

            {/* Password */}
            <Text
              style={{
                color: "#FFFFFF",
                marginBottom: 8,
                fontFamily: "Jakarta-Medium",
              }}
            >
              Create Password
            </Text>
            <TextInput
              ref={passwordRef}
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
              blurOnSubmit={false}
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

            {/* Confirm Password */}
            <Text
              style={{
                color: "#FFFFFF",
                marginBottom: 8,
                fontFamily: "Jakarta-Medium",
              }}
            >
              Confirm Password
            </Text>
            <TextInput
              ref={confirmRef}
              returnKeyType="done"
              value={form.confirmPassword}
              onChangeText={(value: string) =>
                setForm({ ...form, confirmPassword: value })
              }
              placeholder="Confirm password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={true}
              style={{
                backgroundColor: "#1E1E1E",
                color: "#FFFFFF",
                height: 52,
                borderRadius: 999,
                paddingHorizontal: 16,
                marginBottom: 18,
                fontFamily: "Jakarta-Regular",
              }}
            />

            <TouchableOpacity
              onPress={onSignUpPress}
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
                Create Account
              </Text>
            </TouchableOpacity>

            <Link
              href="/sign-in"
              style={{ alignSelf: "center", marginTop: 16 }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
                Already have an account?{" "}
                <Text style={{ color: "#D7FF00" }}>Log In</Text>
              </Text>
            </Link>
          </View>

          <ReactNativeModal
            isVisible={verification.state === "pending"}
            onModalHide={() => {
              if (verification.state === "success") {
                setShowSuccessModal(true);
              }
            }}
          >
            <View
              style={{
                backgroundColor: "#ffffff",
                paddingHorizontal: 20,
                paddingVertical: 24,
                borderRadius: 16,
                minHeight: 300,
              }}
            >
              <Text
                style={{
                  fontFamily: "Jakarta-ExtraBold",
                  fontSize: 20,
                  marginBottom: 8,
                }}
              >
                Verification
              </Text>
              <Text style={{ fontFamily: "Jakarta-Regular", marginBottom: 12 }}>
                We've sent a verification code to {form.email}.
              </Text>
              <TextInput
                value={verification.code}
                onChangeText={(code: string) =>
                  setVerification({ ...verification, code })
                }
                placeholder={"12345"}
                placeholderTextColor="#6B7280"
                keyboardType="numeric"
                style={{
                  backgroundColor: "#F3F4F6",
                  color: "#111827",
                  height: 48,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                }}
              />
              {verification.error ? (
                <Text style={{ color: "#DC2626", marginTop: 8 }}>
                  {verification.error}
                </Text>
              ) : null}
              <TouchableOpacity
                onPress={onPressVerify}
                style={{
                  marginTop: 16,
                  width: "100%",
                  borderRadius: 8,
                  backgroundColor: "#0EA5A0",
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ fontFamily: "Jakarta-Bold", color: "#ffffff" }}>
                  Verify Email
                </Text>
              </TouchableOpacity>
            </View>
          </ReactNativeModal>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>

      <ReactNativeModal isVisible={showSuccessModal}>
        <View
          style={{
            backgroundColor: "#ffffff",
            paddingHorizontal: 20,
            paddingVertical: 24,
            borderRadius: 16,
            minHeight: 300,
          }}
        >
          <View
            style={{
              width: 110,
              height: 110,
              alignSelf: "center",
              marginVertical: 12,
              borderRadius: 55,
              backgroundColor: "#ECFCCB",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 28 }}>✅</Text>
          </View>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Jakarta-Bold",
              textAlign: "center",
            }}
          >
            Verified
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            You have successfully verified your account.
          </Text>
          <TouchableOpacity
            onPress={() => router.push(`/(auth)/survey`)}
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
              Continue to Survey
            </Text>
          </TouchableOpacity>
        </View>
      </ReactNativeModal>
    </SafeAreaView>
  );
};

export default SignUp;
