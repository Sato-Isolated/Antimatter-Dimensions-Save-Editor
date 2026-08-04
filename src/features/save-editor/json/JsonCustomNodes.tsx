
// Time formatter
interface CustomNodeProps {
  value: unknown;
  onEdit: () => void;
}

const numericValue = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim()) return Number(value);
  return Number.NaN;
};

const formatTime = (timeInMs: unknown) => {
  const numericTime = numericValue(timeInMs);
  if (Number.isNaN(numericTime)) return 'Invalid time';
  
  const seconds = Math.floor(numericTime / 1000) % 60;
  const minutes = Math.floor(numericTime / (1000 * 60)) % 60;
  const hours = Math.floor(numericTime / (1000 * 60 * 60)) % 24;
  const days = Math.floor(numericTime / (1000 * 60 * 60 * 24));
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(' ');
};

// Timestamp formatter
const TimestampNode = ({ value, onEdit }: CustomNodeProps) => {
  const dateInput = value instanceof Date || typeof value === 'string' || typeof value === 'number' ? value : NaN;
  const dateString = new Date(dateInput).toLocaleString();
  
  return (
    <div className="custom-timestamp-node">
      <span
        title="Click to edit raw timestamp value"
        onClick={() => onEdit()}
        style={{ 
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>{String(value)}</span>
        <span style={{ fontWeight: 'bold' }}>{dateString}</span>
      </span>
    </div>
  );
};

// Duration formatter
const DurationNode = ({ value, onEdit }: CustomNodeProps) => {
  return (
    <div className="custom-duration-node">
      <span
        title="Click to edit raw duration value"
        onClick={() => onEdit()}
        style={{ 
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>{String(value)}</span>
        <span style={{ fontWeight: 'bold' }}>{formatTime(value)}</span>
      </span>
    </div>
  );
};

// Scientific notation formatter
const ScientificNotationNode = ({ value, onEdit }: CustomNodeProps) => {
  let formattedValue = typeof value === 'string' || typeof value === 'number' ? value : String(value);
  if (typeof value === 'number' && Math.abs(value) >= 1000) {
    formattedValue = value.toExponential(2);
  }
  
  return (
    <div className="custom-scientific-node">
      <span
        title="Click to edit raw value"
        onClick={() => onEdit()}
        style={{ 
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ fontWeight: 'bold' }}>{formattedValue}</span>
      </span>
    </div>
  );
};

// JSON Custom Nodes export
export const customNodes = [
  {
    // Timestamp fields in the save structure
    condition: (path: string) => {
      return (
        path.endsWith('.lastUpdate') || 
        path.endsWith('.lastAutoReset') || 
        path.endsWith('.realityTime') ||
        path.endsWith('.eternityTime') ||
        path.endsWith('.lastExport')
      ) && !path.includes('.duration');
    },
    component: TimestampNode
  },
  {
    // Duration fields in the save structure
    condition: (path: string) => {
      return (
        path.includes('.duration') || 
        path.endsWith('.timePlayed') || 
        path.endsWith('.realTimePlayed')
      );
    },
    component: DurationNode
  },
  {
    // Big numbers in the save
    condition: (path: string, value: unknown) => {
      return (
        typeof value === 'number' && 
        (Math.abs(value) >= 1000 || Math.abs(value) <= 0.001) &&
        !path.includes('.time') && 
        !path.includes('.duration')
      );
    },
    component: ScientificNotationNode
  }
];

export default customNodes; 
