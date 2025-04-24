import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Calendar as BigCalendar,
  Views,
  dateFnsLocalizer,
  View,
  ToolbarProps,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion";
import { toast } from "sonner";
import withDragAndDrop, {
  EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import { useAppSelector, useAppDispatch } from "../hooks";
import { TimeBlock, Category } from "../types";
import { getCategoryColor } from "../utils/categories";
import { cn } from "../utils/cn";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import { EditTimeBlockModal } from "./EditTimeBlockModal";
import { NewTimeBlockModal } from "./NewTimeBlockModal";
import { addTimeBlock, updateTimeBlock } from "../store/slices/timeBlocksSlice";
import { v4 as uuidv4 } from "uuid";
import { CalendarIntegrations } from "./CalendarIntegrations";
import { calendarService } from "../services/calendar";

// Localizer com date-fns
const locales = {
  "pt-BR": ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Estilos customizados para o calendário
import "./calendar.css";

// Tipo local para o evento recebido do BigCalendar
interface CalendarEventType {
  id: string;
  title: string;
  start: Date; // BigCalendar passa Date
  end: Date; // BigCalendar passa Date
  category: Category;
  description?: string;
  // Adicione outras propriedades se o BigCalendar passar mais
}

const EventCard = ({ event }: { event: CalendarEventType }) => {
  const categoryColor = getCategoryColor(event.category);

  return (
    <motion.div
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
      // Usar classes Tailwind para padding, texto, etc.
      className={cn(
        "relative flex flex-col justify-start h-full p-1.5 rounded overflow-hidden text-white shadow-sm",
        "transition-all duration-150 ease-out" // Transição para boxShadow
      )}
      style={{
        // Gradiente sutil baseado na cor da categoria para melhor contraste
        // A cor sólida ainda vem do eventPropGetter para o estado base
        backgroundImage: `linear-gradient(to bottom right, ${categoryColor}e0, ${categoryColor}c0)`,
      }}
    >
      <div className="text-[11px] font-bold leading-tight mb-0.5 truncate">
        {event.title}
      </div>
      {event.description && (
        <div className="text-[10px] opacity-85 leading-snug truncate">
          {event.description}
        </div>
      )}
    </motion.div>
  );
};

// Componente para dias do calendário
const DayHeader = ({ label }: { label: string }) => {
  const parts = label.split(", ");
  const day = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  const date = parts[1];

  return (
    <div className="flex flex-col items-center justify-center h-full py-1.5">
      <span className="text-xs font-semibold tracking-wide text-gray-700 uppercase dark:text-gray-300">
        {day}
      </span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-100 mt-0.5">
        {date}
      </span>
    </div>
  );
};

// Componente para a barra de ferramentas personalizada
const CustomToolbar = ({
  label,
  onNavigate,
  onView,
  views,
  view,
}: ToolbarProps<CalendarEventType, object>) => {
  const availableViews = views as View[];

  return (
    <div className="flex flex-col items-start justify-between gap-3 p-1 mb-4 sm:flex-row sm:items-center sm:gap-4">
      {/* Grupo de Navegação */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => onNavigate("TODAY")}
          variant="outline"
          size="sm"
          className="font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <CalendarDays className="w-4 h-4 mr-1.5" />
          <span>Hoje</span>
        </Button>
        <div className="flex items-center">
          <Button
            onClick={() => onNavigate("PREV")}
            variant="outline"
            size="icon"
            className="w-8 h-8 border-r-0 rounded-r-none hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onNavigate("NEXT")}
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-l-none hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Label Central */}
      <span className="order-first text-lg font-bold text-center text-gray-800 dark:text-gray-100 sm:order-none sm:text-xl grow">
        {label}
      </span>

      {/* Grupo de Visão */}
      <div className="flex items-center self-end sm:self-center">
        {availableViews.map((viewOption, index) => {
          const isFirst = index === 0;
          const isLast = index === availableViews.length - 1;
          const isMiddle = !isFirst && !isLast;

          return (
            <Button
              key={viewOption}
              onClick={() => onView(viewOption)}
              variant={view === viewOption ? "default" : "outline"}
              size="sm"
              className={cn(
                "w-20",
                view === viewOption
                  ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                  : "hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400",
                isFirst && availableViews.length > 1
                  ? "rounded-r-none border-r-0"
                  : "",
                isLast && availableViews.length > 1 ? "rounded-l-none" : "",
                isMiddle ? "rounded-none border-r-0" : ""
              )}
            >
              {viewOption === "week"
                ? "Semana"
                : viewOption === "day"
                ? "Dia"
                : viewOption}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

// Criar o componente Calendar com suporte a Drag and Drop e tipo explícito
const DnDCalendar = withDragAndDrop<CalendarEventType, object>(BigCalendar);

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);
  const [selectedEvent, setSelectedEvent] = useState<TimeBlock | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Partial<TimeBlock>>(
    {}
  );
  const timeBlocks = useAppSelector((state) => state.timeBlocks.blocks);
  const filters = useAppSelector((state) => state.filters);
  const [isDark, setIsDark] = useState(false);
  const dispatch = useAppDispatch();
  const [externalEvents, setExternalEvents] = useState<TimeBlock[]>([]);

  useEffect(() => {
    // Detectar modo escuro
    const darkMode = document.documentElement.classList.contains("dark");
    setIsDark(darkMode);

    // Observer para detectar mudanças no modo escuro
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const filteredEvents = useMemo(() => {
    return timeBlocks.filter((block) => filters[block.category]);
  }, [timeBlocks, filters]);

  const eventPropGetter = useCallback(
    (event: CalendarEventType) => {
      const color = getCategoryColor(event.category);
      const today = new Date();
      const isToday = isSameDay(event.start, today);

      const baseClasses =
        "rbc-event transition-all duration-150 ease-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800";

      return {
        className: cn(
          baseClasses,
          isToday ? "ring-2 ring-offset-1 dark:ring-offset-gray-800" : "",
          `event-${event.category}`
        ),
        style: {
          backgroundColor: `${color}${isDark ? "dd" : "cc"}`,
          borderColor: color,
          borderLeft: `3px solid ${color}`,
        },
      };
    },
    [isDark]
  );

  const dayPropGetter = useCallback(
    (date: Date) => {
      const isToday = isSameDay(date, new Date());
      return {
        className: cn(isToday ? "rbc-today-highlight" : ""),
        style: {
          backgroundColor:
            isToday && isDark
              ? "rgba(59, 130, 246, 0.08)"
              : isToday
              ? "rgba(59, 130, 246, 0.05)"
              : undefined,
        },
      };
    },
    [isDark]
  );

  const formats = {
    timeGutterFormat: "HH:mm",
    eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`,
    dayHeaderFormat: (date: Date) =>
      format(date, "EEEE, dd/MM", { locale: ptBR }),
    dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
      `${format(start, "dd/MM")} - ${format(end, "dd/MM")}`,
  };

  const handleOpenNewModal = (initialData: Partial<TimeBlock> = {}) => {
    setModalInitialData(initialData);
    setIsNewModalOpen(true);
  };

  const handleCloseNewModal = () => {
    setIsNewModalOpen(false);
    setModalInitialData({});
  };

  const handleAddTimeBlock = (formData: Omit<TimeBlock, "id">) => {
    const newBlock: TimeBlock = {
      ...formData,
      id: uuidv4(),
      start: new Date(formData.start).toISOString(),
      end: new Date(formData.end).toISOString(),
    };
    dispatch(addTimeBlock(newBlock));
  };

  const handleCalendarSelectSlot = ({
    start,
    end,
  }: {
    start: Date;
    end: Date;
  }) => {
    handleOpenNewModal({ start: start.toISOString(), end: end.toISOString() });
  };

  const handleSelectEvent = (event: CalendarEventType) => {
    setSelectedEvent({
      id: event.id,
      title: event.title,
      category: event.category,
      description: event.description,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
    });
    setIsEditModalOpen(true);
  };

  const handleEventDrop = useCallback(
    (args: EventInteractionArgs<CalendarEventType>) => {
      const { event, start, end } = args;

      if (!(start instanceof Date) || !(end instanceof Date)) {
        console.error("Invalid date received on event drop:", start, end);
        toast.error("Erro ao mover o evento.");
        return;
      }

      const updatedBlock: TimeBlock = {
        ...event,
        start: start.toISOString(),
        end: end.toISOString(),
      };
      dispatch(updateTimeBlock(updatedBlock));
      toast.success(
        `"${event.title}" movido para ${format(start, "HH:mm")} - ${format(
          end,
          "HH:mm"
        )}`
      );
    },
    [dispatch]
  );

  const handleEventResize = useCallback(
    (args: EventInteractionArgs<CalendarEventType>) => {
      const { event, start, end } = args;

      if (!(start instanceof Date) || !(end instanceof Date)) {
        console.error("Invalid date received on event resize:", start, end);
        toast.error("Erro ao redimensionar o evento.");
        return;
      }

      const updatedBlock: TimeBlock = {
        ...event,
        start: start.toISOString(),
        end: end.toISOString(),
      };
      dispatch(updateTimeBlock(updatedBlock));
      toast.info(
        `"${event.title}" redimensionado para ${format(
          start,
          "HH:mm"
        )} - ${format(end, "HH:mm")}`
      );
    },
    [dispatch]
  );

  // Função para carregar eventos externos
  const loadExternalEvents = useCallback(async () => {
    try {
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() - 7); // Uma semana antes
      const endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 7); // Uma semana depois

      const googleEvents = await calendarService.fetchGoogleCalendarEvents(
        startDate,
        endDate
      );
      const timeBlocks = calendarService.convertToTimeBlocks(googleEvents);
      setExternalEvents(timeBlocks);
    } catch (error) {
      console.error("Erro ao carregar eventos externos:", error);
      toast.error("Falha ao carregar eventos externos");
    }
  }, [currentDate]);

  // Carrega eventos externos quando a data muda
  useEffect(() => {
    loadExternalEvents();
  }, [currentDate, loadExternalEvents]);

  // Combina eventos locais com eventos externos
  const allEvents = useMemo(() => {
    return [...filteredEvents, ...externalEvents].map((block) => ({
      ...block,
      start: new Date(block.start),
      end: new Date(block.end),
    }));
  }, [filteredEvents, externalEvents]);

  return (
    <div
      className={cn(
        "overflow-hidden bg-white dark:bg-gray-800/80 p-4 md:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700",
        "transition-all duration-200 backdrop-blur-sm",
        isDark ? "calendar-dark" : "calendar-light"
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center text-lg font-semibold text-gray-900 dark:text-white">
          <CalendarIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
          Agenda
        </h2>
        <div className="flex items-center gap-2">
          <CalendarIntegrations />
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => handleOpenNewModal()}
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Bloco</span>
          </Button>
        </div>
      </div>

      <DnDCalendar
        localizer={localizer}
        events={allEvents}
        defaultView={Views.WEEK}
        views={[Views.WEEK, Views.DAY]}
        view={currentView}
        onView={setCurrentView}
        step={30}
        showMultiDayTimes
        date={currentDate}
        onNavigate={setCurrentDate}
        formats={formats}
        dayPropGetter={dayPropGetter}
        eventPropGetter={eventPropGetter}
        components={{
          event: EventCard,
          day: {
            header: DayHeader,
          },
          toolbar: CustomToolbar,
        }}
        selectable
        popup
        draggableAccessor={() => true}
        resizableAccessor={() => true}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        className={cn("calendar-custom text-sm", isDark ? "dark-theme" : "")}
        onSelectSlot={handleCalendarSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
      {selectedEvent && (
        <EditTimeBlockModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedEvent(null);
          }}
          timeBlock={selectedEvent}
        />
      )}

      <NewTimeBlockModal
        onSubmit={handleAddTimeBlock}
        isOpen={isNewModalOpen}
        onClose={handleCloseNewModal}
        initialData={modalInitialData}
      />
    </div>
  );
};
