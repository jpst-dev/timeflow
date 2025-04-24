import { useMemo } from "react";
import { useAppSelector } from "../hooks";
import { CategoryFilters } from "../components/CategoryFilters";
import { CATEGORIES } from "../utils/categories";
import { CategoryFilter, TimeBlock, Category } from "../types";

interface CategoryDuration {
  id: Category;
  label: string;
  color: string;
  hours: number;
  count: number;
}

export const AnalyticsPage = () => {
  const timeBlocks = useAppSelector(
    (state) => state.timeBlocks.blocks as TimeBlock[]
  );
  const filters = useAppSelector((state) => state.filters as CategoryFilter);

  // Filtra blocos pelo filtro selecionado
  const filteredBlocks = useMemo(() => {
    return timeBlocks.filter((block) => filters[block.category]);
  }, [timeBlocks, filters]);

  // Calcula a duração total de cada categoria em horas
  const categoryDurations = useMemo<Record<Category, CategoryDuration>>(() => {
    return Object.values(CATEGORIES).reduce((acc, category) => {
      const blocks = filteredBlocks.filter(
        (block) => block.category === category.id
      );
      const totalMs = blocks.reduce((sum, block) => {
        // Converte as strings ISO para Date antes de calcular a diferença
        const startTime = new Date(block.start).getTime();
        const endTime = new Date(block.end).getTime();
        // Adiciona verificação para garantir que são números válidos
        if (isNaN(startTime) || isNaN(endTime)) return sum;
        return sum + (endTime - startTime);
      }, 0);

      const totalHours = totalMs / (1000 * 60 * 60);

      return {
        ...acc,
        [category.id]: {
          ...category,
          hours: Math.round(totalHours * 10) / 10,
          count: blocks.length,
        },
      };
    }, {} as Record<Category, CategoryDuration>);
  }, [filteredBlocks]);

  // Calcula o total de horas para o perímetro
  const totalHours = useMemo(() => {
    // Evitar divisão por zero se não houver blocos válidos
    const sumHours = Object.values(categoryDurations).reduce(
      (sum, cat) => sum + cat.hours,
      0
    );
    return sumHours > 0 ? sumHours : 1; // Retorna 1 se for 0 para evitar NaN%
  }, [categoryDurations]);

  return (
    <div className="container px-4 py-20 mx-auto sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
        Análise de Tempo
      </h1>

      <CategoryFilters />

      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Distribuição por Categoria
          </h2>

          <div className="space-y-4">
            {Object.values(categoryDurations).map((category) => (
              <div key={category.id} className="flex items-center">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="flex-1 ml-2 text-gray-700 dark:text-gray-300">
                  {category.label}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {category.hours}h (
                  {Math.round((category.hours / totalHours) * 100)}%)
                </span>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">
                  Total
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Math.round(totalHours * 10) / 10}h
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow dark:bg-gray-800">
          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Resumo
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {Object.values(categoryDurations).map((category) => (
              <div
                key={category.id}
                className={`p-4 rounded-lg border-l-4 bg-opacity-10`}
                style={{
                  borderColor: category.color,
                  backgroundColor: `${category.color}20`,
                }}
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {category.hours}h
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {category.count} blocos
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
