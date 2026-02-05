
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type OTPProps = {
  value: string;
  onChange: (value: string) => void;
};

export function OTP({ value, onChange }: OTPProps) {
  // Different background patterns for each slot
  const getBackgroundPattern = (index: number) => {
    const patterns = [
      "bg-gradient-to-br from-blue-50 to-transparent",
      "bg-gradient-to-br from-green-50 to-transparent",
      "bg-gradient-to-br from-purple-50 to-transparent",
      "bg-gradient-to-br from-orange-50 to-transparent",
      "bg-gradient-to-br from-pink-50 to-transparent",
      "bg-gradient-to-br from-teal-50 to-transparent",
    ];
    return patterns[index % patterns.length];
  };

  // Check if a slot has a value
  const hasValue = (index: number) => {
    return value.length > index;
  };

  return (
    <InputOTP
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
      value={value}
      onChange={onChange}
      containerClassName="gap-3"
    >
      <InputOTPGroup className="gap-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div key={index} className="relative group">
          
            <div className={`
              absolute inset-0 rounded-lg
              ${getBackgroundPattern(index)}
              opacity-50
              group-hover:opacity-70
              transition-opacity duration-300
            `}></div>
            
           
            <div className={`
              absolute inset-0 rounded-lg
              border-2
              ${hasValue(index) 
                ? 'border-blue-300' 
                : 'border-gray-200'
              }
              group-hover:border-blue-400
              transition-colors duration-300
            `}></div>
            
            
            <div className="absolute inset-1 rounded-md bg-white/80 backdrop-blur-sm"></div>
            
            
            <InputOTPSlot 
              index={index} 
              className={`
                relative z-10
                w-12 h-12
                text-2xl font-bold
                rounded-lg
                border-none
                bg-transparent
                ${hasValue(index) 
                  ? 'text-gray-900' 
                  : 'text-gray-400'
                }
                text-center
                transition-all duration-300
                hover:scale-105
                focus:scale-105 focus:outline-none
              `}
            />
          </div>
        ))}
      </InputOTPGroup>
    </InputOTP>
  );
}