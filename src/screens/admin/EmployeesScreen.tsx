import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Share, Text, View } from "react-native";
import { Plus, Save, Search, Trash2, UserSearch } from "lucide-react-native";
import { font } from "@/constants/fonts";
import type { Employee } from "@/types";
import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { Header } from "@/components/ui/Header";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormActions } from "@/components/ui/FormActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { HelpBanner } from "@/components/ui/HelpBanner";
import { EmployeeListItem } from "@/components/shared/EmployeeListItem";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Avatar } from "@/components/ui/Avatar";
import { Divider } from "@/components/ui/Divider";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { useHrmsData } from "@/context/HrmsDataContext";
import { useAdminNav, type PeopleDepartmentFilter } from "@/context/AdminNavContext";

type Filter = PeopleDepartmentFilter;

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
  const { employees, addEmployee, updateEmployee, deleteEmployee, globalSearch } = useHrmsData();
  const { peopleDepartment, peopleStatus } = useAdminNav();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(peopleDepartment);
  const [statusFilter, setStatusFilter] = useState<"all" | Employee["status"]>(peopleStatus);

  useEffect(() => {
    setFilter(peopleDepartment);
  }, [peopleDepartment]);

  useEffect(() => {
    setStatusFilter(peopleStatus);
  }, [peopleStatus]);

  const filters = useMemo(() => {
    const depts = [...new Set(employees.map((e) => e.department))].sort();
    return ["All", ...depts] as Filter[];
  }, [employees]);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<Employee["status"]>("active");

  const searchText = (globalSearch || query).trim().toLowerCase();

  const list = useMemo(() => {
    return employees.filter((e) => {
      const matchesQuery =
        searchText === "" ||
        e.name.toLowerCase().includes(searchText) ||
        e.role.toLowerCase().includes(searchText) ||
        e.email.toLowerCase().includes(searchText);
      const matchesDept = filter === "All" || e.department === filter;
      const matchesStatus = statusFilter === "all" || e.status === statusFilter;
      return matchesQuery && matchesDept && matchesStatus;
    });
  }, [employees, searchText, filter, statusFilter]);

  const submitAdd = async () => {
    if (!name.trim() || !email.trim() || !role.trim()) {
      Alert.alert("Missing fields", "Name, email, and role are required.");
      return;
    }
    setSaving(true);
    try {
      const ok = await addEmployee({ name, email, role, department });
      if (ok) {
        setAddOpen(false);
        setName("");
        setEmail("");
        setRole("");
        setDepartment("Engineering");
        Alert.alert("Employee added", `${name.trim()} is now in the directory.`);
      }
    } catch (e) {
      Alert.alert("Could not save", e instanceof Error ? e.message : "Employee save failed.");
    } finally {
      setSaving(false);
    }
  };

  const openEmployee = (employee: Employee) => {
    setSelected(employee);
    setName(employee.name);
    setEmail(employee.email);
    setRole(employee.role);
    setDepartment(employee.department);
    setPhone(employee.phone);
    setLocation(employee.location ?? "");
    setStatus(employee.status);
  };

  const saveSelected = async () => {
    if (!selected) return;
    if (!name.trim() || !email.trim() || !role.trim()) {
      Alert.alert("Missing fields", "Name, email, and role are required.");
      return;
    }
    setSaving(true);
    try {
      await updateEmployee(selected.id, {
        name,
        email,
        role,
        department,
        phone,
        location,
        status,
      });
      setSelected(null);
      Alert.alert("Saved", `${name.trim()} has been updated.`);
    } catch (e) {
      Alert.alert("Could not save", e instanceof Error ? e.message : "Employee update failed.");
    } finally {
      setSaving(false);
    }
  };

  const removeSelected = () => {
    if (!selected) return;
    Alert.alert("Delete employee?", `${selected.name} will be removed from the directory.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setSaving(true);
          try {
            await deleteEmployee(selected.id);
            setSelected(null);
            Alert.alert("Deleted", `${selected.name} was removed.`);
          } catch (e) {
            Alert.alert("Could not delete", e instanceof Error ? e.message : "Delete failed.");
          } finally {
            setSaving(false);
          }
        },
      },
    ]);
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
        {(["all", "active", "onLeave", "probation"] as const).map((s) => {
          const active = statusFilter === s;
          const label =
            s === "all" ? "All statuses" : s === "onLeave" ? "On leave" : s === "active" ? "Active" : "Probation";
          return (
            <Pressable
              key={s}
              onPress={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1.5 ${
                active ? "border-primary bg-primary-soft" : "border-border bg-surface"
              }`}
            >
              <Text
                style={{ fontFamily: font.medium }}
                className={`text-xs ${active ? "text-primary" : "text-textMuted"}`}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

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
            <EmployeeListItem key={e.id} employee={e} onPress={openEmployee} />
          ))
        )}
      </View>

      <BottomSheet
        desktopWidth="lg"
        visible={addOpen}
        title="Add employee"
        onClose={() => setAddOpen(false)}
        footer={
          <FormActions
            primaryLabel="Save employee"
            onPrimary={() => void submitAdd()}
            primaryLoading={saving}
            onSecondary={() => setAddOpen(false)}
          />
        }
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
        desktopWidth="lg"
        visible={selected !== null}
        title={selected ? `Edit ${selected.name}` : "Employee"}
        onClose={() => setSelected(null)}
        footer={
          <FormActions
            primaryLabel="Save changes"
            primaryIcon={Save}
            onPrimary={() => void saveSelected()}
            primaryLoading={saving}
            onSecondary={() => setSelected(null)}
          />
        }
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
            <View className="gap-3">
              <Input label="Full name" value={name} onChangeText={setName} />
              <Input label="Work email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
              <Input label="Role" value={role} onChangeText={setRole} />
              <Input label="Department" value={department} onChangeText={setDepartment} />
              <Input label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              <Input label="Location" value={location} onChangeText={setLocation} />
              <Text style={{ fontFamily: font.medium }} className="text-sm text-textMuted">Status</Text>
              <View className="flex-row flex-wrap gap-2">
                {(["active", "onLeave", "probation"] as const).map((s) => {
                  const active = status === s;
                  return (
                    <Pressable
                      key={s}
                      onPress={() => setStatus(s)}
                      className={`rounded-full border px-3 py-2 ${
                        active ? "border-primary bg-primary-soft" : "border-border bg-surface"
                      }`}
                    >
                      <Text className={`text-sm font-medium ${active ? "text-primary" : "text-text"}`}>
                        {statusLabel[s]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <InfoRow label="Joined" value={selected.joinedOn} />
              <View className="mt-2 flex-row justify-end border-t border-border pt-4">
                <Button
                  label="Delete employee"
                  icon={Trash2}
                  variant="dangerOutline"
                  size="sm"
                  loading={saving}
                  onPress={removeSelected}
                />
              </View>
            </View>
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
