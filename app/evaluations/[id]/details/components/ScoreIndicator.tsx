interface ScoreIndicatorProps {
  score: number | null
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function ScoreIndicator({ score, showLabel = true, size = "md" }: ScoreIndicatorProps) {
  if (score === null) return <div className="text-gray-400">Não avaliado</div>

  const getScoreColor = (value: number) => {
    if (value >= 9) return "bg-green-600"
    if (value >= 8) return "bg-green-500"
    if (value >= 7) return "bg-yellow-500"
    if (value >= 6) return "bg-orange-500"
    return "bg-red-500"
  }

  const getScoreLabel = (value: number) => {
    if (value >= 9) return "Excelente"
    if (value >= 8) return "Muito Bom"
    if (value >= 7) return "Bom"
    if (value >= 6) return "Satisfatório"
    return "Precisa Melhorar"
  }

  const sizeClasses = {
    sm: "h-1.5 text-sm",
    md: "h-2 text-base",
    lg: "h-3 text-lg font-bold"
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="w-full max-w-[200px] bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`${getScoreColor(score)} ${sizeClasses[size]}`} 
            style={{ width: `${score * 10}%` }}
          />
        </div>
        <span className={`font-semibold ${size === "lg" ? "text-2xl" : ""}`}>
          {score.toFixed(1)}
        </span>
      </div>
      {showLabel && (
        <span className="text-sm text-gray-600">{getScoreLabel(score)}</span>
      )}
    </div>
  )
} 