import { Shield, UsersRound } from "lucide-react";

import type { RoleManagementTab } from "../types/role";

interface RoleTabsProps {
  activeTab: RoleManagementTab;
  onChange: (tab: RoleManagementTab) => void;
}

export const RoleTabs = ({ activeTab, onChange }: RoleTabsProps) => {
  const tabs = [
    {
      key: "roles" as const,
      label: "Vai trò & Quyền hạn",
      icon: Shield,
    },
    {
      key: "users" as const,
      label: "Người dùng & Vai trò",
      icon: UsersRound,
    },
  ];

  return (
    <div className="role-mgmt__tabs" role="tablist" aria-label="Quản lý vai trò">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const selected = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={selected}
            className={selected ? "role-mgmt__tab role-mgmt__tab--active" : "role-mgmt__tab"}
            onClick={() => onChange(tab.key)}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
