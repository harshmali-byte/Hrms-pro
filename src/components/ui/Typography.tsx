import { Text, TextProps } from "react-native";
import { font } from "@/constants/fonts";

type Props = TextProps & { className?: string; children: React.ReactNode };

export function H1({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.bold }, style]}
      className={`text-3xl tracking-tight text-text ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Lead({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.regular }, style]}
      className={`mt-1 text-base leading-6 text-textMuted ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function SectionTitle({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.semibold }, style]}
      className={`text-lg tracking-tight text-text ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function LinkLabel({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.semibold }, style]}
      className={`text-sm text-primary ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Body({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.regular }, style]}
      className={`text-base leading-6 text-text ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function BodyMuted({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.regular }, style]}
      className={`text-base leading-6 text-textMuted ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function H2({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.bold }, style]}
      className={`text-xl tracking-tight text-text ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Headline({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.bold }, style]}
      className={`text-lg tracking-tight text-text ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Kicker({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.medium }, style]}
      className={`text-sm text-textMuted ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Label({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.medium }, style]}
      className={`text-sm text-textMuted ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Meta({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.regular }, style]}
      className={`text-sm text-textMuted ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function StatValue({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.bold }, style]}
      className={`text-2xl tracking-tight text-text ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

export function Fineprint({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.regular }, style]}
      className={`text-xs leading-4 text-textSubtle ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}
