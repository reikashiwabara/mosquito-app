import type { FC } from 'react';
import type { LogEntry } from '../types';

interface LogAreaProps {
  logs: LogEntry[];
}

export const LogArea: FC<LogAreaProps> = ({ logs }) => {
  return (
    <div className="log-area">
      {logs.map((log) => (
        <div key={log.id} className="log-entry">
          {log.text}
        </div>
      ))}
    </div>
  );
};
