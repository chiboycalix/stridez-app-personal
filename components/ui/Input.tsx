import { cn } from "@/lib/utils";
import { ChevronDown, Eye, EyeOff, Search, CalendarIcon, Clock, Calendar1, ArrowUpAzIcon } from "lucide-react";
import { ReactNode, forwardRef, useState, useEffect, useRef } from "react";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./textarea";

type TimeRange = {
  from: string;
  to: string;
};



type Props = {
  icon?: ReactNode;
  label?: ReactNode;
  errorMessage?: string | false;
  onKeyPress?: React.KeyboardEventHandler<HTMLInputElement> & unknown;
  className?: string;
  variant?: "text" | "password" | "search" | "select" | "datePicker" | "dateRangePicker" | "timeRangePicker" | "textarea";
  options?: { label: any; value: any }[];
  onSelect?: (value: string) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  leftIconClassName?: string;
  rightIconClassName?: string;
  onLeftIconClick?: () => void;
  onRightIconClick?: () => void;
  dropdownClass?: string;
  dropdownItemClass?: string;
  selectTextClass?: string;
  onDateSelect?: (date: Date | undefined) => void;
  onDateRangeSelect?: (range: DateRange | undefined) => void;
  selectedDate?: Date;
  selectedDateRange?: DateRange;
  numberOfMonths?: number;
  onTimeRangeSelect?: (range: TimeRange | undefined) => void;
  selectedTimeRange?: TimeRange;
  rows?: number;
  maxRows?: number;
  minRows?: number;
  resize?: "none" | "vertical" | "horizontal" | "both";
} & React.ComponentProps<'input'> & React.ComponentProps<'textarea'>;

const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour % 12 || 12;
      const period = hour < 12 ? 'AM' : 'PM';
      const formattedMinute = minute.toString().padStart(2, '0');
      times.push(`${formattedHour}:${formattedMinute}${period}`);
    }
  }
  return times;
};


const Input = forwardRef<HTMLInputElement, Props>(({
  label,
  errorMessage,
  className,
  variant = "text",
  value,
  options = [],
  onSelect,
  leftIcon,
  rightIcon,
  leftIconClassName,
  rightIconClassName,
  onLeftIconClick,
  onRightIconClick,
  dropdownClass,
  dropdownItemClass,
  selectTextClass,
  onChange,
  onDateSelect,
  selectedDate,
  onDateRangeSelect,
  selectedDateRange,
  numberOfMonths = 2,
  onTimeRangeSelect,
  selectedTimeRange,
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(selectedDateRange || {
    from: undefined,
    to: undefined
  });
  const [timeRange, setTimeRange] = useState<TimeRange>(
    selectedTimeRange || { from: '', to: '' }
  );

  const [isSelectingTo, setIsSelectingTo] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timeOptions = generateTimeOptions();

  const handleTimeClick = (time: string) => {
    if (!isSelectingTo) {
      setTimeRange({ from: time, to: '' });
      setIsSelectingTo(true);
    } else {
      const fromIndex = timeOptions.indexOf(timeRange.from);
      const toIndex = timeOptions.indexOf(time);

      if (toIndex > fromIndex) {
        const newRange = { from: timeRange.from, to: time };
        setTimeRange(newRange);
        onTimeRangeSelect?.(newRange);
        setIsOpen(false);
        setIsSelectingTo(false);
      }
    }
  };


  const renderIcon = (icon: any, className?: string, onClick?: () => void) => {
    if (!icon) return null;

    return (
      <div
        className={cn(
          "absolute inset-y-0 flex items-center",
          onClick && "cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        {icon}
      </div>
    );
  };

  const renderInput = (additionalClassNames?: string) => {
    const hasLeftIcon = leftIcon || (variant === 'password' && false) || (variant === 'search' && false);
    const hasRightIcon = rightIcon || (variant === 'password' && true) || (variant === 'search' && true);

    return (
      <div className="relative">
        {renderIcon(
          leftIcon,
          cn("left-0 pl-3", leftIconClassName),
          onLeftIconClick
        )}
        <input
          ref={ref}
          value={value}
          onChange={onChange}
          {...rest}
          type={variant === 'password' ? (showPassword ? 'text' : 'password') : rest.type}
          className={cn(
            "outline-none focus:ring-0 ring-primary-700 border-primary-200 border-2 rounded py-3 text-gray-800 text-sm text-wrap w-full disabled:cursor-not-allowed placeholder:text-gray-400 placeholder:normal-case",
            hasLeftIcon ? "pl-10" : "pl-3",
            hasRightIcon ? "pr-10" : "pr-3",
            errorMessage ? "bg-red-100" : "bg-gray-100",
            additionalClassNames,
            className
          )}
        />
        {renderIcon(
          rightIcon || (variant === 'password' ? (
            showPassword ? (
              <EyeOff
                className="h-5 w-5 text-gray-400"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                className="h-5 w-5 text-gray-400"
                onClick={() => setShowPassword(true)}
              />
            )
          ) : variant === 'search' ? (
            <Search className="h-5 w-5 text-gray-400" />
          ) : null),
          cn("right-0 pr-3", rightIconClassName),
          onRightIconClick || (variant === 'password' ? () => setShowPassword(!showPassword) : undefined)
        )}
      </div>
    );
  };

  const variants = {
    text: (
      <div className="leading-3">
        {label && (
          <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
            {label}
          </label>
        )}
        {renderInput()}
        {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
      </div>
    ),

    search: (
      <div className="leading-3 w-full">
        {label && (
          <label className="flex items-center text-gray-500 font-medium text-sm gap-x-2 mb-1">
            {label}
          </label>
        )}
        {renderInput("border-0 rounded-xl")}
        {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
      </div>
    ),

    password: (
      <div className="leading-3">
        {label && (
          <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
            {label}
          </label>
        )}
        {renderInput()}
        {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
      </div>
    ),

    select: (
      <div className="relative" ref={dropdownRef}>
        {label && (
          <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative cursor-pointer bg-gray-100 rounded border-2 border-primary-200",
            className
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="relative">
            <div className={cn(
              "flex items-center justify-between w-full py-3",
              leftIcon ? "pl-10" : "pl-3",
              "pr-3"
            )}>
              {renderIcon(leftIcon, cn("left-0 pl-3", leftIconClassName))}
              <span className={cn("text-gray-600 text-sm", selectTextClass)}>
                {selectedLabel || "Select option"}
              </span>
              <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
            </div>
            {isOpen && (
              <div className={cn(
                "absolute w-full top-full left-0 right-0 mt-2 bg-white border border-primary-200 rounded-lg shadow-lg z-50",
                dropdownClass
              )}>
                {options.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm",
                      value === option.value && "bg-primary-50",
                      dropdownItemClass
                    )}
                    onClick={() => {
                      setSelectedLabel(option.label);
                      onSelect?.(option.value);
                      onChange?.({ target: { value: option.value } } as any);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
      </div>
    ),

    datePicker: (
      <div className="leading-3">
        {label && (
          <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
            {label}
          </label>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <div className={cn(
              "relative cursor-pointer bg-gray-100 rounded border-2 border-primary-200 py-3",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              errorMessage && "bg-red-100",
              className
            )}>
              <div className="flex items-center justify-between">
                {renderIcon(leftIcon || null, "left-0 pl-3")}
                <span className={cn("text-sm flex-1", !date && "text-gray-400")}>
                  {date ? format(date, "PPP") : "Pick a date"}
                </span>
                {renderIcon(rightIcon, "right-0 pr-3")}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                onDateSelect?.(newDate);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
      </div>
    ),

    dateRangePicker: (
      <div className="leading-3">
        {label && (
          <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
            {label}
          </label>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <div className={cn(
              "relative cursor-pointer bg-gray-100 rounded border-2 border-primary-200 py-3",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              errorMessage && "bg-red-100",
              className
            )}>
              <div className="flex items-center justify-between">
                {renderIcon(leftIcon || <CalendarIcon className="w-5 h-5 text-gray-500" />, "left-0 pl-3")}
                <span className={cn(
                  "text-sm flex-1",
                  !dateRange?.from && "text-gray-400"
                )}>
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Select date range"
                  )}
                </span>
                {renderIcon(rightIcon, "right-0 pr-3")}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(newDateRange) => {
                setDateRange(newDateRange);
                onDateRangeSelect?.(newDateRange);
              }}
              numberOfMonths={numberOfMonths}
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
        {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
      </div>
    ),

    timeRangePicker: (
      <div className="leading-3">
        {label && (
          <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
            {label}
          </label>
        )}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className={cn(
              "relative cursor-pointer bg-gray-100 rounded border-2 border-primary-200 py-3",
              leftIcon ? "pl-10" : "pl-3",
              rightIcon ? "pr-10" : "pr-3",
              errorMessage && "bg-red-100",
              className
            )}>
              <div className="flex items-center justify-between">
                {leftIcon || <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />}
                <span className={cn(
                  "text-sm flex-1",
                  !timeRange.from && "text-gray-400"
                )}>
                  {timeRange.from ? (
                    timeRange.to ? (
                      <span className="flex items-center">
                        <span className="basis-1/2">
                          {timeRange.from}
                        </span>
                        <span className="flex-1 flex items-center gap-2">
                          <ArrowUpAzIcon />
                          <span>{timeRange.to}</span>
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="basis-1/2">
                          {timeRange.from}
                        </span>
                        <span className="flex-1 flex items-center gap-2">
                          <ArrowUpAzIcon />
                          <span>Select end time</span>
                        </span>
                      </span>
                    )
                  ) : (
                    <span className="flex items-center">
                      <span className="basis-1/2">Start time</span>
                      <span className="flex-1 flex items-center gap-2">
                        <ArrowUpAzIcon />
                        <span>End time</span>
                      </span>
                    </span>
                  )}
                </span>
                {rightIcon}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <div className="max-h-60 overflow-y-auto">
              <div className="p-2 bg-primary-50 text-sm font-medium text-gray-600 sticky top-0">
                {!isSelectingTo ? "Select start time" : "Select end time"}
              </div>
              {timeOptions.map((time, index) => {
                const isDisabled = isSelectingTo &&
                  timeOptions.indexOf(time) <= timeOptions.indexOf(timeRange.from);

                return (
                  <div
                    key={time}
                    className={cn(
                      "px-4 py-2 text-sm cursor-pointer",
                      isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-gray-50",
                      timeRange.from === time && "bg-primary-50 text-primary-700",
                      timeRange.to === time && "bg-primary-100 text-primary-700"
                    )}
                    onClick={() => !isDisabled && handleTimeClick(time)}
                  >
                    {time}
                  </div>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>
        {errorMessage && <small className="text-red-600 text-sm">{errorMessage}</small>}
      </div>
    ),

    textarea: (
      <div className="leading-3">
        {label && (
          <label className="flex items-center text-gray-900 font-medium text-sm gap-x-2 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {renderIcon(
            leftIcon,
            cn("left-0 top-3 pl-3", leftIconClassName),
            onLeftIconClick
          )}
          <Textarea
            {...rest}
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-primary-200 bg-white px-3 py-2 text-base",
              "placeholder:text-neutral-500 focus-visible:outline-none outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "md:text-sm outline-none focus:ring-0 ring-primary-700 border-primary-200 border-2",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              errorMessage && "border-red-500 focus-visible:ring-red-500",
              className
            )}
          />
          {renderIcon(
            rightIcon,
            cn("right-0 top-3 pr-3", rightIconClassName),
            onRightIconClick
          )}
        </div>
        {errorMessage && <small className="text-red-600 text-sm mt-1">{errorMessage}</small>}
      </div>
    ),

  };

  return variants[variant] || variants.text;
});

Input.displayName = "Input";
export default Input;