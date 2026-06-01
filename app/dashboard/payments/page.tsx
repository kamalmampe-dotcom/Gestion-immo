"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, User, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

const payments = [
  {
    id: 1,
    tenant: "Jean Kamdem",
    property: "Appartement 3BR",
    amount: 250000,
    dueDate: "2024-06-01",
    paidDate: "2024-06-03",
    status: "Payé",
  },
  {
    id: 2,
    tenant: "Marie Nkomo",
    property: "Villa - Yaoundé",
    amount: 450000,
    dueDate: "2024-06-05",
    paidDate: null,
    status: "En retard",
  },
  {
    id: 3,
    tenant: "Pierre Diouf",
    property: "Villa - Yaoundé",
    amount: 450000,
    dueDate: "2024-07-01",
    paidDate: null,
    status: "À venir",
  },
  {
    id: 4,
    tenant: "Jean Kamdem",
    property: "Appartement 3BR",
    amount: 250000,
    dueDate: "2024-07-01",
    paidDate: null,
    status: "À venir",
  },
];

export default function PaymentsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Paiements</h1>
            <p className="text-muted mt-1">Suivi des revenus et encaissements</p>
          </div>
          <Button className="gap-2">
            <Plus size={18} />
            Enregistrer paiement
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Total attendu ce mois</p>
                  <p className="text-2xl font-bold text-primary mt-1">2.45M FCFA</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Paiements reçus</p>
                  <p className="text-2xl font-bold text-success mt-1">800K FCFA</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">En retard</p>
                  <p className="text-2xl font-bold text-alert mt-1">450K FCFA</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="text-alert" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des paiements</CardTitle>
            <CardDescription>Tous les paiements prévus et effectués</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User size={16} className="text-muted" />
                      <p className="font-medium text-primary">{payment.tenant}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted" />
                      <p className="text-sm text-muted">{payment.property}</p>
                    </div>
                  </div>

                  <div className="text-right mr-4">
                    <p className="font-bold text-lg text-primary">{payment.amount.toLocaleString()} FCFA</p>
                    <p className="text-xs text-muted">Échéance: {payment.dueDate}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        payment.status === "Payé"
                          ? "success"
                          : payment.status === "En retard"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {payment.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
