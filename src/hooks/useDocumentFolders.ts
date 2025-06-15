
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { folderService } from "@/services/supabase";
import { Folder } from "@/types/database";
import { useToast } from "@/hooks/use-toast";

export const useDocumentFolders = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const { toast } = useToast();

  const fetchFolders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const result = await folderService.getAll(user.id);
      if (result.success) {
        setFolders(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching folders",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createNewFolder = async (folderName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      const result = await folderService.create({ name: folderName, user_id: user.id });
      if (result.success) {
        toast({
          title: "Folder created",
          description: "Folder created successfully",
        });
        fetchFolders();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: "Error creating folder",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    folders,
    setFolders,
    fetchFolders,
    createNewFolder,
  };
};
