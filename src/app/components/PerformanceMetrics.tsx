import React from 'react';

interface PerformanceMetricsProps {
  text: string;
  value: string;
  className?: string;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  text,
  className,
  value,
}) => {
  return (
    <div className="metrics-container flex items-center    bg-surface-card-colored-secondary justify-between lg:flex lg:justify-center lg:gap-22 w-auto lg:w-auto my-[20] px-[20] lg:px-[25] h-[90] lg:h-[95]">
      <div className="metrics-desription text-primary-default text-sm-medium w-[250] lg:w-[150] leading-5">
        {text}
      </div>
      <div className="metrics-value text-3xl-semibold text-primary-default">
        {value}
      </div>
    </div>
  );
};

export default PerformanceMetrics;
