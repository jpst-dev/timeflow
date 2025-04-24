import { Users, UserPlus, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";

export const SocialPage = () => {
  return (
    <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
          Comunidade TimeFlow
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Conecte-se com outros usuários e compartilhe suas estratégias de
          gestão de tempo.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="flex items-center mb-4 text-xl font-bold">
            <Users className="w-5 h-5 mr-2 text-blue-500" />
            Usuários Populares
          </h2>

          <div className="space-y-4">
            {/* Placeholder para usuários populares */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-md dark:border-gray-700"
              >
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                    {String.fromCharCode(64 + i)}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Usuário {i}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.floor(Math.random() * 40) + 10} horas de
                      produtividade
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <UserPlus className="w-4 h-4" />
                  <span className="sr-only">Seguir</span>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full">
              Ver Mais Usuários
            </Button>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h2 className="flex items-center mb-4 text-xl font-bold">
            <Share2 className="w-5 h-5 mr-2 text-blue-500" />
            Compartilhar Progresso
          </h2>

          <p className="mb-6 text-gray-600 dark:text-gray-300">
            Compartilhe seu progresso e inspire outros a melhorar sua
            produtividade.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-md dark:bg-gray-700">
              <h3 className="mb-2 font-medium">Seu resumo semanal</h3>
              <div className="flex justify-between mb-2">
                <span>Horas produtivas:</span>
                <span className="font-bold">24h</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Categoria principal:</span>
                <span className="font-bold">Trabalho</span>
              </div>
              <div className="flex justify-between">
                <span>Nível de foco:</span>
                <span className="font-bold">Alto</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button className="flex-1">Compartilhar no Twitter</Button>
              <Button variant="outline" className="flex-1">
                Compartilhar no LinkedIn
              </Button>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="mb-3 font-medium">Compartilhar via link</h3>
            <div className="flex items-center">
              <input
                type="text"
                readOnly
                value="https://timeflow.app/share/user123"
                className="flex-1 p-2 bg-gray-100 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-l-md"
              />
              <Button className="rounded-l-none">Copiar</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
