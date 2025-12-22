import React, { useId, useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const CustomInput = forwardRef(
  (
    { label, labelClassName = "", type = "text", className = "", ...props },
    ref
  ) => {
    const id = useId();
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleFocus = (e) => {
      setIsFocused(true);
      if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      if (props.onBlur) props.onBlur(e);
    };

    const handleChange = (e) => {
      setHasValue(!!e.target.value);
      if (props.onChange) props.onChange(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const inputType =
      type === "password" ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full relative group">
        {label && (
          <label
            className={`absolute left-3 px-1 transition-all duration-300 ease-in[cubic-bezier(0.4,0,0.2,1)] pointer-events-none z-1
                        ${
                          isFocused || hasValue
                            ? "top-0 text-xs text-primary-500 bg-white z-10 transform -translate-y-1/2 scale-90 origin-left opacity-100"
                            : "top-1/2 transform -translate-y-1/2 text-gray-500 opacity-80 group-hover:opacity-100"
                        } 
                        ${labelClassName}`}
            htmlFor={id}
          >
            <span className="relative z-10">{label}</span>
            <span
              className={`absolute inset-0 bg-white/80 backdrop-blur-sm rounded-full transition-opacity duration-300 ${
                isFocused || hasValue ? "opacity-0" : "opacity-100"
              }`}
            ></span>
          </label>
        )}

        <div className="relative">
          <input
            type={inputType}
            className={`px-4 py-3 rounded-lg bg-white text-black outline-none focus:ring-2 focus:ring-primary-200/50 focus:border-primary-400 duration-300 border border-gray-300/80 w-full transition-all
                    shadow-sm hover:shadow-md focus:shadow-lg
                    ${className}`}
            ref={ref}
            {...props}
            id={id}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
          />

          {type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
              onClick={togglePasswordVisibility}
              tabIndex="-1" // Prevent button from being tabbed
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        <div
          className={`absolute inset-0 rounded-lg pointer-events-none border-2 border-transparent transition-all duration-300 ${
            isFocused ? "border-primary-300/30" : ""
          }`}
        ></div>
      </div>
    );
  }
);

export default CustomInput;
