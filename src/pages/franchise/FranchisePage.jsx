import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
  Award,
  Building,
  CheckCircle,
  BarChart,
  Target,
  Globe,
  Phone,
  Mail,
  MessageSquare,
  ChevronRight,
  Download,
  FileText,
  Calendar,
  HelpCircle,
  Star,
  Zap,
  Leaf,
  Battery,
  Sun,
  Wrench,
  Headphones,
  CreditCard,
  PieChart,
} from "lucide-react";
import SolarFranchise from "../../component/landingpage/SolarFranchise";

const FranchisePage = () => {
  const [franchiseData, setFranchiseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  useEffect(() => {
    fetchFranchiseData();
  }, []);

  const fetchFranchiseData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData = {
        tagline: "Limited Franchise Opportunities",
        title: "Own Your Solar",
        highlighted_text: "Energy Business",
        description: `
          <p class="text-lg text-gray-300 mb-4">
            Join India's fastest-growing solar energy franchise network. With over <span class="font-bold text-green-400">500+ successful franchises</span> across the country, we're expanding our reach to empower entrepreneurs like you.
          </p>
          
        `,
        video_url: "https://example.com/franchise-video.mp4",
        pdf_url: "/franchise-brochure.pdf",
      };
      setFranchiseData(mockData);
    } catch (error) {
      console.error("Error fetching franchise data:", error);
    } finally {
      setLoading(false);
    }
  };

  const franchiseStats = [
    { icon: <MapPin className="w-8 h-8" />, value: "500+", label: "Franchises Across India" },
    { icon: <TrendingUp className="w-8 h-8" />, value: "₹2.5Cr+", label: "Average Annual Revenue" },
    { icon: <Users className="w-8 h-8" />, value: "85%", label: "Success Rate" },
    { icon: <Award className="w-8 h-8" />, value: "15+", label: "Industry Awards" },
  ];

  const investmentDetails = [
    { title: "Minimum Investment", amount: "₹5 Lakhs", icon: <CreditCard className="w-6 h-6" /> },
    { title: "Expected ROI", amount: "20-30% Annually", icon: <PieChart className="w-6 h-6" /> },
    { title: "Break-even Period", amount: "12-18 Months", icon: <Calendar className="w-6 h-6" /> },
    { title: "Franchise Fee", amount: "₹0 (Limited Time)", icon: <DollarSign className="w-6 h-6" /> },
  ];

  const supportFeatures = [
    { icon: <Wrench className="w-6 h-6" />, title: "Technical Training", description: "2-week intensive training program" },
    { icon: <Headphones className="w-6 h-6" />, title: "24/7 Support", description: "Dedicated support team" },
    { icon: <BarChart className="w-6 h-6" />, title: "Marketing Tools", description: "Digital & offline marketing kits" },
    { icon: <Shield className="w-6 h-6" />, title: "Quality Assurance", description: "Regular quality audits" },
  ];

  const productPortfolio = [
    { icon: <Sun className="w-6 h-6" />, name: "Solar Panels", categories: ["Residential", "Commercial", "Industrial"] },
    { icon: <Battery className="w-6 h-6" />, name: "Solar Inverters", categories: ["On-grid", "Off-grid", "Hybrid"] },
    { icon: <Leaf className="w-6 h-6" />, name: "Solar Water Heaters", categories: ["Domestic", "Commercial"] },
    { icon: <Zap className="w-6 h-6" />, name: "Solar Street Lights", categories: ["Government", "Private Sector"] },
  ];

  const successStories = [
    {
      name: "Rajesh Sharma",
      location: "Surat, Gujarat",
      duration: "2 Years",
      revenue: "₹1.8 Cr/Year",
      testimonial: "From zero to market leader in just 18 months. The support system is incredible!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Priya Patel",
      location: "Indore, MP",
      duration: "3 Years",
      revenue: "₹2.5 Cr/Year",
      testimonial: "Best decision of my life. The training and ongoing support made all the difference.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
  ];

  const faqs = [
    {
      question: "What is the minimum investment required?",
      answer: "The minimum investment starts from ₹5 lakhs, which includes inventory, training, and initial setup costs.",
    },
    {
      question: "Do I need technical experience in solar?",
      answer: "No, we provide comprehensive training covering technical, sales, and business management aspects.",
    },
    {
      question: "What territories are available?",
      answer: "We have exclusive territories available across India. Contact us to check availability in your region.",
    },
    {
      question: "How long does the training program last?",
      answer: "Our intensive training program lasts 2 weeks, followed by ongoing support and quarterly refreshers.",
    },
    {
      question: "What kind of marketing support do you provide?",
      answer: "We provide digital marketing tools, lead generation support, local marketing materials, and co-branded campaigns.",
    },
  ];

  const tabContent = {
    overview: (
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Why Choose Our Franchise?</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                "Proven business model with 85% success rate",
                "Zero franchise fee for limited time",
                "Comprehensive technical & sales training",
                "Marketing and lead generation support",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                "Exclusive territory rights",
                "Regular product updates",
                "24/7 technical support",
                "High profit margins (20-35%)",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    investment: (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Investment Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-4">Initial Investment</h4>
            <div className="space-y-4">
              {[
                { item: "Franchise Fee", amount: "₹0" },
                { item: "Security Deposit", amount: "₹1,00,000" },
                { item: "Initial Inventory", amount: "₹3,00,000" },
                { item: "Training & Setup", amount: "₹50,000" },
                { item: "Marketing Kit", amount: "₹50,000" },
              ].map((cost, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">{cost.item}</span>
                  <span className="font-semibold text-white">{cost.amount}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-green-400 mb-4">Expected Returns</h4>
            <div className="space-y-4">
              {[
                { period: "Months 1-6", revenue: "₹3-5 Lakhs/Month" },
                { period: "Months 7-12", revenue: "₹8-12 Lakhs/Month" },
                { period: "Year 2", revenue: "₹15-20 Lakhs/Month" },
                { period: "Year 3+", revenue: "₹20-25 Lakhs/Month" },
              ].map((returnItem, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-300">{returnItem.period}</span>
                  <span className="font-semibold text-green-400">{returnItem.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    process: (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-8">Application Process</h3>
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 to-blue-500"></div>
          {[
            {
              step: 1,
              title: "Initial Inquiry",
              description: "Submit application form or contact our franchise team",
              duration: "1-2 Days",
            },
            {
              step: 2,
              title: "Documentation Review",
              description: "Background check and document verification",
              duration: "3-5 Days",
            },
            {
              step: 3,
              title: "Personal Interview",
              description: "Virtual or in-person meeting with franchise manager",
              duration: "1 Day",
            },
            {
              step: 4,
              title: "Territory Finalization",
              description: "Discussion and finalization of exclusive territory",
              duration: "2-3 Days",
            },
            {
              step: 5,
              title: "Agreement & Training",
              description: "Sign franchise agreement and begin training program",
              duration: "2 Weeks",
            },
          ].map((step, index) => (
            <div key={index} className="relative flex items-start mb-8 ml-12">
              <div className="absolute -left-12 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <span className="font-bold text-white">{step.step}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-2">{step.title}</h4>
                <p className="text-gray-300 mb-2">{step.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{step.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1A2F] pt-20">
      {/* Hero Section from SolarFranchise component */}
      {franchiseData && <SolarFranchise franchiseInfo={franchiseData} />}

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {franchiseStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-center border border-gray-800"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 mb-4">
                <div className="text-green-400">{stat.icon}</div>
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Details */}
      <div className="max-w-7xl bg-[#0A1A2F] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Investment <span className="text-green-400">Details</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Transparent investment structure with high return potential
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {investmentDetails.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 hover:border-green-500/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 mb-4">
                <div className="text-green-400">{item.icon}</div>
              </div>
              <div className="text-2xl font-bold text-white mb-2">{item.amount}</div>
              <div className="text-gray-400">{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-1 mb-8">
          <div className="flex flex-wrap gap-1">
            {["overview", "investment", "process"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {tabContent[activeTab]}
      </div>

      {/* Product Portfolio */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Product <span className="text-green-400">Portfolio</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Comprehensive range of solar products for all market segments
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productPortfolio.map((product, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 hover:border-green-500/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 mb-4">
                <div className="text-green-400">{product.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{product.name}</h3>
              <div className="space-y-2">
                {product.categories.map((category, catIndex) => (
                  <div key={catIndex} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500" />
                    <span className="text-gray-400">{category}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Support Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Franchise <span className="text-green-400">Support</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            End-to-end support system for your business success
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-800 hover:border-green-500/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 mb-4">
                <div className="text-green-400">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Success <span className="text-green-400">Stories</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from our successful franchise partners across India
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {successStories.map((story, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white">{story.name}</h3>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{story.location}</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 italic">"{story.testimonial}"</p>
              <div className="flex justify-between items-center pt-6 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">{story.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-white">{story.revenue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-green-400">Questions</span>
          </h2>
          <p className="text-gray-400">Find answers to common questions about our franchise program</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-green-500" />
                  <span className="text-lg font-medium text-white text-left">{faq.question}</span>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedFAQ === index ? "rotate-90" : ""
                  }`}
                />
              </button>
              {expandedFAQ === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-300 pl-8">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-green-500/10 rounded-3xl p-8 md:p-12 text-center border border-gray-800">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-blue-500 mb-6">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Solar Business?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Join 500+ successful entrepreneurs who have transformed their future with our franchise program.
            Limited territories available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('franchise')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
            >
              Apply Now
            </button>
            <button className="px-8 py-3 border-2 border-gray-700 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-300">
              Download Brochure
            </button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>Call: 1800-123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>Email: franchise@iqenergies.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FranchisePage;