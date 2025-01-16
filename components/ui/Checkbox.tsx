import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Define additional props interface
interface CustomCheckboxProps {
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  checkIconClass?: string;
}

// Combine custom props with original Radix Checkbox props
type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & CustomCheckboxProps;

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, error, helperText, checkIconClass, containerClassName, ...props }, ref) => (
    <div className={cn("flex items-start gap-2", containerClassName)}>
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-white",
          error && "border-red-500",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          <Check className={cn("h-4 w-4", checkIconClass)} />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>

      {(label || helperText || error) && (
        <div className="grid gap-1.5 leading-none">
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {helperText && (
            <p className="text-sm text-gray-500">
              {helperText}
            </p>
          )}
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
)

Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }