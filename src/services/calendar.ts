import { TimeBlock } from "../types";

// Configurações da API do Google Calendar
const GOOGLE_CALENDAR_CLIENT_ID = import.meta.env
  .VITE_GOOGLE_CALENDAR_CLIENT_ID;
const GOOGLE_CALENDAR_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
const GOOGLE_CALENDAR_SCOPES =
  "https://www.googleapis.com/auth/calendar.readonly";

// Interface para eventos de calendário externo
interface ExternalCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  source: "google" | "outlook" | "apple";
}

interface GoogleAuth {
  signIn: () => Promise<void>;
  // Adicione outros métodos conforme necessário
}

interface GoogleCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  description?: string;
}

interface GoogleCalendarResponse {
  result: {
    items: GoogleCalendarEvent[];
  };
}

class CalendarService {
  private static instance: CalendarService;
  private googleAuth: GoogleAuth | null = null;

  private constructor() {}

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  // Inicializa a API do Google Calendar
  async initGoogleCalendar() {
    try {
      // Carrega a biblioteca do Google Calendar
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return new Promise((resolve) => {
        script.onload = () => {
          // @ts-expect-error - Google Calendar API
          window.gapi.load("client:auth2", async () => {
            try {
              // @ts-expect-error - Google Calendar API
              await window.gapi.client.init({
                apiKey: GOOGLE_CALENDAR_API_KEY,
                clientId: GOOGLE_CALENDAR_CLIENT_ID,
                discoveryDocs: [
                  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
                ],
                scope: GOOGLE_CALENDAR_SCOPES,
              });
              // @ts-expect-error - Google Calendar API
              this.googleAuth = window.gapi.auth2.getAuthInstance();
              resolve(true);
            } catch (error: any) {
              console.error("Erro ao inicializar Google Calendar:", error);
              if (error?.error === "idpiframe_initialization_failed") {
                console.warn(
                  "Por favor, adicione http://localhost:5173 às origens autorizadas no Google Cloud Console"
                );
              }
              resolve(false);
            }
          });
        };
      });
    } catch (error) {
      console.error("Erro ao carregar script do Google Calendar:", error);
      return false;
    }
  }

  // Autentica com o Google Calendar
  async authenticateGoogleCalendar() {
    try {
      if (!this.googleAuth) {
        await this.initGoogleCalendar();
      }
      return await this.googleAuth!.signIn();
    } catch (error) {
      console.error("Erro na autenticação do Google Calendar:", error);
      throw error;
    }
  }

  // Busca eventos do Google Calendar
  async fetchGoogleCalendarEvents(
    startDate: Date,
    endDate: Date
  ): Promise<ExternalCalendarEvent[]> {
    try {
      if (!this.googleAuth) {
        const initialized = await this.initGoogleCalendar();
        if (!initialized) {
          throw new Error(
            "Falha ao inicializar Google Calendar. Verifique se o domínio está autorizado no Google Cloud Console."
          );
        }
      }

      // @ts-expect-error - Google Calendar API
      const response = (await window.gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      })) as GoogleCalendarResponse;

      return response.result.items.map((event) => ({
        id: event.id,
        title: event.summary,
        start:
          event.start.dateTime || event.start.date || new Date().toISOString(),
        end: event.end.dateTime || event.end.date || new Date().toISOString(),
        description: event.description || "",
        source: "google" as const,
      }));
    } catch (error) {
      console.error("Erro ao buscar eventos do Google Calendar:", error);
      throw error;
    }
  }

  // Converte eventos externos para TimeBlocks
  convertToTimeBlocks(events: ExternalCalendarEvent[]): TimeBlock[] {
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      description: event.description,
      category: "external" as const,
      source: event.source,
    }));
  }
}

export const calendarService = CalendarService.getInstance();
