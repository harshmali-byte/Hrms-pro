import { useMemo, useState } from "react";
import { Alert, Pressable, Share, Text, View } from "react-native";
import { Plus, Search, UserSearch } from "lucide-react-native";
import { font } from "@/constants/fonts";
import type { Employee } from "@/types";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { EmployeeListItem } from "@/components/shared/EmployeeListItem";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Avatar } from "@/components/ui/Avatar";
import { Divider } from "@/components/ui/Divider";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { useHrmsData } from "@/context/HrmsDataContext";

const filters = ["All", "Engineering", "Design", "People", "Finance", "Marketing"] as const;
type Filter = (typeof filters)[number];

const statusTone: Record<Employee["status"], BadgeTone> = {
  active: "success",
  onLeave: "warning",
  probation: "info",
};

const statusLabel: Record<Employee["status"], string> = {
  active: "Active",
  onLeave: "On leave",
  probation: "Probation",
};

export function EmployeesScreen({ embedded = false }: { embedded?: boolean }) {
  const { employees, addEmployee, globalSearch } = useHrmsData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<Employee | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Engineering");

  const searchText = (globalSearch || query).trim().toLowerCase();

  const list = useMemo(() => {
    return employees.filter((e) => {
      const matchesQuery =
        searchText === "" ||
        e.name.toLowerCase().includes(searchText) ||
        e.role.toLowerCase().includes(searchText) ||
        e.email.toLowerCase().includes(searchText);
      const matchesFilter = filter === "All" || e.department === filter;
      return matchesQuery && matchesFilter;
    });
  }, [employees, searchText, filter]);

  const submitAdd = async () => {
    if (!name.trim() || !email.trim() || !role.trim()) {
      Alert.alert("Missing fields", "Name, email, and role are required.");
      return;
    }
    const ok = await addEmployee({ name, email, role, department });
    if (ok) {
      setAddOpen(false);
      setName("");
      setEmail("");
      setRole("");
      Alert.alert("Employee added", `${name.trim()} is now in the directory.`);
    }
  };

  return (
    <ScreenContainer embedded={embedded}>
      <Header
        title="People"
        subtitle={`${employees.length} people in directory`}
        embedded={embedded}
        right={<Button label="Add" icon={Plus} size="sm" onPress={() => setAddOpen(true)} />}
      />

      <HelpBanner text="Search by name or role. Tap a person for details. New hires sync to the dashboard totals." />

      <Input
        icon={Search}
        placeholder="Search name, role, or email"
        value={query}
        onChangeText={setQuery}
      />

      <View className="mt-3 flex-row flex-wrap gap-2">
        {filters.map((f) => {
          const active = f === filter;
          return (
            <Pressable
              key={f}
              onPress={() => setFilter(f)}
              className={`rounded-full border px-3 py-1.5 ${
                active ? "border-primary bg-primary-soft" : "border-border bg-surface"
              }`}
            >
              <Text
                style={{ fontFamily: font.medium }}
                className={`text-xs ${active ? "text-primary" : "text-textMuted"}`}
              >
                {f}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-4 gap-2">
        {list.length === 0 ? (
          <EmptyState
            icon={UserSearch}
            title="No matching employees"
            description="Try another search or filter, or add a new person."
            actionLabel="Add employee"
            onAction={() => setAddOpen(true)}
          />
        ) : (
          list.map((e) => (
            <EmployeeListItem key={e.id} employee={e} onPress={() => setSelected(e)} />
          ))
        )}
      </View>

      <BottomSheet
        visible={addOpen}
        title="Add employee"
        onClose={() => setAddOpen(false)}
        footer={<Button label="Save employee" fullWidth onPress={() => void submitAdd()} />}
      >
        <View className="gap-3">
          <Input label="Full name" value={name} onChangeText={setName} placeholder="Jane Doe" />
          <Input
            label="Work email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input label="Role" value={role} onChangeText={setRole} placeholder="Product Designer" />
          <Input
            label="Department"
            value={department}
            onChangeText={setDepartment}
            placeholder="Engineering"
          />
        </View>
      </BottomSheet>

      <BottomSheet
        visible={selected !== null}
        title={selected?.name ?? "Employee"}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <>
            <View className="mb-4 flex-row items-center">
              <Avatar name={selected.name} color={selected.avatarColor} size="lg" />
              <View className="ml-3 flex-1">
                <Text style={{ fontFamily: font.semibold }} className="text-lg text-text">
                  {selected.name}
                </Text>
                <Text style={{ fontFamily: font.regular }} className="text-sm text-textMuted">
                  {selected.role} · {selected.department}
                </Text>
                <View className="mt-2 self-start">
                  <Badge label={statusLabel[selected.status]} tone={statusTone[selected.status]} />
                </View>
              </View>
            </View>
            <Divider className="mb-4" />
            <InfoRow label="Email" value={selected.email} />
            <InfoRow label="Phone" value={selected.phone} />
            <InfoRow label="Joined" value={selected.joinedOn} />
          </>
        ) : null}
      </BottomSheet>
    </ScreenContainer>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const share = async () => {
    try {
      await Share.share({ title: label, message: `${label}: ${value}` });
    } catch {
      Alert.alert(label, value);
    }
  };
  return (
    <Pressable onPress={share} className="mb-3 rounded-lg py-1 active:bg-surfaceMuted">
      <Text style={{ fontFamily: font.regular }} className="text-xs text-textMuted">
        {label}
      </Text>
      <Text style={{ fontFamily: font.medium }} className="mt-0.5 text-base text-text">
        {value}
      </Text>
    </Pressable>
  );
}
