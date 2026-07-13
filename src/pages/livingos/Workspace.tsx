import { LivingOSShell } from "@/livingos/shell/LivingOSShell";
import { LivingOSAlerts } from "@/livingos/pages/Alerts";

export default function LivingOSWorkspace() {
  return (
    <LivingOSShell>
      <LivingOSAlerts />
    </LivingOSShell>
  );
}
