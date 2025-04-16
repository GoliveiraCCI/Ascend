"use client";

import { useState } from "react";
import { FileUp, Users, FileText, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { TemplateDownload } from "./templates";

export default function BulkImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (type: string) => {
    if (!selectedFile) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um arquivo"
      });
      return;
    }

    setIsLoading(true);
    try {
      const fileContent = await selectedFile.text();
      const rows = fileContent.split("\n");
      const headers = rows[0].split(";").map(h => h.trim());
      const data = rows.slice(1)
        .filter(row => row.trim())
        .map(row => {
          const values = row.split(";").map(v => v.trim());
          return headers.reduce((obj, header, index) => {
            obj[header.replace(/"/g, "")] = values[index]?.replace(/"/g, "") || "";
            return obj;
          }, {} as Record<string, string>);
        });

      let response;
      if (type === "funcionários") {
        response = await fetch("/api/bulk-import/employees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ employees: data }),
        });
      } else if (type === "atestados") {
        response = await fetch("/api/bulk-import/medical-leaves", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ medicalLeaves: data }),
        });
      } else if (type === "treinamentos") {
        response = await fetch("/api/bulk-import/trainings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trainings: data }),
        });
      } else if (type === "cargos e salários") {
        response = await fetch("/api/bulk-import/career", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ career: data }),
        });
      }

      if (response.ok) {
        const result = await response.json();
        if (result.failed && result.failed.length > 0) {
          toast({
            variant: "destructive",
            title: "Erros na importação",
            description: (
              <div className="flex flex-col gap-2">
                {result.failed.map((error: any, index: number) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{error.employee || error.training || error.career}:</span> {error.error}
                  </div>
                ))}
              </div>
            )
          });
        } else {
          toast({
            title: "Sucesso",
            description: result.message || "Importação concluída com sucesso!"
          });
        }
      } else {
        const error = await response.json();
        toast({
          variant: "destructive",
          title: "Erro na importação",
          description: error.details || error.error || "Erro desconhecido ao processar o arquivo"
        });
      }
      
      setSelectedFile(null);
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao enviar arquivo"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Uploads</h2>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-4">
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Funcionários
          </TabsTrigger>
          <TabsTrigger value="medical-leaves" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Atestados
          </TabsTrigger>
          <TabsTrigger value="trainings" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Treinamentos
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cargos e Salários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Importar Funcionários</CardTitle>
              <CardDescription>
                Faça upload de um arquivo CSV com os dados dos funcionários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TemplateDownload type="employees" />
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="employees-file">Arquivo CSV</Label>
                  <Input
                    id="employees-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </div>
                <Button
                  onClick={() => handleUpload("funcionários")}
                  disabled={!selectedFile || isLoading}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  {isLoading ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical-leaves">
          <Card>
            <CardHeader>
              <CardTitle>Importar Atestados</CardTitle>
              <CardDescription>
                Faça upload de um arquivo CSV com os dados dos atestados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TemplateDownload type="medicalLeaves" />
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="medical-leaves-file">Arquivo CSV</Label>
                  <Input
                    id="medical-leaves-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </div>
                <Button
                  onClick={() => handleUpload("atestados")}
                  disabled={!selectedFile || isLoading}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  {isLoading ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainings">
          <Card>
            <CardHeader>
              <CardTitle>Importar Treinamentos</CardTitle>
              <CardDescription>
                Faça upload de um arquivo CSV com os dados dos treinamentos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TemplateDownload type="trainings" />
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="trainings-file">Arquivo CSV</Label>
                  <Input
                    id="trainings-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </div>
                <Button
                  onClick={() => handleUpload("treinamentos")}
                  disabled={!selectedFile || isLoading}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  {isLoading ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="career">
          <Card>
            <CardHeader>
              <CardTitle>Importar Alterações de Cargos e Salários</CardTitle>
              <CardDescription>
                Faça upload de um arquivo CSV com as alterações de cargos e salários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TemplateDownload type="career" />
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="career-file">Arquivo CSV</Label>
                  <Input
                    id="career-file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </div>
                <Button
                  onClick={() => handleUpload("cargos e salários")}
                  disabled={!selectedFile || isLoading}
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  {isLoading ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 