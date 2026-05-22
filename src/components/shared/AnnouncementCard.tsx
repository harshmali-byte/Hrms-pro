import { Pressable, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { font } from "@/constants/fonts";
import type { Announcement } from "@/types";
import { iconSizes, palette } from "@/constants/theme";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeTone } from "@/components/ui/Badge";

const tagToTone: Record<Announcement["tag"], BadgeTone> = {
  policy: "info",
  event: "primary",
  celebration: "success",
  general: "neutral",
  project: "primary",
};

interface Props {
  announcement: Announcement;
  onPress?: () => void;
}

export function AnnouncementCard({ announcement, onPress }: Props) {
  const inner = (
    <>
      <View className="flex-row items-center justify-between">
        <Badge label={announcement.tag} tone={tagToTone[announcement.tag]} />
        <View className="flex-row items-center">
          <Text style={{ fontFamily: font.regular }} className="mr-1 text-xs text-textMuted">
            {announcement.postedOn}
          </Text>
          {onPress ? (
            <ChevronRight size={iconSizes.xs} color={palette.textSubtle} />
          ) : null}
        </View>
      </View>
      <Text style={{ fontFamily: font.semibold }} className="mt-3 text-base text-text">
        {announcement.title}
      </Text>
      <Text
        style={{ fontFamily: font.regular }}
        numberOfLines={2}
        className="mt-1 text-sm leading-5 text-textMuted"
      >
        {announcement.body}
      </Text>
      <Text style={{ fontFamily: font.regular }} className="mt-3 text-xs text-textSubtle">
        — {announcement.postedBy}
      </Text>
    </>
  );

  if (!onPress) {
    return <Card elevated={false}>{inner}</Card>;
  }

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card className="active:bg-surfaceMuted" elevated={false}>
        {inner}
      </Card>
    </Pressable>
  );
}
