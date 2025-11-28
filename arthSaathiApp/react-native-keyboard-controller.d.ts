// Temporary module declaration to silence TypeScript errors when the
// 'react-native-keyboard-controller' package is not installed or has no types.
// This is safe to keep; once the package and proper types are installed,
// you can remove this file.
declare module 'react-native-keyboard-controller' {
  import * as React from 'react'
  import { ComponentType } from 'react'
  import { ScrollViewProps, ViewProps } from 'react-native'

  export const KeyboardProvider: ComponentType<{ children?: React.ReactNode }>
  export const KeyboardAwareScrollView: ComponentType<
    ScrollViewProps & { bottomOffset?: number; extraHeight?: number }
  >
  export const KeyboardToolbar: ComponentType<ViewProps>

  export default {
    KeyboardProvider,
    KeyboardAwareScrollView,
    KeyboardToolbar,
  }
}
