"use client";

export const dynamic = "force-dynamic";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

const statuses = [
  {
    name: "À signaler",
    color: "bg-gray-50",
    claims: [
      { id: 1, title: "Fissure plafond", property: "Studio - Bafoussam", priority: "warning" },
    ],
  },
  {
    name: "En cours",
    color: "bg-blue-50",
    claims: [
      { id: 2, title: "Plomberie endommagée", property: "Appartement 3BR", priority: "alert" },
      { id: 3, title: "Porte cassée", property: "Villa - Yaoundé", priority: "warning" },
    ],
  },
  {
    name: "Résolu",
    color: "bg-green-50",
    claims: [
      { id: 4, title: "Peinture murs", property: "Studio - Bafoussam", priority: "success" },
      { id: 5, title: "Électricité réparée", property: "Immeuble - Kinshasa", priority: "success" },
    ],
  },
];

export default function ClaimsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Sinistres & Réparations</h1>
            <p className="text-muted mt-1">Suivi des dégâts et réparations immobilières</p>
          </div>
          <Button className="gap-2">
            <Plus size={18} />
            Signaler un sinistre
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statuses.map((status) => (
            <div key={status.name} className={`${status.color} rounded-lg p-4 space-y-3`}>
              <h3 className="font-semibold text-primary">{status.name}</h3>
              <div className="space-y-2">
                {status.claims.map((claim) => (
                  <Card key={claim.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-sm text-primary">{claim.title}</h4>
                        <Badge
                          variant={
                            claim.priority === "alert"
                              ? "destructive"
                              : claim.priority === "warning"
                              ? "warning"
                              : "success"
                          }
                          className="text-xs"
                        >
                          {claim.priority === "alert" ? "Urgent" : claim.priority === "warning" ? "Moyen" : "Fait"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted">{claim.property}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
