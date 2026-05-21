import { View, Text } from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import { font } from "@/constants/fonts";

export type DonutSegment = { label: string; value: number; color: string };

interface Props {
  segments: DonutSegment[];
  size?: number;
  strokeWidth?: number;
}

export function DonutChart({ segments, size = 140, strokeWidth = 22 }: Props) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <View className="flex-row items-center">
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${cx}, ${cy}`}>
          {segments.map((seg, i) => {
            const pct = seg.value / total;
            const dash = pct * circumference;
            const circle = (
              <Circle
                key={seg.label}
                cx={cx}
                cy={cy}
                r={r}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return circle;
          })}
        </G>
      </Svg>
      <View className="ml-4 flex-1 gap-2">
        {segments.map((seg) => (
          <View key={seg.label} className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className="mr-2 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: seg.color }}
              />
              <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
                {seg.label}
              </Text>
            </View>
            <Text style={{ fontFamily: font.semibold }} className="text-sm text-text">
              {Math.round((seg.value / total) * 100)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
