"use client";

export const dynamic = "force-dynamic";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin } from "lucide-react";

const properties = [
  { id: 1, name: "Appartement 3BR - Douala", location: "Douala", tenants: 2, price: "250,000 FCFA", occupancy: "Occupée", image: "🏢" },
  { id: 2, name: "Villa - Yaoundé", location: "Yaoundé", tenants: 4, price: "450,000 FCFA", occupancy: "Occupée", image: "🏠" },
  { id: 3, name: "Studio - Bafoussam", location: "Bafoussam", tenants: 0, price: "150,000 FCFA", occupancy: "Libre", image: "🏘️" },
  { id: 4, name: "Immeuble - Kinshasa", location: "Kinshasa", tenants: 6, price: "800,000 FCFA", occupancy: "Occupée", image: "🏗️" },
];

export default function PropertiesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Propriétés</h1>
            <p className="text-muted mt-1">Gestion de tous vos immeubles et appartements</p>
          </div>
          <Button className="gap-2">
            <Plus size={18} />
            Ajouter une propriété
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {properties.map((property) => (
            <Card key={property.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="text-3xl">{property.image}</div>
                  <Badge variant={property.occupancy === "Occupée" ? "success" : "warning"}>
                    {property.occupancy}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-primary">{property.name}</h3>
                  <p className="text-sm text-muted flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {property.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 py-2 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-muted">Locataires</p>
                    <p className="font-semibold text-primary">{property.tenants}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted">Loyer/mois</p>
                    <p className="font-semibold text-success text-sm">{property.price}</p>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  Détails
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
