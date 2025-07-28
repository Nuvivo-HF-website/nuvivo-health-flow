import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileUploadComponent } from "@/components/FileUploadComponent";
import { FileList } from "@/components/FileList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { FileUpload } from "@/services/fileStorageService";
import { FolderOpen, Upload } from "lucide-react";

export default function MyFiles() {
  const { user, userProfile } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = (file: FileUpload) => {
    // Refresh the file list when a new file is uploaded
    setRefreshKey(prev => prev + 1);
  };

  if (!user) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">Please sign in to access your files.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">My Medical Files</h1>
          <p className="text-xl text-muted-foreground">
            Upload, manage, and organize your medical documents securely
          </p>
        </div>

        <Tabs defaultValue="files" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="files" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              My Files
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-6">
            <FileList key={refreshKey} />
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <FileUploadComponent onUploadComplete={handleUploadComplete} />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}