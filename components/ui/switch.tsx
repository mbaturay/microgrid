import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-ink/20 bg-mist transition-colors data-[state=checked]:bg-jade data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-5" />
  </SwitchPrimitives.Root>
));
Switch.displayName = "Switch";

export { Switch };
