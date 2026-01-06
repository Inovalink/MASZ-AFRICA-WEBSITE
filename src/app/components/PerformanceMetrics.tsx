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
    <div className="metrics-container flex items-center ml-5   bg-surface-card-colored-secondary  justify-between w-[91%] my-[20] px-[20] h-[90]">
      <div className="metrics-desription text-primary-default text-sm-medium w-[250] leading-5">
        {text}
      </div>
      <div className="metrics-value text-3xl-semibold text-primary-default">{value}</div>
    </div>
  );
};

export default PerformanceMetrics;
