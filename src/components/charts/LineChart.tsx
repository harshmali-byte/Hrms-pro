import { View, Text } from "react-native";
import Svg, { Polyline, Line, Circle } from "react-native-svg";
import { palette } from "@/constants/theme";
import { font } from "@/constants/fonts";

interface Props {
  series: { data: number[]; color: string; label: string }[];
  height?: number;
  width?: number;
  maxY?: number;
}

function toPoints(data: number[], w: number, h: number, max: number): string {
  const step = data.length <= 1 ? w : w / (data.length - 1);
  return data
    .map((v, i) => {
      const x = i * step;
      const y = h - (v / max) * (h - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");
}

export function LineChart({ series, height = 160, width = 280, maxY }: Props) {
  const all = series.flatMap((s) => s.data);
  const max = maxY ?? Math.max(...all, 10);

  return (
    <View>
      <Svg width={width} height={height}>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = height - t * (height - 16) - 8;
          return (
            <Line
              key={t}
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke={palette.border}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          );
        })}
        {series.map((s) => (
          <Polyline
            key={s.label}
            points={toPoints(s.data, width, height, max)}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {series[0]?.data.map((_, i) => {
          const step = series[0].data.length <= 1 ? width : width / (series[0].data.length - 1);
          const x = i * step;
          return (
            <Circle key={i} cx={x} cy={4} r={0} fill="transparent" />
          );
        })}
      </Svg>
      <View className="mt-2 flex-row justify-between px-1">
        {["1", "5", "10", "15", "20", "25"].map((l) => (
          <Text key={l} style={{ fontFamily: font.regular }} className="text-xs text-textSubtle">
            {l}
          </Text>
        ))}
      </View>
      <View className="mt-3 flex-row gap-4">
        {series.map((s) => (
          <View key={s.label} className="flex-row items-center">
            <View className="mr-1.5 h-2 w-6 rounded-full" style={{ backgroundColor: s.color }} />
            <Text style={{ fontFamily: font.medium }} className="text-xs text-textMuted">
              {s.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
