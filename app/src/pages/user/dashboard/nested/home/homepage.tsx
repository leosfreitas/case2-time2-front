import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export const Home = () => {
  return (
        <div className="min-h-screen p-7">
              <h1>Olá</h1>
        </div>

  );
};
