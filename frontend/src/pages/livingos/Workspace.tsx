import { LivingOSShell } from "@/livingos/shell/LivingOSShell";
import LivingOSAlerts from "@/livingos/pages/Alerts";
import { ActionsProvider } from "@/livingos/state/actionsStore";
import { SelectionProvider } from "@/state/selectionStore";

export default function LivingOSWorkspace() {
  return (
    <ActionsProvider>
      <SelectionProvider>
        <LivingOSShell>
          <LivingOSAlerts />
        </LivingOSShell>
      </SelectionProvider>
    </ActionsProvider>
  );
}
