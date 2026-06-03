"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Building2, Users, DollarSign, Zap, Shield, Cloud } from "lucide-react";
import { PremiumButton } from "@/components/premium/PremiumButton";
import { PremiumCard } from "@/components/premium/PremiumCard";

export default function PremiumIndex() {
  const modules = [
    {
      name: "Tableau de Bord",
      description: "Vue d'ensemble complète avec analytics en temps réel",
      href: "/dashboard-premium",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Propriétés",
      description: "Gérez votre portefeuille immobilier avec détails avancés",
      href: "/properties-premium",
      icon: Building2,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Locataires",
      description: "Gestion complète des locataires et contrats",
      href: "/tenants-premium",
      icon: Users,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Finances",
      description: "Suivi des revenus, dépenses et paiements",
      href: "/finance-premium",
      icon: DollarSign,
      color: "from-amber-500 to-orange-500",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Performance Premium",
      description: "Interface ultra-rapide optimisée pour les Web Vitals",
    },
    {
      icon: Shield,
      title: "Sécurité Enterprise",
      description: "Authentification sécurisée et chiffrement des données",
    },
    {
      icon: Cloud,
      title: "Scalabilité",
      description: "Architecture cloud-ready pour gérer votre croissance",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            ImmoGestion Premium
          </h1>
          <div className="flex gap-4">
            <PremiumButton variant="ghost" size="sm">
              Documentation
            </PremiumButton>
            <PremiumButton variant="primary" size="sm">
              Connexion
            </PremiumButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="text-center space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight"
          >
            La Plateforme Immobilière
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Digne de la Silicon Valley
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Gérez votre portefeuille immobilier avec des outils enterprise-grade, des analytics avancées et une expérience utilisateur premium.
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center gap-4 pt-6">
            <PremiumButton variant="primary" size="lg" icon={<ArrowRight size={20} />}>
              Démarrer
            </PremiumButton>
            <PremiumButton variant="outline" size="lg">
              En savoir plus
            </PremiumButton>
          </motion.div>
        </motion.div>
      </section>

      {/* Modules Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-gradient-to-b from-transparent to-gray-50 -mx-6 px-6">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-center text-gray-900"
          >
            Modules Puissants
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <motion.a
                  key={module.name}
                  href={module.href}
                  variants={itemVariants}
                  whileHover={{ translateY: -8 }}
                  className="group"
                >
                  <PremiumCard variant="interactive" padding="lg">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {module.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                      Accéder <ArrowRight size={16} />
                    </div>
                  </PremiumCard>
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-center text-gray-900"
          >
            Caractéristiques Enterprise
          </motion.h2>

          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  className="text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-12 text-center space-y-6 text-white"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 variants={itemVariants} className="text-4xl font-bold">
            Prêt à transformer votre activité immobilière ?
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg opacity-90">
            Rejoignez les propriétaires qui ont adopté la gestion immobilière premium
          </motion.p>
          <motion.div variants={itemVariants}>
            <PremiumButton
              variant="primary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Commencer Gratuitement
            </PremiumButton>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>© 2024 ImmoGestion Premium. Tous droits réservés.</p>
          <p className="mt-2 text-sm">
            Construit avec React, Next.js, Tailwind CSS et Zustand
          </p>
        </div>
      </footer>
    </div>
  );
}
