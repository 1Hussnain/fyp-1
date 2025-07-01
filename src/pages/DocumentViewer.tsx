
import React, { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDocuments } from "@/hooks/useDocuments";
import { Upload, Search, FileText, Folder, Eye, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DocumentViewer = () => {
  const { documents, folders, loading, uploadDocument, deleteDocument } = useDocuments();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedFolder || doc.folder_id === selectedFolder)
  );

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await uploadDocument(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDocument(id);
    }
  };

  return (
    <AppLayout pageTitle="Document Viewer">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="text-center py-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Document Management Center
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Upload, organize, and manage your financial documents
              </p>
            </div>

            {/* Search and Upload */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/70 dark:bg-gray-800/70 border-gray-200/50 dark:border-gray-600/50"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    />
                    <Button 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </Button>
                  </div>
                </div>

                {/* Folder Filter */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedFolder === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFolder(null)}
                  >
                    All Documents
                  </Button>
                  {folders.map((folder) => (
                    <Button
                      key={folder.id}
                      variant={selectedFolder === folder.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFolder(folder.id)}
                    >
                      <Folder className="mr-2 h-3 w-3" />
                      {folder.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documents Grid */}
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Documents ({filteredDocuments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">Loading documents...</p>
                  </div>
                ) : filteredDocuments.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      No documents found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Upload your first document to get started
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredDocuments.map((document) => (
                      <motion.div
                        key={document.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <FileText className="h-8 w-8 text-purple-500" />
                          <Badge variant="outline" className="text-xs">
                            {document.file_type || 'Unknown'}
                          </Badge>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 truncate">
                          {document.name}
                        </h4>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {new Date(document.uploaded_at).toLocaleDateString()}
                        </p>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {document.file_url && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={document.file_url} download={document.name}>
                                <Download className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(document.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DocumentViewer;
