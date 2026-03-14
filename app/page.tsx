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
  Search,
  Users,
  User,
  ExternalLink
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
  const [expandedRfq, setExpandedRfq] = useState<Record<string, boolean>>({});
  const [expandedSuppliers, setExpandedSuppliers] = useState<Record<string, Record<string, boolean>>>({});

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

  const toggleRfq = (solicitationNumber: string) => {
    setExpandedRfq(prev => ({
      ...prev,
      [solicitationNumber]: !prev[solicitationNumber]
    }));
  };

  const toggleSupplier = (solicitationNumber: string, supplierId: string) => {
    setExpandedSuppliers(prev => ({
      ...prev,
      [solicitationNumber]: {
        ...prev[solicitationNumber],
        [supplierId]: !prev[solicitationNumber]?.[supplierId]
      }
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
          <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading RFQ data...</p>
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
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
          >
            RFQ Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-slate-600 dark:text-slate-400"
          >
            Manage and track solicitations by source
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
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Source Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {groupedRfqs().map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{group.source}</h3>
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
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

        {/* RFQ List */}
        <div className="space-y-6">
          {groupedRfqs().map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div 
                className="flex justify-between items-center p-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-slate-200 dark:border-slate-700 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => toggleSource(group.source)}
              >
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{group.source}</h2>
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
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
                    className="mt-4 overflow-hidden"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-md">
                      {group.rfqs.map((rfq, rfqIndex) => (
                        <div key={rfqIndex} className="border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                          <div 
                            className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            onClick={() => toggleRfq(rfq.solicitationNumber)}
                          >
                            <div className="flex items-start gap-3">
                              <Award className="h-6 w-6 text-blue-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <h3 className="font-medium text-slate-900 dark:text-slate-100">{rfq.solicitationNumber}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {rfq.agency}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                    {rfq.contractType}
                                  </Badge>
                                  <Badge variant="outline" className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                                    {rfq.pscDescription}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                {new Date(rfq.createdAt).toLocaleDateString()}
                              </span>
                              <ChevronDown 
                                className={`h-5 w-5 text-slate-600 dark:text-slate-400 transition-transform ${expandedRfq[rfq.solicitationNumber] ? 'rotate-180' : ''}`} 
                              />
                            </div>
                          </div>
                          
                          <AnimatePresence>
                            {expandedRfq[rfq.solicitationNumber] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700">
                                  {/* RFQ Details */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">RFQ Information</h4>
                                      <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                          <Building className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Agency</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{rfq.agency}</p>
                                          </div>
                                        </div>
                                        
                                        {rfq.subAgency && (
                                          <div className="flex items-start gap-2">
                                            <Building className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                              <p className="text-xs text-slate-500 dark:text-slate-400">Sub-Agency</p>
                                              <p className="text-sm text-slate-700 dark:text-slate-300">{rfq.subAgency}</p>
                                            </div>
                                          </div>
                                        )}
                                        
                                        <div className="flex items-start gap-2">
                                          <MapPin className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Place of Performance</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{rfq.placeOfPerformance || "Not specified"}</p>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-2">
                                          <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Delivery Date</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                              {rfq.deliveryDate ? new Date(rfq.deliveryDate).toLocaleDateString() : "Not specified"}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3">Financial Details</h4>
                                      <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                          <DollarSign className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">NAICS Code</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{rfq.naicsCode} - {rfq.naicsDescription}</p>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-2">
                                          <Target className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">PSC Code</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{rfq.pscCode} - {rfq.pscDescription}</p>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-2">
                                          <Package className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                                          <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Contract Type</p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">{rfq.contractType}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Suppliers Section */}
                                  <div>
                                    <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                                      <Users className="h-4 w-4" />
                                      Suppliers ({rfq.suppliers.length})
                                    </h4>
                                    
                                    {rfq.suppliers.map((supplier, supplierIndex) => (
                                      <div 
                                        key={supplierIndex} 
                                        className="border border-slate-200 dark:border-slate-700 rounded-lg mb-3"
                                      >
                                        <div 
                                          className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                          onClick={() => toggleSupplier(rfq.solicitationNumber, supplier.generatedInternalId)}
                                        >
                                          <div className="flex items-center gap-3">
                                            <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                                            <div>
                                              <h5 className="font-medium text-slate-900 dark:text-slate-100">{supplier.recipientName}</h5>
                                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {supplier.recipientUEI || "No UEI"}
                                              </p>
                                            </div>
                                          </div>
                                          <ChevronDown 
                                            className={`h-5 w-5 text-slate-600 dark:text-slate-400 transition-transform ${expandedSuppliers[rfq.solicitationNumber]?.[supplier.generatedInternalId] ? 'rotate-180' : ''}`} 
                                          />
                                        </div>
                                        
                                        <AnimatePresence>
                                          {expandedSuppliers[rfq.solicitationNumber]?.[supplier.generatedInternalId] && (
                                            <motion.div
                                              initial={{ opacity: 0, height: 0 }}
                                              animate={{ opacity: 1, height: "auto" }}
                                              exit={{ opacity: 0, height: 0 }}
                                              transition={{ duration: 0.2 }}
                                              className="p-3 bg-slate-50 dark:bg-slate-700/30 border-t border-slate-200 dark:border-slate-700"
                                            >
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                  <h6 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Contact Information</h6>
                                                  <div className="space-y-2">
                                                    {supplier.contact.map((contact, contactIndex) => (
                                                      <div key={contactIndex}>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{contact.companyName || "Company Name"}</p>
                                                        {contact.email && (
                                                          <div className="flex items-center gap-2 mt-1">
                                                            <Mail className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                                                            <span className="text-sm text-slate-700 dark:text-slate-300">{contact.email}</span>
                                                          </div>
                                                        )}
                                                        {contact.phone && (
                                                          <div className="flex items-center gap-2 mt-1">
                                                            <Phone className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                                                            <span className="text-sm text-slate-700 dark:text-slate-300">{contact.phone}</span>
                                                          </div>
                                                        )}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                                
                                                <div>
                                                  <h6 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Location</h6>
                                                  <div className="space-y-2">
                                                    <div className="flex items-start gap-2">
                                                      <MapPin className="h-3 w-3 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                                        {supplier.location.addressLine1 || "Address not provided"}
                                                      </span>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                      <MapPin className="h-3 w-3 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                                                      <span className="text-sm text-slate-700 dark:text-slate-300">
                                                        {supplier.location.cityName}, {supplier.location.stateName} {supplier.location.zip5}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              
                                              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                                                <div className="flex items-center justify-between">
                                                  <div>
                                                    <h6 className="font-medium text-slate-800 dark:text-slate-200">Award Details</h6>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                                      Award ID: {supplier.awardId}
                                                    </p>
                                                  </div>
                                                  <div className="text-right">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Award Amount</p>
                                                    <p className="font-medium text-slate-900 dark:text-slate-100">
                                                      ${supplier.awardAmount.toLocaleString()}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
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
