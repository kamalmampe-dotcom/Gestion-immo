"use client";

export const dynamic = "force-dynamic";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, User } from "lucide-react";

const contracts = [
  {
    id: 1,
    title: "Contrat Jean Kamdem",
    tenant: "Jean Kamdem",
    property: "Appartement 3BR",
    startDate: "2022-01-15",
    endDate: "2024-01-14",
    status: "Expiré",
    duration: "24 mois",
  },
  {
    id: 2,
    title: "Contrat Marie Nkomo",
    tenant: "Marie Nkomo",
    property: "Villa - Yaoundé",
    startDate: "2023-06-01",
    endDate: "2025-06-01",
    status: "Actif",
    duration: "24 mois",
  },
  {
    id: 3,
    title: "Contrat Pierre Diouf",
    tenant: "Pierre Diouf",
    property: "Villa - Yaoundé",
    startDate: "2023-09-20",
    endDate: "2026-09-20",
    status: "Actif",
    duration: "36 mois",
  },
  {
    id: 4,
    title: "Contrat Propriété Studio BSM",
    tenant: "À louer",
    property: "Studio - Bafoussam",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "Libre",
    duration: "12 mois",
  },
];

export default function ContractsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Contrats</h1>
            <p className="text-muted mt-1">Gestion de tous vos contrats de location</p>
          </div>
          <Button className="gap-2">
            <Plus size={18} />
            Créer un contrat
          </Button>
        </div>

        <div className="space-y-3">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText size={20} className="text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{contract.title}</CardTitle>
                      <CardDescription>{contract.property}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      contract.status === "Actif"
                        ? "success"
                        : contract.status === "Expiré"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {contract.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted" />
                    <div className="text-sm">
                      <p className="text-xs text-muted">Locataire</p>
                      <p className="font-medium text-primary">{contract.tenant}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted" />
                    <div className="text-sm">
                      <p className="text-xs text-muted">Durée</p>
                      <p className="font-medium text-primary">{contract.duration}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-muted">Début</p>
                    <p className="font-medium text-primary">{contract.startDate}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-muted">Fin</p>
                    <p className="font-medium text-primary">{contract.endDate}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    Afficher
                  </Button>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm">
                    Télécharger PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
