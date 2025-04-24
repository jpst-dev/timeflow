import { useAppSelector } from "../hooks";
import { Clock } from "lucide-react";

export const HistoryPage = () => {
  const timeBlocks = useAppSelector((state) => state.timeBlocks.blocks);

  // Ordenar blocos por data - mais recentes primeiro
  const sortedBlocks = [...timeBlocks].sort(
    (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
  );

  return (
    <div className="container px-4 py-20 mx-auto sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Histórico de Atividades
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Visualize um registro completo de suas atividades anteriores.
        </p>
      </div>

      <div className="space-y-6">
        {sortedBlocks.length > 0 ? (
          sortedBlocks.map((block) => (
            <div
              key={block.id}
              className={`time-block time-block-${block.category} p-4 flex items-start`}
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{block.title}</h3>
                {block.description && (
                  <p className="mt-1 text-white/90">{block.description}</p>
                )}
                <div className="flex items-center mt-2 text-sm text-white/80">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {new Date(block.start).toLocaleDateString()} -{" "}
                    {new Date(block.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    até{" "}
                    {new Date(block.end).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500 dark:text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Nenhuma atividade registrada ainda.</p>
            <p className="mt-2">
              Adicione blocos de tempo na página de calendário para
              visualizá-los aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
