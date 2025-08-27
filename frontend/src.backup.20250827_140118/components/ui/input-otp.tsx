import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "flex items-center gap-2 has-disabled:opacity-50",
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        "relative",
        className
      )}
      {...props}
    >
      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="\\d{1}"
        maxLength={1}
        value={char || ""}
        readOnly
        className={cn(
          "h-8 w-6 sm:h-10 sm:w-8 md:h-12 md:w-10 text-center text-sm sm:text-base font-semibold rounded-lg border-2 bg-white/80 backdrop-blur-sm transition-all duration-200",
          "focus:outline-none",
          char ? "border-primary/50 bg-primary/5" : "border-gray-200",
          isActive && "border-primary ring-2 ring-primary/20"
        )}
        aria-label={`Chiffre ${index + 1}`}
      />
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <div className="h-8 w-1 sm:h-10 sm:w-2 md:h-12 md:w-3 flex items-center justify-center">
        <div className="w-0.5 h-3 sm:h-4 md:h-5 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
