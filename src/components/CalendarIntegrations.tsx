import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Calendar, CalendarDays, Check, Loader2 } from "lucide-react";
import { calendarService } from "../services/calendar";
import { toast } from "sonner";

export const CalendarIntegrations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleGoogleCalendarConnect = async () => {
    try {
      setIsLoading(true);
      await calendarService.authenticateGoogleCalendar();
      setIsConnected(true);
      toast.success("Google Calendar conectado com sucesso!");
    } catch (error) {
      console.error("Erro ao conectar Google Calendar:", error);
      toast.error("Falha ao conectar com o Google Calendar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>Conectar Calendários</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Conectar Calendários Externos</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <span>Google Calendar</span>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span>Conectado</span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoogleCalendarConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Conectar"
                )}
              </Button>
            )}
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground">
            <p>Próximas integrações:</p>
            <ul className="mt-2 list-disc list-inside">
              <li>Microsoft Outlook</li>
              <li>Apple Calendar</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
