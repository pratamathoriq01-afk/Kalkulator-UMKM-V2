'use client';

interface FlexibleInputProps {
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  className?: string;
}

export default function FlexibleInput({ value, onChange, prefix, suffix, placeholder = '0', className = '' }: FlexibleInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    const num = parseFloat(raw);
    onChange(isNaN(num) ? 0 : num);
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {prefix && (
        <span className="absolute left-3 text-[#6B5541] font-bold text-xs pointer-events-none z-10">{prefix}</span>
      )}
      <input
        type="number"
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full bg-white border border-[#E2D9C8] rounded-xl text-xs font-bold text-[#2C1E16] focus:outline-none focus:border-[#3D2B1F] py-2 ${prefix ? 'pl-8 pr-3' : suffix ? 'pl-3 pr-8' : 'px-3'}`}
      />
      {suffix && (
        <span className="absolute right-3 text-[#6B5541] font-bold text-xs pointer-events-none">{suffix}</span>
      )}
    </div>
  );
}
