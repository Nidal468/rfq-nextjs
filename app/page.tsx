// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  MapPin,
  DollarSign,
  Building,
  Phone,
  Mail,
  Calendar,
  Award,
  Target,
  ChevronDown,
  ChevronUp,
  Filter,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SupplierGroupType } from "@/model/supplier";

export default function Home() {
  const [rfqData, setRfqData] = useState<SupplierGroupType[]>([]);
  const [loading, setLoading] = useState(true);
  const [naics, setNaics] = useState("");
  const [psc, setPsc] = useState("");
  const [agency, setAgency] = useState("");
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(0);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});
  const [filteredData, setFilteredData] = useState<SupplierGroupType[]>([]);

  // API fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/supplier?naics=${naics}&psc=${psc}&agency=${agency}&limit=${limit}&page=${page}`, {
          method: "GET",
          cache: "no-store"
        });
        
        if (res.ok) {
          const result = await res.json();
          setRfqData(result.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching RFQ data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [naics, psc, agency, limit, page]);

  // Apply filters
  useEffect(() => {
    let filtered = [...rfqData];
    
    if (naics) {
      filtered = filtered.filter(rfq => 
        rfq.naicsCode.includes(naics) || 
        rfq.naicsDescription.toLowerCase().includes(naics.toLowerCase())
      );
    }
    
    if (psc) {
      filtered = filtered.filter(rfq => 
        rfq.pscCode.includes(psc) || 
        rfq.pscDescription.toLowerCase().includes(psc.toLowerCase())
      );
    }
    
    if (agency) {
      filtered = filtered.filter(rfq => 
        rfq.agency.toLowerCase().includes(agency.toLowerCase()) ||
        (rfq.subAgency && rfq.subAgency.toLowerCase().includes(agency.toLowerCase()))
      );
    }
    
    setFilteredData(filtered);
  }, [naics, psc, agency, rfqData]);

  const toggleSource = (source: string) => {
    setExpandedSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };

  const getSourceCount = (source: string) => {
    return filteredData.filter(rfq => rfq.source === source).length;
  };

  const groupedRfqs = () => {
    const sources = [...new Set(filteredData.map(rfq => rfq.source))];
    return sources.map(source => ({
      source,
      rfqs: filteredData.filter(rfq => rfq.source === source)
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="h-12 w-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Loading RFQ data...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8 text-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
          >
            RFQ Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-slate-600 dark:text-slate-400"
          >
            Review and manage solicitations by source
          </motion.p>
        </div>

        {/* Filters Section */}
        <Card className="mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Filter by NAICS code or description..."
                  value={naics}
                  onChange={(e) => setNaics(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Filter by PSC code or description..."
                  value={psc}
                  onChange={(e) => setPsc(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Filter by agency or sub-agency..."
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setNaics("");
                  setPsc("");
                  setAgency("");
                }}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Source Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {groupedRfqs().map((group) => (
            <motion.div
              key={group.source}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-md"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{group.source}</h3>
                <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  {getSourceCount(group.source)} RFQs
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {group.rfqs.length > 0 
                  ? `${group.rfqs[0].naicsDescription} • ${group.rfqs[0].pscDescription}` 
                  : "No data available"}
              </p>
            </motion.div>
          ))}
        </div>

        {/* RFQ Rows */}
        <div className="space-y-6">
          {groupedRfqs().map((group) => (
            <motion.div
              key={group.source}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div 
                className="flex justify-between items-center p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-slate-200 dark:border-slate-700 rounded-lg shadow-md cursor-pointer"
                onClick={() => toggleSource(group.source)}
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{group.source}</h2>
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                    {group.rfqs.length} RFQs
                  </Badge>
                </div>
                {expandedSources[group.source] ? (
                  <ChevronUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                )}
              </div>
              
              <AnimatePresence>
                {expandedSources[group.source] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    {/* RFQ Rows */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Solicitation</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Agency</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">PSC</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Place of Performance</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Delivery Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Award Amount</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Supplier</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                          {group.rfqs.map((rfq, index) => (
                            <motion.tr 
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Award className="h-5 w-5 text-slate-600 dark:text-slate-300 mr-2" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{rfq.solicitationNumber}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{rfq.contractType}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Building className="h-5 w-5 text-slate-600 dark:text-slate-300 mr-2" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{rfq.agency}</div>
                                    {rfq.subAgency && (
                                      <div className="text-sm text-slate-500 dark:text-slate-400">{rfq.subAgency}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Target className="h-5 w-5 text-slate-600 dark:text-slate-300 mr-2" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{rfq.pscDescription}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">PSC: {rfq.pscCode}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <MapPin className="h-5 w-5 text-slate-600 dark:text-slate-300 mr-2" />
                                  <div className="text-sm text-slate-900 dark:text-slate-100">{rfq.placeOfPerformance}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-300 mr-2" />
                                  <div className="text-sm text-slate-900 dark:text-slate-100">
                                    {rfq.deliveryDate ? new Date(rfq.deliveryDate).toLocaleDateString() : "Not specified"}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <DollarSign className="h-5 w-5 text-slate-600 dark:text-slate-300 mr-2" />
                                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    ${rfq.suppliers[0].awardAmount.toLocaleString()}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Package className="h-5 w-5 text-slate-600 dark:text-slate-300 mr-2" />
                                  <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{rfq.suppliers[0].recipientName}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{rfq.suppliers[0].naics.description}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col gap-1">
                                  <span className="inline-flex items-center text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {rfq.suppliers[0].contact[0].email}
                                  </span>
                                  <span className="inline-flex items-center text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded">
                                    <Phone className="h-3 w-3 mr-1" />
                                    {rfq.suppliers[0].contact[0].phone}
                                  </span>
                                </div>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {filteredData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Card className="max-w-md mx-auto bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-slate-200 dark:border-slate-700">
              <CardContent className="py-8">
                <p className="text-slate-600 dark:text-slate-400">
                  No RFQs found matching your filters. Try adjusting your search criteria.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
