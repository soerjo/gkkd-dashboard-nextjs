import { useEffect } from 'react';
import { Area, AreaChart, Bar, BarChart, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { randomIntFromInterval } from '@/lib/random-number'

const data = [
  {
    name: 'Jan',
    sundah_service: randomIntFromInterval(80, 100),
    blesscomn: randomIntFromInterval(80, 100),
    disciple: randomIntFromInterval(80, 100),
  },
  {
    name: 'Feb',
    sundah_service: randomIntFromInterval(80, 100),
    blesscomn: randomIntFromInterval(80, 100),
    disciple: randomIntFromInterval(80, 100),
  },
  {
    name: 'Mar',
    sundah_service: randomIntFromInterval(80, 100),
    blesscomn: randomIntFromInterval(80, 100),
    disciple: randomIntFromInterval(80, 100),
  },
  {
    name: 'Apr',
    sundah_service: randomIntFromInterval(80, 100),
    blesscomn: randomIntFromInterval(80, 100),
    disciple: randomIntFromInterval(80, 100),
  },
  {
    name: 'May',
    sundah_service: randomIntFromInterval(80, 100),
    blesscomn: randomIntFromInterval(80, 100),
    disciple: randomIntFromInterval(80, 100),
  },
  {
    name: 'Jun',
    sundah_service: randomIntFromInterval(80, 100),
    blesscomn: randomIntFromInterval(80, 100),
    disciple: randomIntFromInterval(80, 100),
  },
  {
    name: 'Jul',
    sundah_service: randomIntFromInterval(80, 100),
    blesscomn: randomIntFromInterval(80, 100),
    disciple: randomIntFromInterval(80, 100),
  },
  {
    name: 'Aug',
    sundah_service: randomIntFromInterval(80, 100),
    blesscomn: randomIntFromInterval(80, 100),
    disciple: randomIntFromInterval(80, 100),
  },
  // {
  //   name: 'Sep',
  //   sundah_service: randomIntFromInterval(80, 100),
  //   blesscomn: randomIntFromInterval(80, 100),
  //   disciple: randomIntFromInterval(80, 100),
  // },
  // {
  //   name: 'Oct',
  //   sundah_service: randomIntFromInterval(80, 100),
  //   blesscomn: randomIntFromInterval(80, 100),
  //   disciple: randomIntFromInterval(80, 100),
  // },
  // {
  //   name: 'Nov',
  //   sundah_service: randomIntFromInterval(80, 100),
  //   blesscomn: randomIntFromInterval(80, 100),
  //   disciple: randomIntFromInterval(80, 100),
  // },
  // {
  //   name: 'Dec',
  //   sundah_service: randomIntFromInterval(80, 100),
  //   blesscomn: randomIntFromInterval(80, 100),
  //   disciple: randomIntFromInterval(80, 100),
  // },
]

export function LineChartComp() {
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && /defaultProps/.test(args[0])) {
        return;
      }
      originalConsoleError(...args);
    };
    return () => {
      console.error = originalConsoleError;
    };
  }, []);
  return (
    <ResponsiveContainer width='100%' height={350}>
      <AreaChart data={data} >
        <defs>
          <linearGradient id="disciple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FB8500" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FB8500" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sundah_service" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="blesscomn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={true}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={true}
          domain={[60, 105]}
          tickFormatter={(value: any) => `${value}`}
        />
        <Tooltip />
        <Area type="linear" dataKey="sundah_service" stroke="#8884d8" fillOpacity={1} fill="url(#sundah_service)" />
        <Area type="linear" dataKey="blesscomn" stroke="#82ca9d" fillOpacity={1} fill="url(#blesscomn)" />
        <Area type="linear" dataKey="disciple" stroke="#FB8500" fillOpacity={1} fill="url(#disciple)" />

      </AreaChart>
    </ResponsiveContainer>
  )
}
