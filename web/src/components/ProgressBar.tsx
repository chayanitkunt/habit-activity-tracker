export const ProgressBar = ({ percent }: { percent: number }) => <div className="progress" aria-label="Goal progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
  <span className="progress-value">{percent.toFixed(1)}%</span>
  <span className="progress-track"><span className={percent >= 100 ? 'progress-fill done' : 'progress-fill'} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} /></span>
</div>;
