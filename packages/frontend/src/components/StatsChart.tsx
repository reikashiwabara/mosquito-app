import type { FC } from 'react';
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { API_BASE_URL } from '../utils';

// Chart.jsコンポーネントを登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ChartData {
  labels: string[];
  kills: number[];
  deaths: number[];
}

interface StatsChartProps {
  userId: number;
}

type TimePeriod = '1hour' | '3days' | '1week';

export const StatsChart: FC<StatsChartProps> = ({ userId }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1hour');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 期間に応じたデータを取得
  const fetchChartData = async (period: TimePeriod) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/stats/${period}?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('データの取得に失敗しました');
      }

      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('Chart data fetch error:', error);
      // データが取得できない場合は0で初期化
      setChartData(generateEmptyData(period));
      setError('データの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // 空データ生成（すべて0で初期化）
  const generateEmptyData = (period: TimePeriod): ChartData => {
    let labels: string[] = [];
    let dataLength = 0;

    switch (period) {
      case '1hour':
        labels = Array.from({ length: 12 }, (_, i) => `${i * 5}分前`);
        dataLength = 12;
        break;
      case '3days':
        labels = ['3日前', '2日前', '1日前'];
        dataLength = 3;
        break;
      case '1week':
        labels = ['月', '火', '水', '木', '金', '土', '日'];
        dataLength = 7;
        break;
    }

    return { 
      labels, 
      kills: new Array(dataLength).fill(0), 
      deaths: new Array(dataLength).fill(0) 
    };
  };

  // 期間変更時にデータを再取得
  useEffect(() => {
    fetchChartData(selectedPeriod);
  }, [selectedPeriod, userId]);

  // グラフのオプション設定
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#cdd6f4',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: `${getPeriodText(selectedPeriod)}の戦績`,
        color: '#cdd6f4',
        font: {
          size: 14
        }
      },
      tooltip: {
        backgroundColor: '#313244',
        titleColor: '#cdd6f4',
        bodyColor: '#cdd6f4',
        borderColor: '#45475a',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#bac2de',
          font: {
            size: 10
          }
        },
        grid: {
          color: '#45475a'
        }
      },
      y: {
        ticks: {
          color: '#bac2de',
          font: {
            size: 10
          }
        },
        grid: {
          color: '#45475a'
        },
        beginAtZero: true
      }
    }
  };

  // グラフデータの設定
  const getChartData = () => {
    if (!chartData) return null;

    return {
      labels: chartData.labels,
      datasets: [
        {
          label: 'キル数',
          data: chartData.kills,
          backgroundColor: '#a6e3a1',
          borderColor: '#a6e3a1',
          borderWidth: 2,
          tension: 0.4
        },
        {
          label: 'デス数',
          data: chartData.deaths,
          backgroundColor: '#f38ba8',
          borderColor: '#f38ba8',
          borderWidth: 2,
          tension: 0.4
        }
      ]
    };
  };

  // 期間の表示テキスト
  function getPeriodText(period: TimePeriod): string {
    switch (period) {
      case '1hour': return '直近1時間';
      case '3days': return '直近3日';
      case '1week': return '1週間';
      default: return '';
    }
  }

  return (
    <div className="stats-chart">
      {/* 期間切り替えボタン */}
      <div className="chart-controls">
        <button
          className={`period-button ${selectedPeriod === '1hour' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('1hour')}
        >
          直近1時間
        </button>
        <button
          className={`period-button ${selectedPeriod === '3days' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('3days')}
        >
          直近3日
        </button>
        <button
          className={`period-button ${selectedPeriod === '1week' ? 'active' : ''}`}
          onClick={() => setSelectedPeriod('1week')}
        >
        1週間
        </button>
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="chart-error">
          {error}
        </div>
      )}

      {/* グラフエリア */}
      <div className="chart-area">
        {isLoading ? (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <span>データを読み込み中...</span>
          </div>
        ) : chartData ? (
          <div className="chart-container">
            {selectedPeriod === '1hour' ? (
              <Line data={getChartData()!} options={chartOptions} />
            ) : (
              <Bar data={getChartData()!} options={chartOptions} />
            )}
          </div>
        ) : (
          <div className="chart-placeholder">
            データが取得できませんでした
          </div>
        )}
      </div>
    </div>
  );
};
