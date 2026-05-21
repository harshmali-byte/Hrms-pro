import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { palette } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { EmployeeTabs } from "./EmployeeTabs";
import { AdminTabs } from "./AdminTabs";

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: palette.background,
    card: palette.surface,
    border: palette.border,
    primary: palette.primary,
    text: palette.text,
  },
};

export function RootNavigator() {
  const { role, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {role === null ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : role === "admin" ? (
          <Stack.Screen name="AdminRoot" component={AdminTabs} />
        ) : (
          <Stack.Screen name="EmployeeRoot" component={EmployeeTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
