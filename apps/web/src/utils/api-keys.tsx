import { Badge } from "@/components/ui/badge";
import { differenceInDays, format } from "date-fns";

export const formatDate = (date: Date | null) => {
  if (!date) return "N/A";
  return format(date, "MMM d, yyyy");
};

export const getStatusBadge = (status: string, expiresAt: Date | null) => {
  if (status === "expired") {
    return <Badge variant="destructive">Expired</Badge>;
  }
  if (expiresAt) {
    const daysLeft = differenceInDays(expiresAt, new Date());
    if (daysLeft <= 0) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (daysLeft <= 7) {
      return <Badge variant="secondary">Expires in {daysLeft} days</Badge>;
    }
  }
  return <Badge variant="outline">Active</Badge>;
};

export const getPermissionBadges = (permissions: string[]) => {
  const permissionColors: Record<string, string> = {
    read: "bg-blue-100 text-blue-800",
    write: "bg-green-100 text-green-800",
    delete: "bg-red-100 text-red-800",
  };

  return permissions.map((permission) => (
    <Badge
      className={permissionColors[permission]}
      key={permission}
      variant="outline"
    >
      {permission}
    </Badge>
  ));
};

export const maskApiKey = (key: string) => {
  const prefix = key.substring(0, 4);
  const suffix = key.substring(key.length - 4);
  return `${prefix}${"*".repeat(key.length - 8)}${suffix}`;
};
