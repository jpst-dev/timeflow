import { useState, useEffect, useMemo } from "react";
import { TimeBlock, Category } from "../types";
import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Clock, X } from "lucide-react";

interface NewTimeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Omit<TimeBlock, "id">) => void;
  initialData?: Partial<TimeBlock>;
}

export const NewTimeBlockModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {},
}: NewTimeBlockModalProps) => {
  const [newBlock, setNewBlock] = useState<Partial<TimeBlock>>({
    title: initialData.title || "",
    description: initialData.description || "",
    category: initialData.category || "clt",
    start: initialData.start || new Date().toISOString(),
    end: initialData.end || new Date().toISOString(),
  });

  useEffect(() => {
    setNewBlock({
      title: initialData.title || "",
      description: initialData.description || "",
      category: initialData.category || "clt",
      start: initialData.start || new Date().toISOString(),
      end: initialData.end || new Date().toISOString(),
    });
  }, [initialData]);

  const isFormValid = useMemo(() => {
    if (!newBlock.title) return false;
    try {
      const startDate = new Date(newBlock.start || 0);
      const endDate = new Date(newBlock.end || 0);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;
      return isAfter(endDate, startDate);
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [newBlock.title, newBlock.start, newBlock.end]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlock.title) {
      toast.error("Por favor, insira um título");
      return;
    }

    try {
      const startDate = new Date(newBlock.start || 0);
      const endDate = new Date(newBlock.end || 0);
      if (
        isNaN(startDate.getTime()) ||
        isNaN(endDate.getTime()) ||
        !isAfter(endDate, startDate)
      ) {
        toast.error(
          "A data/hora final deve ser posterior à data/hora inicial."
        );
        return;
      }
    } catch (e) {
      toast.error("Datas inválidas.");
      console.error(e);
      return;
    }

    const blockData = {
      title: newBlock.title!,
      category: newBlock.category || "clt",
      description: newBlock.description || "",
      start: newBlock.start || new Date().toISOString(),
      end: newBlock.end || new Date().toISOString(),
    };

    onSubmit(blockData);
    toast.success("Bloco de tempo criado com sucesso!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl dark:bg-gray-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Novo Bloco de Tempo
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fechar</TooltipContent>
            </Tooltip>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newBlock.title}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, title: e.target.value })
                }
                placeholder="Digite o título do bloco"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={newBlock.category}
                onValueChange={(value: Category) =>
                  setNewBlock({ ...newBlock, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clt">CLT</SelectItem>
                  <SelectItem value="pj">PJ</SelectItem>
                  <SelectItem value="estudo">Estudo</SelectItem>
                  <SelectItem value="pessoal">Pessoal</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newBlock.description}
                onChange={(e) =>
                  setNewBlock({ ...newBlock, description: e.target.value })
                }
                placeholder="Adicione uma descrição (opcional)"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Data e Hora</Label>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4" />
                <span>
                  {format(
                    new Date(newBlock.start || initialData.start || new Date()),
                    "PPP",
                    { locale: ptBR }
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4" />
                <span>
                  {format(
                    new Date(newBlock.start || initialData.start || new Date()),
                    "HH:mm"
                  )}{" "}
                  -{" "}
                  {format(
                    new Date(newBlock.end || initialData.end || new Date()),
                    "HH:mm"
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cancelar criação</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isFormValid}
                  >
                    Criar
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Criar bloco de tempo</TooltipContent>
              </Tooltip>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
