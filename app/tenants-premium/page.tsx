"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { DashboardShell } from "@/components/premium/DashboardShell";
import { PremiumCard, CardHeader, CardTitle, CardDescription } from "@/components/premium/PremiumCard";
import { StatsCard } from "@/components/premium/StatsCard";
import { PremiumButton } from "@/components/premium/PremiumButton";
import { Input } from "@/components/premium/Input";
import { Modal } from "@/components/premium/Modal";
import { DataTable } from "@/components/premium/DataTable";
import { usePropertyStore } from "@/lib/stores/propertyStore";

export default function TenantsPage() {
  const { tenants, addTenant, properties } = usePropertyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    rentAmount: 0,
    leasedFrom: "",
    leasedTo: "",
    propertyId: properties[0]?.id || "",
    status: "active" as const,
  });

  const filteredTenants = tenants.filter(
    (t) =>
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTenants = tenants.filter((t) => t.status === "active").length;
  const totalRent = tenants.reduce((sum, t) => sum + t.rentAmount, 0);
  const averageRent = tenants.length > 0 ? totalRent / tenants.length : 0;

  const handleAddTenant = () => {
    if (formData.firstName && formData.email && formData.propertyId) {
      addTenant({
        ...formData,
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        rentAmount: 0,
        leasedFrom: "",
        leasedTo: "",
        propertyId: properties[0]?.id || "",
        status: "active",
      });
      setIsModalOpen(false);
    }
  };

  const tenantColumns = [
    { key: "firstName" as const, label: "Prénom", width: "120px", sortable: true },
    { key: "lastName" as const, label: "Nom", width: "120px", sortable: true },
    { 
      key: "email" as const, 
      label: "Email", 
      width: "180px",
      render: (v: string) => (
        <a href={`mailto:${v}`} className="text-blue-600 hover:underline">
          {v}
        </a>
      )
    },
    { 
      key: "phone" as const, 
      label: "Téléphone", 
      width: "120px",
      render: (v: string) => (
        <a href={`tel:${v}`} className="text-blue-600 hover:underline">
          {v}
        </a>
      )
    },
    { 
      key: "rentAmount" as const, 
      label: "Loyer", 
      width: "100px",
      sortable: true,
      render: (v: number) => `${v.toLocaleString()} FCFA`
    },
    {
      key: "status" as const,
      label: "Statut",
      width: "100px",
      render: (v: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          v === "active"
            ? "bg-green-100 text-green-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {v === "active" ? "Actif" : "Inactif"}
        </span>
      ),
    },
  ];

  return (
    <DashboardShell>
      <motion.div className="space-y-8 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Locataires</h1>
              <p className="mt-2 text-gray-600">Gérez tous vos locataires</p>
            </div>
            <PremiumButton
              variant="primary"
              size="lg"
              icon={<Plus size={20} />}
              onClick={() => setIsModalOpen(true)}
            >
              Ajouter Locataire
            </PremiumButton>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <StatsCard
              title="Locataires Actifs"
              value={activeTenants}
              change={5}
              trend="up"
              variant="success"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <StatsCard
              title="Loyer Total"
              value={`${(totalRent / 1000000).toFixed(1)}M`}
              change={8}
              trend="up"
              variant="primary"
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <StatsCard
              title="Loyer Moyen"
              value={`${(averageRent / 1000000).toFixed(1)}M`}
              description="Par locataire"
              variant="info"
            />
          </motion.div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {/* Tenants Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <PremiumCard
            header={
              <CardHeader>
                <CardTitle>Locataires ({filteredTenants.length})</CardTitle>
                <CardDescription>Liste de tous vos locataires</CardDescription>
              </CardHeader>
            }
            padding="lg"
          >
            {filteredTenants.length > 0 ? (
              <DataTable columns={tenantColumns} data={filteredTenants} striped hoverable />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucun locataire trouvé</p>
              </div>
            )}
          </PremiumCard>
        </motion.div>

        {/* Add Tenant Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Ajouter un Locataire"
          description="Enregistrez un nouveau locataire"
          size="lg"
          footer={
            <div className="flex gap-3">
              <PremiumButton variant="ghost" fullWidth onClick={() => setIsModalOpen(false)}>
                Annuler
              </PremiumButton>
              <PremiumButton variant="primary" fullWidth onClick={handleAddTenant}>
                Ajouter
              </PremiumButton>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                placeholder="Ex: Jean"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <Input
                label="Nom"
                placeholder="Ex: Dupont"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="jean@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Téléphone"
              placeholder="+237 6XX XXX XXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Propriété</label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500"
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              >
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label="Loyer (FCFA)"
              type="number"
              value={formData.rentAmount}
              onChange={(e) => setFormData({ ...formData, rentAmount: parseInt(e.target.value) })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date de début"
                type="date"
                value={formData.leasedFrom}
                onChange={(e) => setFormData({ ...formData, leasedFrom: e.target.value })}
              />
              <Input
                label="Date de fin"
                type="date"
                value={formData.leasedTo}
                onChange={(e) => setFormData({ ...formData, leasedTo: e.target.value })}
              />
            </div>
          </div>
        </Modal>
      </motion.div>
    </DashboardShell>
  );
}
