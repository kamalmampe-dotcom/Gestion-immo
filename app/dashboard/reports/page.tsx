"use client";

export const dynamic = "force-dynamic";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileText } from "lucide-react";

const reports = [
  {
    id: 1,
    title: "Rapport d'activité - Juin 2024",
    description: "Bilan complet de tous les revenus et dépenses du mois",
    date: "2024-07-01",
    status: "Disponible",
  },
  {
    id: 2,
    title: "Rapport d'occupation - Q2 2024",
    description: "Analyse du taux d'occupation par trimestre",
    date: "2024-07-01",
    status: "Disponible",
  },
  {
    id: 3,
    title: "Rapport financier - 2024",
    description: "Synthèse annuelle des revenus, charges et rentabilité",
    date: "À venir",
    status: "Génération en cours",
  },
];

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Rapports</h1>
            <p className="text-muted mt-1">Générez et téléchargez vos rapports d'activité</p>
          </div>
          <Button className="gap-2">
            <Plus size={18} />
            Générer un rapport
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText size={24} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Généré le: {report.date}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      report.status === "Disponible"
                        ? "bg-green-50 text-success"
                        : "bg-blue-50 text-accent"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
                {report.status === "Disponible" && (
                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2" size="sm">
                      <Download size={16} />
                      PDF
                    </Button>
                    <Button variant="outline" className="flex-1" size="sm">
                      Excel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
