import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Badge } from "@/components/ui/Badge";
import { Globe, Leaf, Shield } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { font } from "@/constants/fonts";
import { ASQUARIFY, ASQUARIFY_PROJECTS } from "@/constants/company";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

const PROJECT_ICONS: Record<string, LucideIcon> = {
  "ne-family": Shield,
  bakali: Leaf,
  hrms: Globe,
};

const statusTone = (status: string) => {
  if (status === "Live") return "success" as const;
  if (status === "In delivery") return "primary" as const;
  return "info" as const;
};

export function ProjectsShowcase() {
  const [selected, setSelected] = useState<(typeof ASQUARIFY_PROJECTS)[number] | null>(null);

  return (
    <View className="mb-2">
      <SectionHeader title="Active projects" />
      <Text style={{ fontFamily: font.regular }} className="-mt-2 mb-4 text-sm text-textMuted">
        {ASQUARIFY.displayName} — {ASQUARIFY.headquarters} · {ASQUARIFY.tagline}
      </Text>
      <View className="gap-3">
        {ASQUARIFY_PROJECTS.map((project) => {
          const Icon = PROJECT_ICONS[project.id] ?? Globe;
          return (
            <Pressable key={project.id} className="active:opacity-95" onPress={() => setSelected(project)}>
              <Card elevated className="overflow-hidden p-0">
                <View
                  className="h-1.5 w-full"
                  style={{ backgroundColor: project.accent }}
                />
                <View className="p-5">
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row flex-1 items-start">
                      <View
                        className="mr-3 h-11 w-11 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${project.accent}18` }}
                      >
                        <Icon size={22} color={project.accent} />
                      </View>
                      <View className="min-w-0 flex-1">
                        <Text style={{ fontFamily: font.bold }} className="text-lg text-text">
                          {project.name}
                        </Text>
                        <Text style={{ fontFamily: font.medium }} className="text-sm text-primary">
                          {project.subtitle}
                        </Text>
                        <Text
                          style={{ fontFamily: font.regular }}
                          className="mt-2 text-sm leading-5 text-textMuted"
                        >
                          {project.description}
                        </Text>
                      </View>
                    </View>
                    <Badge label={project.status} tone={statusTone(project.status)} />
                  </View>
                  <Text
                    style={{ fontFamily: font.regular }}
                    className="mt-3 text-xs text-textSubtle"
                  >
                    Region · {project.region}
                  </Text>
                </View>
              </Card>
            </Pressable>
          );
        })}
      </View>

      <BottomSheet
        visible={selected != null}
        title={selected?.name ?? "Project"}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <>
            <Badge label={selected.status} tone={statusTone(selected.status)} />
            <Text style={{ fontFamily: font.medium }} className="mt-2 text-sm text-primary">
              {selected.subtitle}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-3 text-sm leading-6 text-text">
              {selected.description}
            </Text>
            <Text style={{ fontFamily: font.regular }} className="mt-3 text-xs text-textSubtle">
              Region · {selected.region}
            </Text>
          </>
        ) : null}
      </BottomSheet>
    </View>
  );
}
