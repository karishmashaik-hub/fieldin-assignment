import { RecycleIcon } from "@/components/shared/icons";

export function RvmBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber/40 bg-amber/10 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-amber text-amber">
        <RecycleIcon className="h-4.5 w-4.5" />
      </span>
      <div>
        <h3 className="text-sm font-semibold text-text-primary">Reverse Vending Machines (RVMs)</h3>
        <p className="mt-1 text-xs text-text-primary/70">
          Drop recyclable bottles and cans into a FieldIn RVM at any partner metro or railway station to earn a
          coupon code on the spot. Redeem that code below to add coins to your wallet — real RVM hardware isn't
          wired up in this demo, so the flow is mocked via a fixed code.
        </p>
      </div>
    </div>
  );
}
