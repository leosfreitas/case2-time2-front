import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { 
  createFinance, 
  getDespesas, 
  getReceitas, 
  deleteFinance, 
  editFinance 
} from "./api/finances";
import { PlusCircle, PencilSimple, Check, X } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Finances = () => {
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");

  const [despesas, setDespesas] = useState<any[]>([]);
  const [receitas, setReceitas] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editFields, setEditFields] = useState({
    categoria: "",
    tipo: "",
    valor: "",
    data: "",
    descricao: "",
  });

  const receitaOptions = [
    "Salário",
    "Bonificações",
    "Comissões",
    "Dividendos",
    "Juros",
    "Rendimentos",
    "Freelance",
    "Lucro de Vendas",
    "Aposentadoria",
    "Pensão",
    "Investimentos"
  ];

  const despesaOptions = [
    "Habitação",
    "Transporte",
    "Alimentação",
    "Saúde",
    "Educação",
    "Lazer",
    "Roupas",
    "Tecnologia",
    "Assinaturas e Serviços",
    "Investimentos",
    "Doações",
    "Impostos",
    "Dívidas",
    "Outros"
  ];

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const despesasData = await getDespesas();
      setDespesas(despesasData || []);
      const receitasData = await getReceitas();
      setReceitas(receitasData || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await createFinance(categoria, tipo, valor, data, descricao);
      if (response.response.ok) {
        toast.success("Finance criada com sucesso!");
        await refreshData();
        setTipo("");
        setValor("");
        setData("");
        setDescricao("");
      } else {
        toast.error("Erro ao criar finance");
      }
    } catch (error) {
      toast.error("Erro ao criar finance");
    }
  };

  const handleDelete = async (financeId: string) => {
    try {
      await deleteFinance(financeId);
      toast.success("Finance deletada com sucesso!");
      await refreshData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao deletar finance");
    }
  };

  const handleEdit = (finance: any) => {
    setEditing(finance._id);
    setEditFields({
      categoria: finance.categoria,
      tipo: finance.tipo,
      valor: finance.valor,
      data: finance.data,
      descricao: finance.descricao || "",
    });
  };

  const handleEditCancel = () => {
    setEditing(null);
    setEditFields({ categoria: "", tipo: "", valor: "", data: "", descricao: "" });
  };

  const handleEditSave = async () => {
    try {
      await editFinance(
        editing!, 
        editFields.categoria, 
        editFields.tipo, 
        editFields.valor, 
        editFields.data, 
        editFields.descricao
      );
      toast.success("Finance editada com sucesso!");
      setEditing(null);
      await refreshData();
    } catch (err: any) {
      toast.error(err.message || "Erro ao editar finance");
    }
  };

  const handleEditChange = (field: string, value: string) => {
    setEditFields({ ...editFields, [field]: value });
  };

  return (
    <div className="flex min-h-screen flex-col p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Despesas e Receitas
      </h2>
      <div className="space-y-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-4 pb-2.5 shadow-default w-2/3 mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-black">Minhas Despesas</h3>
          <ScrollArea className="h-80  mb-6">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  {["Tipo", "Valor", "Data", "Descrição", "Ações"].map(header => (
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
                {despesas.length > 0 ? (
                  despesas.map((desp) => (
                    <tr key={desp._id} className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                      <td className="p-2  text-center">
                        {editing === desp._id ? (
                          <input 
                            className="w-full p-1 border rounded text-center"
                            value={editFields.tipo}
                            onChange={(e) => handleEditChange("tipo", e.target.value)}
                          />
                        ) : (
                          desp.tipo
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {editing === desp._id ? (
                          <input 
                            className="w-full p-1 border rounded text-center"
                            value={editFields.valor}
                            onChange={(e) => handleEditChange("valor", e.target.value)}
                          />
                        ) : (
                          `R$ ${desp.valor}`
                        )}
                      </td>
                      <td className="p-2  text-center">
                        {editing === desp._id ? (
                          <input 
                            type="date"
                            className="w-full p-1 border rounded text-center"
                            value={editFields.data}
                            onChange={(e) => handleEditChange("data", e.target.value)}
                          />
                        ) : (
                          desp.data
                        )}
                      </td>
                      <td className="p-2  text-center">
                        {editing === desp._id ? (
                          <input 
                            className="w-full p-1 border rounded text-center"
                            value={editFields.descricao}
                            onChange={(e) => handleEditChange("descricao", e.target.value)}
                          />
                        ) : (
                          desp.descricao || "-"
                        )}
                      </td>
                      <td className="p-2  flex gap-2 justify-center">
                        {editing === desp._id ? (
                          <>
                            <Button variant="secondary" size="sm" 
                              className="rounded-md bg-[#b91c1c] px-1 py-1 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#991b1b] focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-1"
                              onClick={handleEditCancel}>
                              <X size={16} weight="bold" /> Cancelar
                            </Button>
                            <Button variant="default" 
                              className="rounded-md bg-[#3c50e0] px-2 py-1 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#324abc] focus:outline-none focus:ring-2 focus:ring-[#3c50e0] focus:ring-offset-1"
                              size="sm" onClick={handleEditSave}>
                              <Check size={16} weight="bold" /> Salvar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="destructive" 
                              className="rounded-md bg-[#b91c1c] px-1 py-1 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#991b1b] focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-1"
                              size="sm" onClick={() => handleDelete(desp._id)}>
                              <X size={16} weight="bold" /> Deletar
                            </Button>
                            <Button variant="default" 
                              className="rounded-md bg-[#3c50e0] px-2 py-1 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#324abc] focus:outline-none focus:ring-2 focus:ring-[#3c50e0] focus:ring-offset-1"
                              size="sm" onClick={() => handleEdit(desp)}>
                              <PencilSimple size={16} weight="bold" /> Editar
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Nenhuma despesa cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        </div>

        <div className="rounded-sm border border-stroke bg-white px-5 pt-4 pb-2.5 shadow-default w-2/3 mx-auto">
          <h3 className="text-xl font-semibold mb-3 text-black">Minhas Receitas</h3>
          <ScrollArea className="h-80  mb-6">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-200 sticky top-0">
                <tr>
                  {["Tipo", "Valor", "Data", "Descrição", "Ações"].map(header => (
                    <th 
                      key={header} 
                      className="p-2  font-semibold text-center"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="border-b border-gray-200">
                {receitas.length > 0 ? (
                  receitas.map((rec) => (
                    <tr key={rec._id} className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                      <td className="p-2  text-center">
                        {editing === rec._id ? (
                          <input 
                            className="w-full p-1 border rounded text-center"
                            value={editFields.tipo}
                            onChange={(e) => handleEditChange("tipo", e.target.value)}
                          />
                        ) : (
                          rec.tipo
                        )}
                      </td>
                      <td className="p-2  text-center">
                        {editing === rec._id ? (
                          <input 
                            className="w-full p-1 border rounded text-center"
                            value={editFields.valor}
                            onChange={(e) => handleEditChange("valor", e.target.value)}
                          />
                        ) : (
                          `R$ ${rec.valor}`
                        )}
                      </td>
                      <td className="p-2  text-center">
                        {editing === rec._id ? (
                          <input 
                            type="date"
                            className="w-full p-1 border rounded text-center"
                            value={editFields.data}
                            onChange={(e) => handleEditChange("data", e.target.value)}
                          />
                        ) : (
                          rec.data
                        )}
                      </td>
                      <td className="p-2  text-center">
                        {editing === rec._id ? (
                          <input 
                            className="w-full p-1 border rounded text-center"
                            value={editFields.descricao}
                            onChange={(e) => handleEditChange("descricao", e.target.value)}
                          />
                        ) : (
                          rec.descricao || "-"
                        )}
                      </td>
                      <td className="p-2  flex gap-2 justify-center">
                        {editing === rec._id ? (
                          <>
                            <Button variant="secondary" size="sm" 
                              className="rounded-md bg-[#b91c1c] px-1 py-1 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#991b1b] focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-1"
                              onClick={handleEditCancel}>
                              <X size={16} weight="bold" /> Cancelar
                            </Button>
                            <Button variant="default" 
                              className="rounded-md bg-[#3c50e0] px-2 py-1 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#324abc] focus:outline-none focus:ring-2 focus:ring-[#3c50e0] focus:ring-offset-1"
                              size="sm" onClick={handleEditSave}>
                              <Check size={16} weight="bold" /> Salvar
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="destructive" 
                              className="rounded-md bg-[#b91c1c] px-1 py-1 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#991b1b] focus:outline-none focus:ring-2 focus:ring-[#b91c1c] focus:ring-offset-1"
                              size="sm" onClick={() => handleDelete(rec._id)}>
                              <X size={16} weight="bold" /> Deletar
                            </Button>
                            <Button variant="default" 
                              className="rounded-md bg-[#3c50e0] px-2 py-1 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#324abc] focus:outline-none focus:ring-2 focus:ring-[#3c50e0] focus:ring-offset-1"
                              size="sm" onClick={() => handleEdit(rec)}>
                              <PencilSimple size={16} weight="bold" /> Editar
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Nenhuma receita cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        </div>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-4 pb-2.5 shadow-default w-2/3 mx-auto">
      <h3 className="text-xl font-semibold mb-3 text-black text-left">Criar Receita ou Despesa</h3>
      <form onSubmit={handleSubmit} className="flex flex-wrap justify-center items-end gap-4">
        <div className="flex flex-col min-w-[120px]">
          <label className="font-semibold text-gray-700 mb-1">Categoria</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
            className="p-2 border rounded w-full"
          >
            <option value="">Selecione</option>
            <option value="Despesa">Despesa</option>
            <option value="Receita">Receita</option>
          </select>
        </div>

      <div className="flex flex-col min-w-[120px]">
        <label className="font-semibold text-gray-700 mb-1">Tipo</label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
          className="p-2 border rounded w-full"
        >
          <option value="">Selecione</option>
          {categoria === "Receita" &&
            receitaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          {categoria === "Despesa" &&
            despesaOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
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

      <div className="flex flex-col min-w-[120px]">
        <label className="font-semibold text-gray-700 mb-1">Data</label>
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
          className="p-2 border rounded w-full"
        />
      </div>

      <div className="flex flex-col min-w-[120px]">
        <label className="font-semibold text-gray-700 mb-1">Descrição</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Compra de mercado"
          className="p-2 border rounded w-full"
        />
      </div>

      <Button
        type="submit"
        className="rounded-md bg-[#3c50e0] px-2 py-2 text-sm font-semibold text-white shadow-md transition duration-200 ease-in-out hover:bg-[#324abc] focus:outline-none focus:ring-2 focus:ring-[#3c50e0] focus:ring-offset-1"
        >
        <PlusCircle size={18} weight="bold" />
        Adicionar
      </Button>
    </form>
  </div>

        
      </div>
    </div>
  );
};
