import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreatePacoteDTO, createPacote } from "./api/pacote";

export const Pacotes: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [cliente, setCliente] = useState<"Pessoa" | "Empresa">("Pessoa");
  const [preco, setPreco] = useState("");
  const [cortesia, setCortesia] = useState("");
  const [nome, setNome] = useState("");

  const [tipos, setTipos] = useState<Array<"Fixa" | "Residencial" | "Movel">>([]);

  const [residencialVelocidade, setResidencialVelocidade] = useState("");
  const [residencialTipo, setResidencialTipo] = useState<"banda larga" | "fibra optica">("banda larga");

  const [movelTamanho, setMovelTamanho] = useState("");
  const [movelTipo, setMovelTipo] = useState<"4g" | "5g">("4g");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleTipo = (tipo: "Fixa" | "Residencial" | "Movel") => {
    if (tipos.includes(tipo)) {
      setTipos(tipos.filter((t) => t !== tipo));
    } else {
      setTipos([...tipos, tipo]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    let detalhes: CreatePacoteDTO["detalhes"] = {};

    if (tipos.includes("Residencial")) {
      detalhes!.Residencial = {
        velocidade: residencialVelocidade,
        tipo: residencialTipo,
      };
    }

    if (tipos.includes("Movel")) {
      detalhes!.Movel = {
        tamanho_do_plano: movelTamanho,
        tipo: movelTipo,
      };
    }

    const data: CreatePacoteDTO = {
      cliente,
      tipo: tipos,
      preco,
      cortesia,
      nome,
      detalhes: Object.keys(detalhes).length > 0 ? detalhes : {},
    };

    try {
      const response = await createPacote(data);
      setSuccessMessage(`Pacote criado com sucesso! ID: ${response._id || "?"}`);
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao criar o pacote.");
    } finally {
      setIsSubmitting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8">
      <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 text-white">
        Criar Novo Pacote
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl p-8 bg-gray-50 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Criar Pacote</DialogTitle>
          </DialogHeader>

          {successMessage && (
            <div className="bg-green-100 text-green-800 p-4 mb-6 rounded-lg">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-100 text-red-800 p-4 mb-6 rounded-lg">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
            {/* Cliente */}
            <div className="col-span-2 flex items-center gap-4">
              <label className="font-semibold text-gray-700">Cliente:</label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center text-gray-600">
                  <input
                    type="radio"
                    name="cliente"
                    value="Pessoa"
                    checked={cliente === "Pessoa"}
                    onChange={() => setCliente("Pessoa")}
                    className="mr-2"
                  />
                  Pessoa
                </label>
                <label className="flex items-center text-gray-600">
                  <input
                    type="radio"
                    name="cliente"
                    value="Empresa"
                    checked={cliente === "Empresa"}
                    onChange={() => setCliente("Empresa")}
                    className="mr-2"
                  />
                  Empresa
                </label>
              </div>
            </div>

            {/* Tipo de Pacote */}
            <div className="col-span-2">
              <label className="block mb-2 font-semibold text-gray-700">Tipo de Pacote</label>
              <div className="flex items-center space-x-6">
                {["Fixa", "Residencial", "Movel"].map((tipo) => (
                  <label key={tipo} className="flex items-center text-gray-600">
                    <input
                      type="checkbox"
                      checked={tipos.includes(tipo as "Fixa" | "Residencial" | "Movel")}
                      onChange={() => toggleTipo(tipo as "Fixa" | "Residencial" | "Movel")}
                      className="mr-2"
                    />
                    {tipo}
                  </label>
                ))}
              </div>
            </div>

            {/* Detalhes Residencial */}
            <div className="col-span-2 border p-4 rounded bg-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Detalhes Residencial</h3>
              <div className={`grid grid-cols-2 gap-4 ${tipos.includes("Residencial") ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                <div>
                  <label className="block mb-2 text-gray-600">Velocidade</label>
                  <input
                    type="text"
                    value={residencialVelocidade}
                    onChange={(e) => setResidencialVelocidade(e.target.value)}
                    placeholder="Ex: 100Mbps"
                    className="border border-gray-300 rounded-lg w-full p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Tipo</label>
                  <select
                    value={residencialTipo}
                    onChange={(e) => setResidencialTipo(e.target.value as "banda larga" | "fibra optica")}
                    className="border border-gray-300 rounded-lg w-full p-2"
                  >
                    <option value="banda larga">Banda Larga</option>
                    <option value="fibra optica">Fibra Óptica</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Detalhes Móvel */}
            <div className="col-span-2 border p-4 rounded bg-gray-100">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Detalhes Móvel</h3>
              <div className={`grid grid-cols-2 gap-4 ${tipos.includes("Movel") ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                <div>
                  <label className="block mb-2 text-gray-600">Tamanho do Plano</label>
                  <input
                    type="text"
                    value={movelTamanho}
                    onChange={(e) => setMovelTamanho(e.target.value)}
                    placeholder="Ex: 10GB"
                    className="border border-gray-300 rounded-lg w-full p-2"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-600">Tipo de Rede</label>
                  <select
                    value={movelTipo}
                    onChange={(e) => setMovelTipo(e.target.value as "4g" | "5g")}
                    className="border border-gray-300 rounded-lg w-full p-2"
                  >
                    <option value="4g">4G</option>
                    <option value="5g">5G</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Campos principais */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Preço</label>
              <input
                type="text"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="Ex: 199.90"
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">Cortesia</label>
              <input
                type="text"
                value={cortesia}
                onChange={(e) => setCortesia(e.target.value)}
                placeholder="Ex: Instalação grátis"
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-2 font-semibold text-gray-700">Nome do Pacote</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Pacote Completo"
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>

            {/* Botão de envio */}
            <div className="col-span-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Enviando..." : "Criar Pacote"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
