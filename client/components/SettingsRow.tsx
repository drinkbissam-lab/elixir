import { ReactNode } from 'react';

interface SettingsRowProps {
  icon?: ReactNode;
  label: string;
  description?: string;
  action: ReactNode;
}

export default function SettingsRow({ icon, label, description, action }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4 border-b border-border py-4 last:border-b-0 sm:py-5 w-full overflow-hidden rtl:flex-row">
      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
        {icon && <div className="mt-1 text-primary flex-shrink-0">{icon}</div>}
        <div className="flex-1 min-w-0 overflow-hidden">
          <h3 className="font-semibold text-foreground truncate">{label}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 truncate">{description}</p>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 ml-2 sm:ml-4 rtl:ml-0 rtl:mr-2 sm:rtl:mr-4">{action}</div>
    </div>
  );
}
