'use client';

import { useState, useEffect } from 'react';

interface FlexibleInputProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  className?: string;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
}

function formatIDRValue(val: number | undefined | null): string {
  if (val === undefined || val === null) return '';
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/\./g, '').replace(/,/g, '.'));
  if (isNaN(num) || num === 0) return '';
  if (Number.isInteger(num)) {
    return new Intl.NumberFormat('id-ID').format(num);
  }
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(num);
}

export default function FlexibleInput({
  value,
  onChange,
  className = '',
  prefix,
  suffix,
  placeholder,
  allowDecimal = false,
  min,
  max,
}: FlexibleInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localVal, setLocalVal] = useState(() => formatIDRValue(value));

  useEffect(() => {
    if (!isFocused) {
      setLocalVal(value === 0 || value === undefined || value === null ? '' : formatIDRValue(value));
    }
  }, [value, isFocused]);

  const handleBlur = () => {
    setIsFocused(false);
    if (!localVal) {
      onChange(min ?? 0);
      setLocalVal('');
      return;
    }
    const cleanDigits = allowDecimal
      ? localVal.replace(/[^0-9,/.]/g, '').replace(/,/g, '.')
      : localVal.replace(/\D/g, '');
    let parsed = parseFloat(cleanDigits) || 0;
    if (min !== undefined) parsed = Math.max(min, parsed);
    if (max !== undefined) parsed = Math.min(max, parsed);
    onChange(parsed);
    setLocalVal(parsed === 0 ? '' : formatIDRValue(parsed));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputStr = e.target.value;

    if (!inputStr) {
      setLocalVal('');
      onChange(0);
      return;
    }

    if (allowDecimal && (inputStr.includes(',') || inputStr.includes('.'))) {
      const cleanDecimal = inputStr.replace(/[^0-9,/.]/g, '').replace(/\./g, ',');
      setLocalVal(cleanDecimal);
      const parsed = parseFloat(cleanDecimal.replace(/,/g, '.')) || 0;
      onChange(parsed);
    } else {
      const digitsOnly = inputStr.replace(/\D/g, '');
      if (!digitsOnly) {
        setLocalVal('');
        onChange(0);
        return;
      }
      const numVal = parseInt(digitsOnly, 10);
      const formatted = new Intl.NumberFormat('id-ID').format(numVal);
      setLocalVal(formatted);
      onChange(numVal);
    }
  };

  return (
    <div className="relative w-full">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#45464d] pointer-events-none z-10 select-none">
          {prefix}
        </span>
      )}
      <input
        type="text"
        inputMode={allowDecimal ? 'decimal' : 'numeric'}
        value={localVal}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        placeholder={placeholder || '0'}
        className={`w-full bg-white border border-[#e0e3e5] rounded-xl text-xs font-bold text-[#191c1e] focus:outline-none focus:border-[#4648d4] focus:ring-1 focus:ring-[#4648d4]/20 py-2.5 font-mono transition-colors ${
          prefix ? 'pl-8' : 'pl-3'
        } ${suffix ? 'pr-8' : 'pr-3'} ${className}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#45464d] pointer-events-none select-none">
          {suffix}
        </span>
      )}
    </div>
  );
}
