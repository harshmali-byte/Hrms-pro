import { Text, TextProps } from "react-native";
import { font } from "@/constants/fonts";

type Props = TextProps & { className?: string; children: React.ReactNode };

/** Screen title — largest heading. */
export function H1({ className = "", style, children, ...rest }: Props) {
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

/** Subtitle under screen title. */
export function Lead({ className = "", style, children, ...rest }: Props) {
  return (
    <Text
      style={[{ fontFamily: font.regular }, style]}
      className={`mt-1.5 text-base leading-6 text-textMuted ${className}`}
      {...rest}
    >
      {children}
    </Text>
  );
}

/** Section headings (“Quick actions”, etc.). */
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

/** Inline link / “See all”. */
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

/** Primary body copy. */
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

/** Secondary body (descriptions). */
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

/** Marketing / login headline (smaller than H1). */
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

/** Dashboard user name line. */
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

/** Meta / helper under titles (“Welcome back”). */
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

/** Small labels (form fields). */
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

/** Stat labels, list metadata. */
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

/** Stat / KPI numbers. */
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

/** Small muted line (stat footnote, timestamps). */
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
