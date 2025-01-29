import React, { useState } from "react";
import { CreatePacoteDTO, createPacote } from "./api/pacote";

export const Pacotes: React.FC = () => {
  const [cliente, setCliente] = useState<"Pessoa" | "Empresa">("Pessoa");
  const [preco, setPreco] = useState("");
  const [cortesia, setCortesia] = useState("");
  const [nome, setNome] = useState("");

  const [tipos, setTipos] = useState<Array<"Fixa" | "Residencial" | "Movel">>(
    []
  );

  const [residencialVelocidade, setResidencialVelocidade] = useState("");
  const [residencialTipo, setResidencialTipo] = useState<"banda larga" | "fibra optica">("banda larga");

  const [movelTamanho, setMovelTamanho] = useState("");
  const [movelTipo, setMovelTipo] = useState<"4g" | "5g">("4g");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Criar Pacote</h1>

      {successMessage && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1 font-semibold">Cliente</label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
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
            <label className="inline-flex items-center">
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

        <div>
          <label className="block mb-1 font-semibold">Tipo de Pacote</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={tipos.includes("Fixa")}
                onChange={() => toggleTipo("Fixa")}
                className="mr-2"
              />
              Fixa
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={tipos.includes("Residencial")}
                onChange={() => toggleTipo("Residencial")}
                className="mr-2"
              />
              Residencial
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={tipos.includes("Movel")}
                onChange={() => toggleTipo("Movel")}
                className="mr-2"
              />
              Móvel
            </label>
          </div>
        </div>

        {tipos.includes("Residencial") && (
          <div className="border p-3 rounded bg-gray-50">
            <h2 className="font-semibold mb-2">Detalhes Residencial</h2>

            <div className="mb-3">
              <label className="block mb-1">Velocidade</label>
              <input
                type="text"
                value={residencialVelocidade}
                onChange={(e) => setResidencialVelocidade(e.target.value)}
                placeholder="Ex: 100Mbps"
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Tipo</label>
              <select
                value={residencialTipo}
                onChange={(e) =>
                  setResidencialTipo(e.target.value as "banda larga" | "fibra optica")
                }
                className="border border-gray-300 rounded w-full p-2"
              >
                <option value="banda larga">Banda Larga</option>
                <option value="fibra optica">Fibra Óptica</option>
              </select>
            </div>
          </div>
        )}

        {tipos.includes("Movel") && (
          <div className="border p-3 rounded bg-gray-50">
            <h2 className="font-semibold mb-2">Detalhes Móvel</h2>

            <div className="mb-3">
              <label className="block mb-1">Tamanho do Plano</label>
              <input
                type="text"
                value={movelTamanho}
                onChange={(e) => setMovelTamanho(e.target.value)}
                placeholder="Ex: 10GB"
                className="border border-gray-300 rounded w-full p-2"
              />
            </div>

            <div>
              <label className="block mb-1">Tipo de Rede</label>
              <select
                value={movelTipo}
                onChange={(e) =>
                  setMovelTipo(e.target.value as "4g" | "5g")
                }
                className="border border-gray-300 rounded w-full p-2"
              >
                <option value="4g">4G</option>
                <option value="5g">5G</option>
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="block mb-1 font-semibold">Preço</label>
          <input
            type="text"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            placeholder="Ex: 199.90"
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Cortesia</label>
          <input
            type="text"
            value={cortesia}
            onChange={(e) => setCortesia(e.target.value)}
            placeholder="Ex: Instalação grátis"
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Nome do Pacote</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Pacote Completo"
            className="border border-gray-300 rounded w-full p-2"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Enviando..." : "Criar Pacote"}
          </button>
        </div>
      </form>
    </div>
  );
}
