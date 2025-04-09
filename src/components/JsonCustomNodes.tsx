import React from 'react';

// Time formatter
const formatTime = (timeInMs: number) => {
  if (isNaN(timeInMs) || timeInMs === null) return 'Invalid time';
  
  const seconds = Math.floor(timeInMs / 1000) % 60;
  const minutes = Math.floor(timeInMs / (1000 * 60)) % 60;
  const hours = Math.floor(timeInMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(timeInMs / (1000 * 60 * 60 * 24));
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(' ');
};

// Timestamp formatter
const TimestampNode = ({ value, path, onEdit }: any) => {
  const dateString = new Date(value).toLocaleString();
  
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
        <span style={{ color: 'var(--text-muted)' }}>{value}</span>
        <span style={{ fontWeight: 'bold' }}>{dateString}</span>
      </span>
    </div>
  );
};

// Duration formatter
const DurationNode = ({ value, path, onEdit }: any) => {
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
        <span style={{ color: 'var(--text-muted)' }}>{value}</span>
        <span style={{ fontWeight: 'bold' }}>{formatTime(value)}</span>
      </span>
    </div>
  );
};

// Scientific notation formatter
const ScientificNotationNode = ({ value, path, onEdit }: any) => {
  let formattedValue = value;
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
    condition: (path: string, value: any) => {
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