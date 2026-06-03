'use client';

import React, { useState } from 'react';
import { usePropertyStore, Property } from '@/lib/stores/property.store';
import { DataTable, Column } from '@/components/premium/data-table';
import { Modal } from '@/components/premium/modal';
import { FormInput } from '@/components/premium/form-input';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';

export default function PropertiesModule() {
  const properties = usePropertyStore((s) => s.getFilteredProperties());
  const selectProperty = usePropertyStore((s) => s.selectProperty);
  const selectedProperty = usePropertyStore((s) => s.selectedProperty);
  const addProperty = usePropertyStore((s) => s.addProperty);
  const updateProperty = usePropertyStore((s) => s.updateProperty);
  const deleteProperty = usePropertyStore((s) => s.deleteProperty);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Property>>({});

  const handleCreate = () => {
    setFormData({});
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    if (formData.name && formData.address && formData.type && formData.price) {
      if (selectedProperty) {
        updateProperty(selectedProperty.id, formData);
      } else {
        addProperty({
          id: Date.now().toString(),
          name: formData.name || '',
          address: formData.address || '',
          type: formData.type as any,
          price: formData.price || 0,
          occupancy: formData.occupancy || 0,
          tenants: 0,
          revenue: 0,
          expenses: 0,
          condition: 'good',
          lastInspection: new Date(),
          location: { lat: 0, lng: 0 },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      setIsCreateModalOpen(false);
      setFormData({});
    }
  };

  const columns: Column<Property>[] = [
    {
      key: 'name',
      label: 'Property Name',
      sortable: true,
      render: (value, item) => (
        <div>
          <p className="font-semibold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{item.address}</p>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 capitalize">
          {value}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Value',
      sortable: true,
      render: (value) => <span className="font-semibold text-gray-900">${(value / 1000).toFixed(0)}k</span>,
    },
    {
      key: 'occupancy',
      label: 'Occupancy',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-green-500"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="font-semibold text-gray-900">{value}%</span>
        </div>
      ),
    },
    {
      key: 'revenue',
      label: 'Monthly Revenue',
      sortable: true,
      render: (value) => <span className="font-semibold text-green-600">${(value / 1000).toFixed(0)}k</span>,
    },
    {
      key: 'condition',
      label: 'Condition',
      sortable: true,
      render: (value) => (
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${
          value === 'excellent' ? 'bg-green-100 text-green-700' :
          value === 'good' ? 'bg-blue-100 text-blue-700' :
          value === 'fair' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="mt-2 text-gray-600">Manage your real estate portfolio</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 font-semibold text-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <Plus className="h-5 w-5" />
            Add Property
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DataTable
            columns={columns}
            data={properties}
            onRowClick={(prop) => {
              selectProperty(prop);
              setFormData(prop);
              setIsDetailModalOpen(true);
            }}
          />
        </motion.div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={selectedProperty ? 'Edit Property' : 'Add New Property'}
        description="Fill in the details below to create or update a property"
        size="lg"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="flex-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 font-semibold text-white hover:shadow-lg transition-shadow"
            >
              {selectedProperty ? 'Update' : 'Create'}
            </motion.button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormInput
            label="Property Name"
            placeholder="e.g., Downtown Apartment Complex"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormInput
            label="Address"
            placeholder="e.g., 123 Main St, Downtown"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Type</label>
              <select
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
              >
                <option value="">Select type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>
            <FormInput
              label="Property Value"
              type="number"
              placeholder="0"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
          </div>
          <FormInput
            label="Monthly Rent"
            type="number"
            placeholder="0"
            value={formData.revenue || ''}
            onChange={(e) => setFormData({ ...formData, revenue: Number(e.target.value) })}
          />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedProperty?.name || 'Property Details'}
        size="lg"
      >
        {selectedProperty && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-semibold text-gray-900">{selectedProperty.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-semibold text-gray-900 capitalize">{selectedProperty.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property Value</p>
                <p className="font-semibold text-gray-900">${(selectedProperty.price / 1000).toFixed(0)}k</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Occupancy</p>
                <p className="font-semibold text-gray-900">{selectedProperty.occupancy}%</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
