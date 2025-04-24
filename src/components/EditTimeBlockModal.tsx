import { useState, useEffect, useMemo } from "react";
import { TimeBlock } from "../types";
import { useDispatch } from "react-redux";
import { updateTimeBlock, deleteTimeBlock } from "../store";
import { format, isAfter } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

interface EditTimeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeBlock: TimeBlock;
}

export const EditTimeBlockModal = ({
  isOpen,
  onClose,
  timeBlock,
}: EditTimeBlockModalProps) => {
  const dispatch = useDispatch();
  const [editedBlock, setEditedBlock] = useState<TimeBlock>(timeBlock);

  useEffect(() => {
    setEditedBlock(timeBlock);
  }, [timeBlock]);

  const isFormValid = useMemo(() => {
    if (!editedBlock.title) return false;
    try {
      const startDate = new Date(editedBlock.start || 0);
      const endDate = new Date(editedBlock.end || 0);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;
      return isAfter(endDate, startDate);
    } catch (e) {
      console.error(e);
      return false;
    }
  }, [editedBlock.title, editedBlock.start, editedBlock.end]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedBlock.title) {
      toast.error("Por favor, insira um título.");
      return;
    }

    try {
      const startDate = new Date(editedBlock.start || 0);
      const endDate = new Date(editedBlock.end || 0);
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
      console.error(e);
      toast.error("Datas inválidas.");
      return;
    }

    const blockToUpdate = {
      ...editedBlock,
      start: new Date(editedBlock.start).toISOString(),
      end: new Date(editedBlock.end).toISOString(),
    };
    dispatch(updateTimeBlock(blockToUpdate));
    toast.success("Bloco de tempo atualizado com sucesso!");
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este bloco de tempo?")) {
      dispatch(deleteTimeBlock(editedBlock.id));
      toast.error("Bloco de tempo excluído");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="w-full max-w-md p-6 bg-white rounded-lg dark:bg-gray-800"
        >
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
            Editar Bloco de Tempo
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Título
              </label>
              <input
                type="text"
                value={editedBlock.title}
                onChange={(e) =>
                  setEditedBlock({ ...editedBlock, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Data e Hora
              </label>
              <div className="text-gray-900 dark:text-white">
                {format(new Date(editedBlock.start), "PPP", { locale: ptBR })}
              </div>
              <div className="text-gray-900 dark:text-white">
                {format(new Date(editedBlock.start), "HH:mm")} -{" "}
                {format(new Date(editedBlock.end), "HH:mm")}
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição
              </label>
              <textarea
                value={editedBlock.description}
                onChange={(e) =>
                  setEditedBlock({
                    ...editedBlock,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                rows={3}
              />
            </div>

            <div className="flex justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Excluir
                  </button>
                </TooltipTrigger>
                <TooltipContent>Excluir este bloco de tempo</TooltipContent>
              </Tooltip>
              <div className="space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-800 bg-gray-200 rounded-md dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancelar
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Cancelar edição</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="submit"
                      className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!isFormValid}
                    >
                      Salvar
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Salvar alterações</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
