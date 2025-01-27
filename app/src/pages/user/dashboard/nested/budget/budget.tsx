import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  createBudget, 
  getBudgets, 
  deleteBudget 
} from "./api/budget";
import { PlusCircle, PencilSimple, Check, X } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Budget = () => {
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");
  const [budgets, setBudgets] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editFields, setEditFields] = useState({ tipo: "", valor: "" });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const budgetsData = await getBudgets();
      setBudgets(budgetsData || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await createBudget(tipo, valor);
      if (response.response.ok) {
        toast.success("Budget criada com sucesso!");
        await refreshData();
        setTipo("");
        setValor("");
      } else {
        toast.error("Erro ao criar budget");
      }
    } catch (error) {
      toast.error("Erro ao criar budget");
    }
  };

  const handleDelete = async (budgetId: string) => {
    try {
      await deleteBudget(budgetId);
      toast.success("Budget deletada com sucesso!");
      await refreshData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao deletar budget");
    }
  };

  return (
    <div className="flex min-h-screen flex-col p-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
        Orçamentos
      </h2>

      <div className="space-y-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-4 pb-2.5 shadow-default w-2/3 mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-black">Meus Orçamentos</h3>
            <ScrollArea className="h-80  mb-6">
            <table className="min-w-full border-collapse">
            <thead className="bg-gray-200 sticky top-0">
                  <tr>
                    {["Tipo", "Valor", "Ações"].map(header => (
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
                {budgets.length > 0 ? (
                    budgets.map((bud) => (
                      <tr key={bud._id} className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                        <td className="p-2  text-center">{bud.tipo}</td>
                        <td className="p-2  text-center">R$ {bud.valor}</td>
                        <td className="p-2  text-center">
                          <Button variant="destructive" 
                              className="rounded-md bg-[#b91c1c] px-1 py-1 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#991b1b] focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-1"
                              size="sm" onClick={() => handleDelete(bud._id)}>
                            <X size={16} weight="bold" /> Deletar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        Nenhum orçamento cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>

          <div className="rounded-md border border-stroke bg-white px-8 py-6 shadow-default w-2/3 mx-auto h-[200px]">
          <h3 className="text-xl font-semibold mb-3 text-black">Criar Orçamento</h3>
        <form onSubmit={handleSubmit} className="flex flex-wrap justify-center items-end gap-4">
        <div className="flex flex-col min-w-[120px]">
            <label className="font-semibold text-gray-700 mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
              className="p-2 border rounded w-full"
            >
              <option value="">Selecione</option>
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

          <div className="flex flex-col min-w-[120px]">
            <label className="font-semibold text-gray-700 mb-1">Valor</label>
            <input
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              placeholder="Ex: 250.00"
              className="p-2 border rounded w-full"
            />
          </div>

          <Button type="submit" className="rounded-md bg-[#3c50e0] px-2 py-2 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#324abc] focus:outline-none focus:ring-2 focus:ring-[#3c50e0] focus:ring-offset-1"
          >
            <PlusCircle size={18}
             weight="bold" />
            Criar Orçamento
          </Button>
        </form>
      </div>
    </div>
  </div>
  );
};
