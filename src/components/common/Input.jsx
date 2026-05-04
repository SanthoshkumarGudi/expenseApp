import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Mail, Lock } from 'lucide-react'; // example icons

export const Input = forwardRef((props, ref) => {
  const { label, error, icon: Icon, id, className, ...rest } = props;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:focus:ring-blue-800',
            Icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-200',
            className
          )}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
});