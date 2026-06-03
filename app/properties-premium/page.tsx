"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { DashboardShell } from "@/components/premium/DashboardShell";
import { PremiumCard, CardHeader, CardTitle, CardDescription } from "@/components/premium/PremiumCard";
import { PremiumButton } from "@/components/premium/PremiumButton";
import { Input } from "@/components/premium/Input";
import { Modal } from "@/components/premium/Modal";
import { DataTable } from "@/components/premium/DataTable";
import { usePropertyStore } from "@/lib/stores/propertyStore";

export default function PropertiesPage() {
  const { properties, addProperty, updateProperty, deleteProperty } = usePropertyStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    type: "apartment" as const,
    purchasePrice: 0,
    currentValue: 0,
    area: 0,
    rooms: 0,
  });

  const filteredProperties = properties.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProperty = () => {
    if (formData.name && formData.address) {
      addProperty({
        ...formData,
        acquired: new Date().toISOString().split("T")[0],
        description: "",
        status: "available",
      });
      setFormData({
        name: "",
        address: "",
        city: "",
        type: "apartment",
        purchasePrice: 0,
        currentValue: 0,
        area: 0,
        rooms: 0,
      });
      setIsModalOpen(false);
    }
  };

  const propertyColumns = [
    { key: "name" as const, label: "Nom", width: "180px", sortable: true },
    { key: "address" as const, label: "Adresse", width: "200px" },
    { key: "city" as const, label: "Ville", width: "120px" },
    {
      key: "type" as const,
      label: "Type",
      width: "110px",
      render: (v: string) => {
        const types: Record<string, string> = {
          apartment: "Appartement",
          house: "Maison",
          commercial: "Commercial",
          land: "Terrain",
        };
        return types[v] || v;
      },
    },
    {
      key: "currentValue" as const,
      label: "Valeur",
      width: "120px",
      sortable: true,
      render: (v: number) => `${(v / 1000000).toFixed(1)}M`,
    },
    {
      key: "status" as const,
      label: "Statut",
      width: "110px",
      render: (v: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          v === "occupied" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
        }`}>
          {v === "occupied" ? "Occupée" : "Libre"}
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
              <h1 className="text-3xl font-bold text-gray-900">Propriétés</h1>
              <p className="mt-2 text-gray-600">Gérez votre portefeuille immobilier</p>
            </div>
            <PremiumButton
              variant="primary"
              size="lg"
              icon={<Plus size={20} />}
              onClick={() => setIsModalOpen(true)}
            >
              Ajouter Propriété
            </PremiumButton>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Input
            placeholder="Rechercher par nom ou ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<span>🔍</span>}
          />
        </motion.div>

        {/* Properties Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <PremiumCard
            header={
              <CardHeader>
                <CardTitle>Propriétés ({filteredProperties.length})</CardTitle>
                <CardDescription>Liste de toutes vos propriétés</CardDescription>
              </CardHeader>
            }
            padding="lg"
          >
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all"
                    whileHover={{ translateY: -4 }}
                  >
                    {property.imageUrl && (
                      <img
                        src={property.imageUrl}
                        alt={property.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-bold text-gray-900">{property.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{property.address}</p>
                    <p className="text-xs text-gray-500">{property.city}</p>

                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Valeur:</span>
                        <span className="font-semibold">{(property.currentValue / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Surface:</span>
                        <span className="font-semibold">{property.area}m²</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <PremiumButton variant="ghost" size="sm" fullWidth>
                        <Eye size={16} />
                      </PremiumButton>
                      <PremiumButton variant="ghost" size="sm" fullWidth>
                        <Edit size={16} />
                      </PremiumButton>
                      <PremiumButton variant="ghost" size="sm" fullWidth>
                        <Trash2 size={16} />
                      </PremiumButton>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Aucune propriété trouvée</p>
              </div>
            )}
          </PremiumCard>
        </motion.div>

        {/* Add Property Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Ajouter une Propriété"
          description="Remplissez les détails de votre nouvelle propriété"
          size="lg"
          footer={
            <div className="flex gap-3">
              <PremiumButton variant="ghost" fullWidth onClick={() => setIsModalOpen(false)}>
                Annuler
              </PremiumButton>
              <PremiumButton variant="primary" fullWidth onClick={handleAddProperty}>
                Ajouter
              </PremiumButton>
            </div>
          }
        >
          <div className="space-y-4">
            <Input
              label="Nom de la propriété"
              placeholder="Ex: Villa Prestige"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Adresse"
              placeholder="Ex: 123 Rue de l'Indépendance"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
            <Input
              label="Ville"
              placeholder="Ex: Yaoundé"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 focus:border-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="apartment">Appartement</option>
                  <option value="house">Maison</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Terrain</option>
                </select>
              </div>
              <Input
                label="Pièces"
                type="number"
                value={formData.rooms}
                onChange={(e) => setFormData({ ...formData, rooms: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Surface (m²)"
                type="number"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: parseInt(e.target.value) })}
              />
              <Input
                label="Valeur Actuelle (FCFA)"
                type="number"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </Modal>
      </motion.div>
    </DashboardShell>
  );
}
