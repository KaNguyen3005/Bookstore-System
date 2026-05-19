import { Activity, KeyRound, ShieldCheck, UsersRound } from "lucide-react";

import type { RoleStats as RoleStatsType } from "../types/role";

interface RoleStatsProps {
  stats: RoleStatsType;
}

export const RoleStats = ({ stats }: RoleStatsProps) => {
  const items = [
    {
      label: "Tổng số vai trò",
      value: stats.totalRoles,
      helper: "+1 từ tháng trước",
      icon: ShieldCheck,
      tone: "blue",
    },
    {
      label: "Người dùng đã gán",
      value: stats.assignedUsers,
      helper: "Tài khoản có vai trò",
      icon: UsersRound,
      tone: "green",
    },
    {
      label: "Tổng quyền hạn",
      value: stats.totalPermissions,
      helper: "Quyền đang khả dụng",
      icon: KeyRound,
      tone: "violet",
    },
  ];

  return (
    <div className="role-mgmt__stats">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <section className="role-mgmt__stat" key={item.label}>
            <div>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
              <span>{item.helper}</span>
            </div>
            <span className={`role-mgmt__stat-icon role-mgmt__stat-icon--${item.tone}`}>
              <Icon size={19} />
            </span>
          </section>
        );
      })}
    </div>
  );
};
