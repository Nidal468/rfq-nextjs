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
import { 
  Package, 
  MapPin, 
  DollarSign, 
  Building, 
  Phone, 
  Mail,
  Calendar,
  Award,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { SupplierGroupType } from "@/model/supplier";

export default function Home() {
  const [rfqData, setRfqData] = useState<SupplierGroupType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      try {
        // In a real app, you would fetch from your API or database
        // const response = await fetch('/api/rfq');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData: SupplierGroupType[] = [
          {
            _id: "1",
            naicsCode: "541611",
            naicsDescription: "Computer Systems Design Services",
            pscCode: "B300",
            pscDescription: "Computer and Data Processing Services",
            solicitationNumber: "SBA-2023-0001",
            contractType: "BOA",
            agency: "Department of Defense",
            subAgency: "Army Contracting Command",
            majorCommand: "US Army",
            placeOfPerformance: "Fort Bragg, NC",
            deliveryDate: "2024-06-30",
            smallBusinessOnly: true,
            suppliers: [
              {
                internalId: 1,
                recipientName: "Tech Solutions Inc.",
                recipientUEI: "ABC123456789",
                contact: [
                  {
                    companyName: "Tech Solutions Inc.",
                    uei: "ABC123456789",
                    email: "contact@techsolutions.com",
                    phone: "(555) 123-4567"
                  }
                ],
                location: {
                  countryCode: "US",
                  countryName: "United States",
                  stateCode: "NC",
                  stateName: "North Carolina",
                  cityName: "Raleigh",
                  countyCode: "055",
                  countyName: "Wake County",
                  addressLine1: "123 Tech Street",
                  addressLine2: "Suite 100",
                  congressionalCode: "01",
                  zip4: "1234",
                  zip5: "27601"
                },
                awardAmount: 500000,
                awardId: "AWD-2023-001",
                naics: {
                  code: "541611",
                  description: "Computer Systems Design Services"
                },
                psc: {
                  code: "B300",
                  description: "Computer and Data Processing Services"
                },
                generatedInternalId: "SUP-001"
              }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            _id: "2",
            naicsCode: "541611",
            naicsDescription: "Computer Systems Design Services",
            pscCode: "B300",
            pscDescription: "Computer and Data Processing Services",
            solicitationNumber: "SBA-2023-0002",
            contractType: "FSS",
            agency: "Department of Homeland Security",
            subAgency: "Cybersecurity and Infrastructure Security Agency",
            majorCommand: "CISA",
            placeOfPerformance: "Washington, DC",
            deliveryDate: "2024-09-30",
            smallBusinessOnly: false,
            suppliers: [
              {
                internalId: 2,
                recipientName: "Secure Systems LLC",
                recipientUEI: "XYZ987654321",
                contact: [
                  {
                    companyName: "Secure Systems LLC",
                    uei: "XYZ987654321",
                    email: "info@securesystems.com",
                    phone: "(555) 987-6543"
                  }
                ],
                location: {
                  countryCode: "US",
                  countryName: "United States",
                  stateCode: "DC",
                  stateName: "District of Columbia",
                  cityName: "Washington",
                  countyCode: "001",
                  countyName: "District of Columbia",
                  addressLine1: "456 Security Avenue",
                  congressionalCode: "01",
                  zip4: "5678",
                  zip5: "20001"
                },
                awardAmount: 1250000,
                awardId: "AWD-2023-002",
                naics: {
                  code: "541611",
                  description: "Computer Systems Design Services"
                },
                psc: {
                  code: "B300",
                  description: "Computer and Data Processing Services"
                },
                generatedInternalId: "SUP-002"
              }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        
        setRfqData(mockData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching RFQ data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            Review and manage solicitations
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rfqData.map((rfq, index) => (
            <motion.div
              key={rfq._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        {rfq.solicitationNumber}
                      </CardTitle>
                      <CardDescription className="mt-1 text-slate-600 dark:text-slate-400">
                        {rfq.contractType}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={rfq.smallBusinessOnly ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {rfq.smallBusinessOnly ? "Small Business Only" : "Open to All"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {rfq.agency}
                      </p>
                      {rfq.subAgency && (
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {rfq.subAgency}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Target className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {rfq.pscDescription}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        PSC: {rfq.pscCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {rfq.placeOfPerformance}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Delivery Date
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {new Date(rfq.deliveryDate!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Award Amount
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        ${rfq.suppliers[0].awardAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                      Primary Supplier
                    </h3>
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {rfq.suppliers[0].recipientName}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {rfq.suppliers[0].naics.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="inline-flex items-center text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded">
                        <Mail className="h-3 w-3 mr-1" />
                        {rfq.suppliers[0].contact[0].email}
                      </span>
                      <span className="inline-flex items-center text-xs bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-1 rounded">
                        <Phone className="h-3 w-3 mr-1" />
                        {rfq.suppliers[0].contact[0].phone}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {rfqData.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Card className="max-w-md mx-auto bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg border-slate-200 dark:border-slate-700">
              <CardContent className="py-8">
                <p className="text-slate-600 dark:text-slate-400">
                  No RFQs found. Please check back later.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
