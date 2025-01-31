import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import { deletePacote } from "./api/deletePacote";
import { CreatePacoteDTO, createPacote } from "./api/pacote";
import { getAllPacotes } from "./api/getPacotes";

function formatKey(key: string) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
function formatValue(value: any) {
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    if (lower === "fibra optica") return "Fibra Óptica";
    if (lower === "5g") return "5G";
    if (lower === "4g") return "4G";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}

export const Pacotes: React.FC = () => {
  const [pacotes, setPacotes] = useState<any[]>([]);
  const [filter, setFilter] = useState<"Pessoa" | "Empresa">("Pessoa");

  // Diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Pacote selecionado para ver detalhes / deletar
  const [selectedPacote, setSelectedPacote] = useState<any | null>(null);

  // Formulário de criação
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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchPacotes() {
      try {
        const data = await getAllPacotes();
        setPacotes(data);
      } catch (error) {
        console.error("Erro ao buscar pacotes:", error);
      }
    }
    fetchPacotes();
  }, []);

  const filteredPacotes = pacotes.filter((p) => p.cliente === filter);

  const toggleTipo = (tipo: "Fixa" | "Residencial" | "Movel") => {
    if (tipos.includes(tipo)) {
      setTipos((prev) => prev.filter((t) => t !== tipo));
    } else {
      setTipos((prev) => [...prev, tipo]);
    }
  };

  const handleViewDetails = (pacote: any) => {
    setSelectedPacote(pacote);
    setIsDetailsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    let detalhes: CreatePacoteDTO["detalhes"] = {};

    if (tipos.includes("Residencial")) {
      detalhes.Residencial = {
        velocidade: residencialVelocidade,
        tipo: residencialTipo,
      };
    }
    if (tipos.includes("Movel")) {
      detalhes.Movel = {
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
      toast.success(`Pacote criado com sucesso! ID: ${response._id || "?"}`);
      const updated = await getAllPacotes();
      setPacotes(updated);

      setIsCreateDialogOpen(false);
      setCliente("Pessoa");
      setPreco("");
      setCortesia("");
      setNome("");
      setTipos([]);
      setResidencialVelocidade("");
      setResidencialTipo("banda larga");
      setMovelTamanho("");
      setMovelTipo("4g");
    } catch (error: any) {
      setErrorMessage(error.message || "Erro ao criar o pacote.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePacote = (id: string) => {
    deletePacote(id)
      .then(() => {
        toast.success(`Pacote ${id} deletado com sucesso.`);
        const updated = pacotes.filter((p) => p._id !== id);
        setPacotes(updated);
        setIsDetailsDialogOpen(false);
      })
      .catch((error) => {
        console.error("Erro ao deletar pacote:", error);
        toast.error(`Erro ao deletar pacote ${id}.`);
      });
    console.log("Deletando pacote com ID:", id);
    toast.error(`Pacote ${id} deletado (exemplo).`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-6xl font-bold mb-10 text-center">
        Pacotes Disponíveis
      </h1>

      {/* Ações (Criar + Filtro) */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-blue-600 text-white hover:bg-blue-700 text-2xl py-4 px-8"
        >
          Criar Novo Pacote
        </Button>

        <Select
          value={filter}
          onValueChange={(value: "Pessoa" | "Empresa") => setFilter(value)}
        >
          <SelectTrigger className="w-[200px] bg-white border border-gray-300 text-2xl">
            <SelectValue placeholder="Filtrar por" />
          </SelectTrigger>
          <SelectContent className="text-2xl bg-white border border-gray-300 rounded-lg">
            <SelectItem value="Pessoa" className="text-2xl">
              Pessoa
            </SelectItem>
            <SelectItem value="Empresa" className="text-2xl">
              Empresa
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de pacotes */}
      <div className="flex flex-wrap gap-6 justify-center">
        {filteredPacotes.map((pacote) => (
          <Card
            key={pacote._id}
            className="p-8 shadow-lg border rounded-xl bg-white flex flex-col items-center w-80"
          >
            <h3 className="text-4xl font-bold text-gray-900 text-center">
              {pacote.nome}
            </h3>
            <p className="text-2xl text-gray-700 mt-4">
              <strong>Tipo:</strong> {pacote.tipo.join(", ")}
            </p>
            <p className="text-3xl font-semibold text-gray-800 mt-4">
              R$ {pacote.preco}/mês
            </p>
            <Button
              className="mt-6 bg-blue-600 text-white hover:bg-blue-700 text-2xl py-3 w-full"
              onClick={() => handleViewDetails(pacote)}
            >
              Ver Detalhes
            </Button>
          </Card>
        ))}
      </div>

      {/* Dialog de Detalhes */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl p-8 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-5xl font-bold text-center">
              Detalhes do Pacote
            </DialogTitle>
          </DialogHeader>

          {selectedPacote && (
            <div className="mt-6 text-2xl space-y-4">
              <p>
                <strong>Nome do Pacote:</strong> {selectedPacote.nome}
              </p>
              <p>
                <strong>Tipos:</strong> {selectedPacote.tipo.join(", ")}
              </p>
              <p>
                <strong>Preço:</strong> R$ {selectedPacote.preco}/mês
              </p>
              <p>
                <strong>Cortesia:</strong>{" "}
                {selectedPacote.cortesia || "Nenhuma"}
              </p>
              {selectedPacote.detalhes &&
              Object.keys(selectedPacote.detalhes).length > 0 ? (
                <div>
                  <strong className="text-2xl">Mais informações:</strong>
                  <div className="mt-4 space-y-4">
                    {Object.entries(selectedPacote.detalhes).map(
                      ([key, value]: any, idx) => (
                        <div key={idx}>
                          <strong className="font-semibold">
                            {formatKey(key)}:
                          </strong>
                          {typeof value === "object" && value !== null ? (
                            <ul className="list-disc list-inside ml-6 space-y-2 mt-2">
                              {Object.entries(value).map(([subKey, subVal]) => (
                                <li key={subKey} className="text-2xl">
                                  <strong>{formatKey(subKey)}: </strong>
                                  {formatValue(subVal)}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="ml-4 text-2xl">
                              {formatValue(value)}
                            </p>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <p>Sem detalhes adicionais.</p>
              )}

              {/* Botão de deletar */}
              <div className="pt-4">
                <Button
                  variant="destructive"
                  className="text-2xl py-3 w-full bg-red-600 text-white hover:bg-red-700"
                  onClick={() => handleDeletePacote(selectedPacote._id)}
                >
                  Deletar Pacote
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Criar Pacote */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        {/*
          Responsivo aqui:
          - Em telas médias/grandes (md:), usamos max-w-6xl e padding de 8.
          - Em telas pequenas, deixamos max-w-full e padding de 4, 
            definimos overflow-y-auto e max-h-[80vh] para rolagem.
        */}
        <DialogContent
          className="
            md:max-w-6xl 
            max-w-full 
            md:p-8 
            p-4 
            bg-white 
            rounded-lg 
            shadow-lg
            overflow-y-auto 
            max-h-[80vh] 
            md:max-h-none
          "
        >
          <DialogHeader>
            <DialogTitle className="text-4xl font-bold text-center">
              Criar Pacote
            </DialogTitle>
          </DialogHeader>

          {errorMessage && (
            <div className="flex items-center gap-2 text-red-600 text-xl mb-4">
              <AlertCircle className="w-6 h-6" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-8 text-2xl">
            {/* 2 colunas principais */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* Coluna 1 */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <Label className="text-2xl font-semibold">Cliente</Label>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center text-gray-600">
                      <input
                        type="radio"
                        name="cliente"
                        value="Pessoa"
                        checked={cliente === "Pessoa"}
                        onChange={() => setCliente("Pessoa")}
                        className="mr-2 w-6 h-6"
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
                        className="mr-2 w-6 h-6"
                      />
                      Empresa
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-2xl font-semibold">Nome do Pacote</Label>
                  <Input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="p-8"
                    style={{ fontSize: '1.5rem' }}
                    placeholder="Ex: Pacote Completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-2xl font-semibold">Preço (R$)</Label>
                  <Input
                    type="text"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="p-8"
                    style={{ fontSize: '1.5rem' }}
                    placeholder="Ex: 199.90"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-2xl font-semibold">Cortesia</Label>
                  <Input
                    type="text"
                    value={cortesia}
                    onChange={(e) => setCortesia(e.target.value)}
                    className="p-8"
                    style={{ fontSize: '1.5rem' }}
                    placeholder="Ex: Instalação grátis"
                  />
                </div>
              </div>

              {/* Coluna 2 */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <Label className="text-2xl font-semibold">Tipo de Pacote</Label>
                  <div className="flex items-center space-x-6">
                    {["Fixa", "Residencial", "Movel"].map((tipo) => (
                      <label key={tipo} className="flex items-center text-gray-600">
                        <input
                          type="checkbox"
                          checked={tipos.includes(tipo as any)}
                          onChange={() =>
                            toggleTipo(tipo as "Fixa" | "Residencial" | "Movel")
                          }
                          className="mr-2 w-6 h-6"
                        />
                        {tipo}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Detalhes Residencial */}
                <div
                  className={`
                    p-4 rounded bg-gray-50 transition-all duration-150
                    ${tipos.includes("Residencial")
                      ? "opacity-100"
                      : "opacity-40 pointer-events-none"
                    }
                  `}
                >
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    Detalhes Residencial
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-2xl">Velocidade</Label>
                      <Input
                        type="text"
                        value={residencialVelocidade}
                        onChange={(e) => setResidencialVelocidade(e.target.value)}
                        placeholder="Ex: 100Mbps"
                        className="p-8"
                        style={{ fontSize: '1.5rem' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-2xl">Tipo</Label>
                      <Select
                        value={residencialTipo}
                        onValueChange={(val: "banda larga" | "fibra optica") =>
                          setResidencialTipo(val)
                        }
                      >
                        <SelectTrigger
                          className="w-full bg-white border border-gray-300 text-2xl py-4 px-6 rounded-lg"
                          style={{ fontSize: "1.5rem", height: "56px" }}
                        >
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent
                          className="bg-white border border-gray-300 text-2xl"
                          style={{ width: "100%" }}
                        >
                          <SelectItem value="banda larga" className="text-2xl py-4 px-6">
                            Banda Larga
                          </SelectItem>
                          <SelectItem value="fibra optica" className="text-2xl py-4 px-6">
                            Fibra Óptica
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Detalhes Móvel */}
                <div
                  className={`
                    p-4 rounded bg-gray-50 transition-all duration-150
                    ${tipos.includes("Movel")
                      ? "opacity-100"
                      : "opacity-40 pointer-events-none"
                    }
                  `}
                >
                  <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                    Detalhes Móvel
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-2xl font-semibold">Tamanho do Plano</Label>
                      <Input
                        type="text"
                        value={movelTamanho}
                        onChange={(e) => setMovelTamanho(e.target.value)}
                        placeholder="Ex: 10GB"
                        className="text-2xl py-4 px-6 border border-gray-300 rounded-lg"
                        style={{ fontSize: "1.5rem", height: "56px" }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-2xl font-semibold">Tipo de Rede</Label>
                      <Select
                        value={movelTipo}
                        onValueChange={(val: "4g" | "5g") => setMovelTipo(val)}
                      >
                        <SelectTrigger
                          className="w-full bg-white border border-gray-300 text-2xl py-4 px-6 rounded-lg"
                          style={{ fontSize: "1.5rem", height: "56px" }}
                        >
                          <SelectValue placeholder="Selecione a rede" />
                        </SelectTrigger>
                        <SelectContent
                          className="bg-white border border-gray-300 text-2xl rounded-lg shadow-lg"
                          style={{ width: "100%", minWidth: "250px", maxWidth: "400px" }}
                        >
                          <SelectItem value="4g" className="text-2xl py-4 px-6">
                            4G
                          </SelectItem>
                          <SelectItem value="5g" className="text-2xl py-4 px-6">
                            5G
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 bg-blue-600 text-white py-4 text-2xl w-full hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Criar Pacote"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
