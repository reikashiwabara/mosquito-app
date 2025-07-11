import { useState } from 'react';
import type { LogEntry } from '../types';

export const useLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // ログ追加
  const addLog = (message: string) => {
    const newLog: LogEntry = { id: Date.now(), text: message };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  // ログクリア
  const clearLogs = () => {
    setLogs([]);
  };

  return {
    logs,
    addLog,
    clearLogs
  };
};
