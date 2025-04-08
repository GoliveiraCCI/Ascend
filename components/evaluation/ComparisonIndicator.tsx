interface ComparisonIndicatorProps {
  selfScore: number | null;
  managerScore: number | null;
}

const ComparisonIndicator = ({ selfScore, managerScore }: ComparisonIndicatorProps) => {
  if (selfScore === null || managerScore === null) {
    return <span className="text-gray-400">-</span>;
  }

  const difference = managerScore - selfScore;
  const absDifference = Math.abs(difference);

  if (difference === 0) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-gray-500">=</span>
        <span className="text-gray-500">0.0</span>
      </div>
    );
  }

  if (difference > 0) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-green-500">↑</span>
        <span className="text-green-500">+{absDifference.toFixed(1)}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <span className="text-red-500">↓</span>
      <span className="text-red-500">-{absDifference.toFixed(1)}</span>
    </div>
  );
};

export default ComparisonIndicator; 