import { useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIntegrations, ServiceKey } from "@/contexts/IntegrationsContext";
import { WhatsAppFlowStepper, StepKey } from "@/components/integrations/WhatsAppFlowStepper";
import { ServiceSelector } from "@/components/integrations/ServiceSelector";
import { AccountSelector } from "@/components/integrations/AccountSelector";
import { WhatsAppPurposeInfo } from "@/components/integrations/WhatsAppPurposeInfo";
import { WhatsAppLogo } from "@/components/integrations/WhatsAppLogo";
import { toast } from "sonner";

const COUNTRY_CODES = [
  { code: "+91", label: "🇮🇳 India (+91)" },
  { code: "+1", label: "🇺🇸 USA (+1)" },
  { code: "+44", label: "🇬🇧 UK (+44)" },
  { code: "+61", label: "🇦🇺 Australia (+61)" },
  { code: "+971", label: "🇦🇪 UAE (+971)" },
  { code: "+65", label: "🇸🇬 Singapore (+65)" },
  { code: "+49", label: "🇩🇪 Germany (+49)" },
];

const CORRECT_OTP = "123456";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editId: string | null;
}

export function IntegrationWhatsAppFlow({ open, onOpenChange, editId }: Props) {
  const { addIntegration, updateIntegration, getIntegration } = useIntegrations();
  const editing = editId ? getIntegration(editId) : undefined;

  const [step, setStep] = useState<StepKey>("phone");
  const [completed, setCompleted] = useState<StepKey[]>([]);
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceKey[]>([]);
  const [accountIds, setAccountIds] = useState<string[]>([]);

  // Initialize / reset on open
  useEffect(() => {
    if (!open) return;
    if (editing) {
      setCountryCode(editing.countryCode);
      setPhone(editing.phoneNumber);
      setOtp("");
      setOtpError(null);
      setServices(editing.services);
      setAccountIds(editing.accountIds);
      setStep("services");
      setCompleted(["phone", "otp"]);
    } else {
      setCountryCode("+91");
      setPhone("");
      setOtp("");
      setOtpError(null);
      setServices([]);
      setAccountIds([]);
      setStep("phone");
      setCompleted([]);
    }
  }, [open, editId]);

  const phoneValid = useMemo(() => /^\d{7,15}$/.test(phone), [phone]);

  const markComplete = (k: StepKey) =>
    setCompleted((prev) => (prev.includes(k) ? prev : [...prev, k]));

  const goNext = () => {
    if (step === "phone") {
      if (!phoneValid) return;
      markComplete("phone");
      setStep("otp");
    } else if (step === "otp") {
      if (otp !== CORRECT_OTP) {
        setOtpError("Invalid code. Please try again.");
        return;
      }
      setOtpError(null);
      markComplete("otp");
      setStep("services");
    } else if (step === "services") {
      if (services.length === 0) return;
      markComplete("services");
      setStep("accounts");
    } else if (step === "accounts") {
      if (accountIds.length === 0) return;
      finish();
    }
  };

  const goBack = () => {
    if (step === "otp") setStep("phone");
    else if (step === "services") setStep(editing ? "services" : "otp");
    else if (step === "accounts") setStep("services");
  };

  const finish = () => {
    if (editing) {
      updateIntegration(editing.id, {
        countryCode,
        phoneNumber: phone,
        services,
        accountIds,
      });
      toast.success("Integration updated");
    } else {
      addIntegration({
        countryCode,
        phoneNumber: phone,
        verifiedAt: new Date().toISOString(),
        services,
        accountIds,
        enabled: true,
      });
      toast.success("WhatsApp connected");
    }
    onOpenChange(false);
  };

  const handleOtpChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 6);
    setOtp(digits);
    if (otpError) setOtpError(null);
    if (digits.length === 6) {
      if (digits === CORRECT_OTP) {
        setOtpError(null);
      } else {
        setOtpError("Invalid code. Please try again.");
      }
    }
  };

  const canContinue =
    (step === "phone" && phoneValid) ||
    (step === "otp" && otp.length === 6 && otp === CORRECT_OTP) ||
    (step === "services" && services.length > 0) ||
    (step === "accounts" && accountIds.length > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl p-0 flex flex-col"
      >
        <SheetHeader className="p-5 border-b border-border space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
              <WhatsAppLogo className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-base">
                {editing ? "Edit WhatsApp connection" : "Connect WhatsApp"}
              </SheetTitle>
              <SheetDescription className="text-xs">
                Receive Anarix alerts on WhatsApp.
              </SheetDescription>
            </div>
          </div>
          <WhatsAppFlowStepper
            current={step}
            completed={completed}
            onJump={editing ? (s) => setStep(s) : undefined}
          />
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-5 space-y-5">
            {step === "phone" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Add your phone number</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    We'll send a 6-digit verification code to confirm the number.
                  </p>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Country</Label>
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Phone number</Label>
                    <Input
                      inputMode="numeric"
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 15))}
                    />
                  </div>
                </div>
                {phone.length > 0 && !phoneValid && (
                  <p className="text-xs text-destructive">Enter 7–15 digits.</p>
                )}
                <WhatsAppPurposeInfo />
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Verify your number</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Enter the 6-digit code sent to {countryCode} {phone}.
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 italic">
                    (Demo: use <span className="font-mono">123456</span>)
                  </p>
                </div>
                <div>
                  <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} className="h-11 w-11" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  {otpError && <p className="text-xs text-destructive mt-2">{otpError}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtp("");
                    setOtpError(null);
                    toast.info("Verification code resent");
                  }}
                  className="text-xs text-primary hover:underline"
                >
                  Resend code
                </button>
              </div>
            )}

            {step === "services" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Choose which services send alerts</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Select one or more. You can change this anytime.
                  </p>
                </div>
                <ServiceSelector selected={services} onChange={setServices} />
              </div>
            )}

            {step === "accounts" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Choose accounts to monitor</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Alerts will only fire for the selected accounts.
                  </p>
                </div>
                <AccountSelector selected={accountIds} onChange={setAccountIds} />
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t border-border p-4 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={step === "phone" ? () => onOpenChange(false) : goBack}
          >
            {step === "phone" ? "Cancel" : "Back"}
          </Button>
          <Button onClick={goNext} disabled={!canContinue}>
            {step === "phone" && "Send code"}
            {step === "otp" && "Verify"}
            {step === "services" && "Continue"}
            {step === "accounts" && (editing ? "Save changes" : "Finish")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default IntegrationWhatsAppFlow;
