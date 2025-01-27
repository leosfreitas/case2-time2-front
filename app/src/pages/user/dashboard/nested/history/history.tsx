import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { getDespesas } from "../finances/api/finances";
import { ScrollArea } from "@/components/ui/scroll-area";

export const History = () => {
  const [despesas, setDespesas] = useState<any[]>([]);
  const [filteredDespesas, setFilteredDespesas] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterDataStart, setFilterDataStart] = useState("");
  const [filterDataEnd, setFilterDataEnd] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    fetchDespesas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [despesas, searchQuery, filterTipo, filterDataStart, filterDataEnd]);

  const fetchDespesas = async () => {
    try {
      const data = await getDespesas();
      setDespesas(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao obter despesas");
    }
  };

  const applyFilters = () => {
    let filtered = [...despesas];

    if (filterTipo) {
      filtered = filtered.filter((desp) => desp.tipo === filterTipo);
    }

    if (filterDataStart) {
      filtered = filtered.filter((desp) => desp.data >= filterDataStart);
    }
    if (filterDataEnd) {
      filtered = filtered.filter((desp) => desp.data <= filterDataEnd);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (desp) =>
          desp.descricao?.toLowerCase().includes(query) ||
          desp.tipo?.toLowerCase().includes(query)
      );
    }

    setFilteredDespesas(filtered);
  };

  return (
    <div className="flex min-h-screen flex-col p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
        Histórico de Transações
        </h2>

        {/* Quadrado de Filtros e Buscas */}
        <div className="rounded-sm border border-stroke bg-white px-5 pt-4 pb-6 shadow-default w-2/3 mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-black">Filtros e Buscas</h3>

          <div className="flex flex-wrap justify-center gap-10 items-end">
            {/* Campo de Busca */}
            <div className="flex flex-col min-w-[200px]">
              <label className="mb-1 font-semibold text-gray-700">Buscar</label>
              <input
                type="text"
                placeholder="Digite para buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            {/* Filtro por Tipo */}
            <div className="flex flex-col min-w-[200px]">
              <label className="mb-1 font-semibold text-gray-700">Filtrar por Tipo</label>
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Todos os Tipos</option>
                <option value="Habitação">Habitação</option>
                <option value="Transporte">Transporte</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Lazer">Lazer</option>
                <option value="Roupas">Roupas</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Assinaturas e Serviços">Assinaturas e Serviços</option>
                <option value="Investimentos">Investimentos</option>
                <option value="Doações">Doações</option>
                <option value="Impostos">Impostos</option>
                <option value="Dívidas">Dívidas</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Filtro de Data Início */}
            <div className="flex flex-col min-w-[150px]">
              <label className="mb-1 font-semibold text-gray-700">Data Início</label>
              <input
                type="date"
                value={filterDataStart}
                onChange={(e) => setFilterDataStart(e.target.value)}
                className="p-2 border rounded"
              />
            </div>

            {/* Filtro de Data Fim */}
            <div className="flex flex-col min-w-[150px]">
              <label className="mb-1 font-semibold text-gray-700">Data Fim</label>
              <input
                type="date"
                value={filterDataEnd}
                onChange={(e) => setFilterDataEnd(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-4 pb-2.5 shadow-default w-2/3 mx-auto mt-8">
        
        <h3 className="text-xl font-semibold mb-3 text-black">Transações</h3>
            <ScrollArea className="h-80  mb-6">
            <table className="min-w-full border-collapse">
            <thead className="bg-gray-200 sticky top-0">
                <tr>
                  {["Tipo", "Valor", "Data", "Descrição"].map((header) => (
                    <th
                      key={header}
                      className="p-2 border font-semibold text-center "
                      >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="border-b border-gray-200">
              {filteredDespesas.length > 0 ? (
                  filteredDespesas.map((desp) => (
                    <tr key={desp._id} className="odd:bg-white even:bg-gray-50">
                      <td className="p-2  text-center">{desp.tipo}</td>
                      <td className="p-2  text-center">R$ {desp.valor}</td>
                      <td className="p-2  text-center">{desp.data}</td>
                      <td className="p-2  text-center">
                        {desp.descricao || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      Nenhuma transação encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      </div>
  );
};