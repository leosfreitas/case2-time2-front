import React, { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Chart, registerables } from 'chart.js';
import { getGraphic1, getGraphic2, getGraphic3, getGraphic4 } from './api/home';

Chart.register(...registerables);

export const Home = () => {
  const chartRef1 = useRef<HTMLCanvasElement>(null);
  const chartRef2 = useRef<HTMLCanvasElement>(null);
  const chartRef3 = useRef<HTMLCanvasElement>(null);
  const chartRef4 = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    async function fetchAndRenderCharts() {
      try {
        let data1 = await getGraphic1();
        if (chartRef1.current) {
          new Chart(chartRef1.current, {
            type: 'bar',
            data: {
              labels: Object.keys(data1.dados),
              datasets: [
                {
                  label: 'Despesas',
                  data: Object.values(data1.dados),
                  backgroundColor: '#3c50e0',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Despesas por Categoria' },
              },
            },
          });
        }

        let data2 = await getGraphic2();
        if (chartRef2.current) {
          new Chart(chartRef2.current, {
            type: 'bar',
            data: {
              labels: Object.keys(data2.dados),
              datasets: [
                {
                  label: 'Receita',
                  data: Object.values(data2.dados),
                  backgroundColor: [
                    'rgba(255, 99, 132)',
                    '#3c50e0',
                  ],
                },
              ],
            },
            options: {
              responsive: true,
              indexAxis: 'y', 
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Despesa X Receita Total' },
              },
              scales: {
                x: { beginAtZero: true },
              },
            },
          });
        }

        let data3 = await getGraphic3();
        if (chartRef3.current) {
          new Chart(chartRef3.current, {
            type: 'line',
            data: {
              labels: Object.keys(data3.dados),
              datasets: [
                {
                  label: 'Receita - Despesa',
                  data: Object.values(data3.dados),
                  borderColor: '#3c50e0',
                  backgroundColor: '#3c50e0',
                  borderWidth: 2,
                  tension: 0.4,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Saldo Mensal (Receita - Despesa)' },
              },
            },
          });
        }

        let data4 = await getGraphic4();
        if (chartRef4.current) {
          const labels = Object.keys(data4.dados)
            .map((key) => key.split('_')[1])
            .filter((value, index, self) => self.indexOf(value) === index);

          const orcamento = labels.map(
            (label) => data4.dados[`orcamento_${label}`] || 0
          );
          const despesas = labels.map(
            (label) => data4.dados[`despesas_${label}`] || 0
          );

          new Chart(chartRef4.current, {
            type: 'bar',
            data: {
              labels,
              datasets: [
                {
                  label: 'Orçamento',
                  data: orcamento,
                  backgroundColor: '#3c50e0',
                },
                {
                  label: 'Despesas',
                  data: despesas,
                  backgroundColor: 'rgba(255, 99, 132)',
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Orçamento x Despesa por Categoria' },
              },
              scales: {
                x: { stacked: true },
                y: { stacked: true },
              },
            },
          });
        }
      } catch (error) {
        toast.error('Erro ao carregar gráficos');
        console.error(error);
      }
    }

    fetchAndRenderCharts();
  }, []);

  return (
        <div className="min-h-screen p-7">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            Visualização de Dados
        </h2>
        <div className="rounded-lg border bg-white shadow-md p-2 w-5/6 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-0 gap-x-3">
            <div className="aspect-[16/9]">
                <canvas ref={chartRef1}></canvas>
            </div>
            <div className="aspect-[16/9]">
                <canvas ref={chartRef2}></canvas>
            </div>
            <div className="aspect-[16/9]">
                <canvas ref={chartRef3}></canvas>
            </div>
            <div className="aspect-[16/9]">
                <canvas ref={chartRef4}></canvas>
            </div>
            </div>
        </div>
        </div>

  );
};
