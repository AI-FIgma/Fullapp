import { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useTranslation } from '../utils/useTranslation';

interface PetWeightChartProps {
  weightHistory: { date: string; weight: number }[];
}

export function PetWeightChart({ weightHistory }: PetWeightChartProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    // Initial measure
    updateDimensions();

    // Use ResizeObserver for robust updates
    const resizeObserver = new ResizeObserver(() => {
        // Wrap in requestAnimationFrame to avoid "ResizeObserver loop limit exceeded"
        requestAnimationFrame(updateDimensions);
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Prepare chart data
  const weightData = weightHistory?.map(item => ({
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: item.weight,
    fullDate: item.date
  })) || [];

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('pets.weightChart')}</h3>
          <p className="text-xs text-gray-400">
            {weightData.length > 0 
              ? `${t('pets.currentWeight')}: ${weightData[weightData.length - 1].weight} kg`
              : t('pets.noWeightData')
            }
          </p>
        </div>
        <button 
          onClick={() => toast.info(t('pets.editModeComingSoon'))}
          className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {weightData.length > 0 ? (
        <div ref={containerRef} className="h-48 w-full" style={{ minWidth: 0, minHeight: 0 }}>
          {dimensions.width > 0 && dimensions.height > 0 ? (
            <AreaChart 
              width={dimensions.width} 
              height={dimensions.height} 
              data={weightData} 
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#0f766e', fontWeight: 'bold' }}
                labelStyle={{ color: '#6b7280', fontSize: '10px', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#0d9488" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorWeight)" 
              />
            </AreaChart>
          ) : (
            // Placeholder while measuring
             <div className="w-full h-full flex items-center justify-center">
               <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
             </div>
          )}
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
          <p className="text-gray-400 text-sm text-center px-4">{t('pets.addFirstWeight')}</p>
        </div>
      )}
    </div>
  );
}
