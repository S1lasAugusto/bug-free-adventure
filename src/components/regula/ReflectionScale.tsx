import React from "react";
import { RadioGroup } from "@headlessui/react";

interface ReflectionScaleProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

export function ReflectionScale({
  value,
  onChange,
  label,
}: ReflectionScaleProps) {
  const options = [0, 1, 2, 3, 4, 5];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <RadioGroup value={value} onChange={onChange} className="flex space-x-4">
        {options.map((option) => (
          <RadioGroup.Option
            key={option}
            value={option}
            className={({ checked }) =>
              `${
                checked
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 hover:bg-gray-50"
              } relative flex cursor-pointer rounded-lg px-3 py-2 shadow-md focus:outline-none`
            }
          >
            {({ checked }) => (
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="text-sm">
                    <RadioGroup.Label
                      as="p"
                      className={`font-medium ${
                        checked ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {option}
                    </RadioGroup.Label>
                  </div>
                </div>
              </div>
            )}
          </RadioGroup.Option>
        ))}
      </RadioGroup>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Strongly disagree</span>
        <span>Strongly agree</span>
      </div>
    </div>
  );
}
