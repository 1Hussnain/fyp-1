
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type EventType = "INSERT" | "UPDATE" | "DELETE";
type Table =
  | "transactions"
  | "financial_goals"
  | "budgets";
type UpdateFn<T> = React.Dispatch<React.SetStateAction<T[]>>;

type Payload<T> = {
  eventType: EventType;
  new: T;
  old: T;
};

export function useRealtime<T extends { id: string }>(
  table: Table,
  userId: string | null,
  setState: UpdateFn<T>
) {
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes" as any, // Type system workaround for SDK signature
        {
          event: "*",
          schema: "public",
          table,
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          if (payload.eventType === "INSERT") {
            setState((prev) => [payload.new, ...prev.filter((item) => item.id !== payload.new.id)]);
          } else if (payload.eventType === "UPDATE") {
            setState((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setState((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, table, setState]);
}
