import { Calendar } from "../components/Calendar";
import { CategoryFilters } from "../components/CategoryFilters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

export const HomePage = () => {
  const currentDate = format(new Date(), "PPPP", { locale: ptBR });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900/50">
      {/* Gradiente decorativo */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 dark:from-blue-950/20 dark:to-purple-950/20" />
      </div>

      <div className="container px-4 py-20 mx-auto sm:px-6 lg:px-8">
        {/* Header da página */}
        <div className="mb-8">
          <div className="flex flex-col space-y-2">
            <h1 className="flex items-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              <CalendarIcon className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
              Planejamento Semanal
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400">
              {currentDate}
            </p>
          </div>
        </div>

        {/* Filtros de categoria */}
        <div className="mb-6">
          <CategoryFilters />
        </div>

        {/* Container do Calendário com efeito de profundidade */}
        <div className="relative">
          {/* Sombra decorativa */}
          <div className="absolute -inset-4 bg-gradient-to-b from-white/80 to-white/20 dark:from-gray-800/80 dark:to-gray-800/20 rounded-2xl blur-xl -z-10" />

          {/* Borda decorativa */}
          <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-400/10 dark:to-purple-400/10 rounded-2xl -z-5" />

          {/* Calendário */}
          <div className="relative backdrop-blur-sm">
            <Calendar />
          </div>
        </div>
      </div>
    </div>
  );
};
