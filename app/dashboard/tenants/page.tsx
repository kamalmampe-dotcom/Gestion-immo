"use client";

export const dynamic = "force-dynamic";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, Mail, Calendar } from "lucide-react";

const tenants = [
  { id: 1, name: "Jean Kamdem", property: "Appartement 3BR", phone: "+237 6 00 00 00 00", email: "jean@example.com", startDate: "2022-01-15", status: "Actif" },
  { id: 2, name: "Marie Nkomo", property: "Villa - Yaoundé", phone: "+237 6 11 11 11 11", email: "marie@example.com", startDate: "2023-06-01", status: "Actif" },
  { id: 3, name: "Pierre Diouf", property: "Villa - Yaoundé", phone: "+237 6 22 22 22 22", email: "pierre@example.com", startDate: "2023-09-20", status: "Actif" },
];

export default function TenantsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Locataires</h1>
            <p className="text-muted mt-1">Gérez tous vos locataires et leurs informations</p>
          </div>
          <Button className="gap-2">
            <Plus size={18} />
            Ajouter un locataire
          </Button>
        </div>

        <div className="space-y-4">
          {tenants.map((tenant) => (
            <Card key={tenant.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{tenant.name}</CardTitle>
                    <p className="text-sm text-muted mt-1">{tenant.property}</p>
                  </div>
                  <Badge variant="success">{tenant.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-accent" />
                  <span>{tenant.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-accent" />
                  <span className="truncate">{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-accent" />
                  <span>Depuis {tenant.startDate}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Éditer
                  </Button>
                  <Button variant="outline" size="sm">
                    Détails
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
