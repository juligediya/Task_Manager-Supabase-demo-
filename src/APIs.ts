import { supabase } from "./supabase/supabasse-client"
export type Task = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};


export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("Task")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error on fetching Task:", error);
    throw error;
  }

  return data || [];
}

export const addTask = async (task: { title: string; description: string }) => {
  const { data, error } = await supabase
    .from("Task")
    .insert(task)
    .select();

     if (error) {
    console.error("Error on Adding Task:", error);
    throw error;
  }

  return data || []; 
}

export const deleteTask = async (id:number) => {
  const { data, error } = await supabase
    .from("Task")
    .delete()
    .eq("id", id)
    .select();

     if (error) {
    console.error("Error on Adding Task:", error);
    throw error;
  }

  return data || []; 
}

export const updateTask = async (id:number,task: { title: string; description: string }) => {
  const { data, error } = await supabase
    .from("Task")
    .update(task)
    .eq("id", id)
    .select();

     if (error) {
    console.error("Error on Adding Task:", error);
    throw error;
  }

  return data || []; 
}
