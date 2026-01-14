import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  CreditCard, 
  Key, 
  Lock, 
  Globe,
  Save,
  X,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { api } from '../../../utils/app';
import AdminLoader from '../../../component/admin/AdminLoader';

const HandlePaymentGateway = () => {
  // Updated Admin Color Schema
  const colors = {
    primaryBlack: '#0A0A0A',
    pureWhite: '#FFFFFF',
    darkGray: '#1F2937',
    mediumGray: '#4B5563',
    lightGray: '#E5E7EB',
    softBackground: '#F3F4F6',
    accent: '#0A0A0A', // Using primary black as accent
    danger: '#DC2626',
    warning: '#D97706',
    success: '#059669'
  };

  // States
  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGateway, setEditingGateway] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    is_active: true
  });
  const [configs, setConfigs] = useState([]);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [configFormData, setConfigFormData] = useState({
    key_name: '',
    key_value: '',
    environment: 'test',
    is_active: true
  });
  const [editingConfig, setEditingConfig] = useState(null);
  const [showKey, setShowKey] = useState({});
  const [processing, setProcessing] = useState(false);

  // Fetch payment gateways
  useEffect(() => {
    fetchGateways();
  }, []);

  const fetchGateways = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/payment-gateways');
      if (response.data?.success) {
        setGateways(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch payment gateways:', error);
      alert('Failed to load payment gateways');
    } finally {
      setLoading(false);
    }
  };

  // Handle gateway form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleConfigInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfigFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditGateway = (gateway) => {
    setEditingGateway(gateway);
    setFormData({
      code: gateway.code,
      name: gateway.name,
      is_active: gateway.is_active === 1
    });
    setConfigs(gateway.configs || []);
    setShowForm(true);
  };

  const handleAddConfig = () => {
    setEditingConfig(null);
    setConfigFormData({
      key_name: '',
      key_value: '',
      environment: 'test',
      is_active: true
    });
    setShowConfigForm(true);
  };

  const handleEditConfig = (config) => {
    setEditingConfig(config);
    setConfigFormData({
      key_name: config.key_name,
      key_value: config.key_value,
      environment: config.environment,
      is_active: config.is_active === 1
    });
    setShowConfigForm(true);
  };

  const handleSubmitGateway = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const endpoint = editingGateway 
        ? `/admin/payment-gateways/${editingGateway.id}`
        : '/admin/payment-gateways';
      
      const method = editingGateway ? 'put' : 'post';
      
      const response = await api[method](endpoint, formData);
      
      if (response.data?.success) {
        alert(editingGateway ? 'Gateway updated successfully!' : 'Gateway added successfully!');
        setShowForm(false);
        setEditingGateway(null);
        setFormData({ code: '', name: '', is_active: true });
        fetchGateways();
      }
    } catch (error) {
      console.error('Failed to save gateway:', error);
      alert(error.response?.data?.message || 'Failed to save gateway');
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmitConfig = async (e) => {
    e.preventDefault();
    if (!editingGateway) {
      alert('Please save the gateway first');
      return;
    }

    setProcessing(true);
    try {
      const endpoint = editingConfig
        ? `/admin/payment-gateways/${editingGateway.id}/configs/${editingConfig.id}`
        : `/admin/payment-gateways/${editingGateway.id}/configs`;
      
      const method = editingConfig ? 'put' : 'post';
      
      const response = await api[method](endpoint, configFormData);
      
      if (response.data?.success) {
        alert(editingConfig ? 'Config updated successfully!' : 'Config added successfully!');
        setShowConfigForm(false);
        setEditingConfig(null);
        fetchGateways();
        
        // Update configs in state
        const updatedConfigs = editingConfig
          ? configs.map(c => c.id === editingConfig.id ? response.data.data : c)
          : [...configs, response.data.data];
        
        setConfigs(updatedConfigs);
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      alert(error.response?.data?.message || 'Failed to save config');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteGateway = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment gateway?')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/payment-gateways/${id}`);
      if (response.data?.success) {
        alert('Gateway deleted successfully!');
        fetchGateways();
      }
    } catch (error) {
      console.error('Failed to delete gateway:', error);
      alert('Failed to delete gateway');
    }
  };

  const handleDeleteConfig = async (configId) => {
    if (!editingGateway) return;
    
    if (!window.confirm('Are you sure you want to delete this configuration?')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/payment-gateways/${editingGateway.id}/configs/${configId}`);
      if (response.data?.success) {
        alert('Config deleted successfully!');
        
        // Update configs in state
        const updatedConfigs = configs.filter(c => c.id !== configId);
        setConfigs(updatedConfigs);
        fetchGateways();
      }
    } catch (error) {
      console.error('Failed to delete config:', error);
      alert('Failed to delete config');
    }
  };

  const toggleGatewayStatus = async (gateway) => {
    try {
      const response = await api.put(`/admin/payment-gateways/${gateway.id}/toggle-status`, {
        is_active: gateway.is_active === 0
      });
      
      if (response.data?.success) {
        fetchGateways();
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Failed to update status');
    }
  };

  const toggleConfigStatus = async (config) => {
    if (!editingGateway) return;
    
    try {
      const response = await api.put(`/admin/payment-gateways/${editingGateway.id}/configs/${config.id}/toggle-status`, {
        is_active: config.is_active === 0
      });
      
      if (response.data?.success) {
        // Update configs in state
        const updatedConfigs = configs.map(c => 
          c.id === config.id 
            ? { ...c, is_active: config.is_active === 0 ? 1 : 0 }
            : c
        );
        setConfigs(updatedConfigs);
        fetchGateways();
      }
    } catch (error) {
      console.error('Failed to toggle config status:', error);
      alert('Failed to update config status');
    }
  };

  if (loading) {
    return <AdminLoader />;
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.softBackground }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primaryBlack }}>
            Payment Gateway Management
          </h1>
          <p className="text-lg" style={{ color: colors.mediumGray }}>
            Manage payment gateways and their configurations
          </p>
        </div>

        {/* Add/Edit Gateway Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8" style={{ border: `1px solid ${colors.lightGray}` }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold" style={{ color: colors.primaryBlack }}>
                {editingGateway ? 'Edit Payment Gateway' : 'Add New Payment Gateway'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingGateway(null);
                  setFormData({ code: '', name: '', is_active: true });
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: colors.mediumGray }} />
              </button>
            </div>

            <form onSubmit={handleSubmitGateway} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                    Gateway Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                    style={{ 
                      borderColor: colors.lightGray,
                      backgroundColor: colors.softBackground,
                      color: colors.primaryBlack
                    }}
                    placeholder="e.g., razorpay, stripe, paypal"
                    disabled={editingGateway}
                  />
                  <p className="text-xs mt-1" style={{ color: colors.mediumGray }}>
                    Unique identifier (lowercase, no spaces)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                    Gateway Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                    style={{ 
                      borderColor: colors.lightGray,
                      backgroundColor: colors.softBackground,
                      color: colors.primaryBlack
                    }}
                    placeholder="e.g., Razorpay, Stripe, PayPal"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primaryBlack focus:ring-primaryBlack"
                  style={{ color: colors.primaryBlack }}
                />
                <label htmlFor="is_active" className="ml-2 text-sm" style={{ color: colors.primaryBlack }}>
                  Active
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="group flex items-center gap-2 px-6 py-3 rounded-lg font-medium border transition-all disabled:opacity-50"
                  style={{ 
                    backgroundColor: colors.primaryBlack,
                    borderColor: colors.primaryBlack,
                    color: colors.pureWhite
                  }}
                >
                  {processing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span className="group-hover:text-primaryBlack group-hover:bg-white">
                    {editingGateway ? 'Update Gateway' : 'Add Gateway'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="group px-6 py-3 rounded-lg font-medium border transition-all"
                  style={{ 
                    borderColor: colors.lightGray,
                    color: colors.primaryBlack,
                    backgroundColor: colors.pureWhite
                  }}
                >
                  <span className="group-hover:text-white">Cancel</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Add/Edit Config Form */}
        {showConfigForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8" style={{ border: `1px solid ${colors.lightGray}` }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold" style={{ color: colors.primaryBlack }}>
                {editingConfig ? 'Edit Configuration' : 'Add New Configuration'}
              </h2>
              <button
                onClick={() => setShowConfigForm(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: colors.mediumGray }} />
              </button>
            </div>

            <form onSubmit={handleSubmitConfig} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                  Key Name *
                </label>
                <input
                  type="text"
                  name="key_name"
                  value={configFormData.key_name}
                  onChange={handleConfigInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                  style={{ 
                    borderColor: colors.lightGray,
                    backgroundColor: colors.softBackground,
                    color: colors.primaryBlack
                  }}
                  placeholder="e.g., key_id, key_secret, api_key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                  Key Value *
                </label>
                <div className="relative">
                  <input
                    type={showKey[editingConfig?.id || 'new'] ? 'text' : 'password'}
                    name="key_value"
                    value={configFormData.key_value}
                    onChange={handleConfigInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none pr-12 transition-all"
                    style={{ 
                      borderColor: colors.lightGray,
                      backgroundColor: colors.softBackground,
                      color: colors.primaryBlack
                    }}
                    placeholder="Enter secret key value"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(prev => ({ 
                      ...prev, 
                      [editingConfig?.id || 'new']: !prev[editingConfig?.id || 'new'] 
                    }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showKey[editingConfig?.id || 'new'] ? (
                      <EyeOff className="w-5 h-5" style={{ color: colors.mediumGray }} />
                    ) : (
                      <Eye className="w-5 h-5" style={{ color: colors.mediumGray }} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                  Environment *
                </label>
                <select
                  name="environment"
                  value={configFormData.environment}
                  onChange={handleConfigInputChange}
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                  style={{ 
                    borderColor: colors.lightGray,
                    backgroundColor: colors.softBackground,
                    color: colors.primaryBlack
                  }}
                >
                  <option value="test">Test</option>
                  <option value="production">Production</option>
                  <option value="sandbox">Sandbox</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="config_is_active"
                  name="is_active"
                  checked={configFormData.is_active}
                  onChange={handleConfigInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-primaryBlack focus:ring-primaryBlack"
                  style={{ color: colors.primaryBlack }}
                />
                <label htmlFor="config_is_active" className="ml-2 text-sm" style={{ color: colors.primaryBlack }}>
                  Active
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="group flex items-center gap-2 px-6 py-3 rounded-lg font-medium border transition-all disabled:opacity-50"
                  style={{ 
                    backgroundColor: colors.primaryBlack,
                    borderColor: colors.primaryBlack,
                    color: colors.pureWhite
                  }}
                >
                  {processing ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span className="group-hover:text-primaryBlack">
                    {editingConfig ? 'Update Config' : 'Add Config'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowConfigForm(false)}
                  className="group px-6 py-3 rounded-lg font-medium border transition-all"
                  style={{ 
                    borderColor: colors.lightGray,
                    color: colors.primaryBlack,
                    backgroundColor: colors.pureWhite
                  }}
                >
                  <span className="group-hover:text-white">Cancel</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gateways List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold" style={{ color: colors.primaryBlack }}>
              Payment Gateways ({gateways.length})
            </h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingGateway(null);
                setFormData({ code: '', name: '', is_active: true });
              }}
              className="group flex items-center gap-2 px-4 py-3 rounded-lg font-medium border transition-all"
              style={{ 
                backgroundColor: colors.primaryBlack,
                borderColor: colors.primaryBlack,
                color: colors.pureWhite
              }}
            >
              <Plus className="w-5 h-5" />
              <span className="group-hover:text-primaryBlack">Add Gateway</span>
            </button>
          </div>

          <div className="grid gap-6">
            {gateways.map((gateway) => (
              <div 
                key={gateway.id} 
                className="bg-white rounded-xl shadow p-6 transition-all hover:shadow-lg"
                style={{ border: `1px solid ${colors.lightGray}` }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.primaryBlack}10` }}>
                      <CreditCard className="w-6 h-6" style={{ color: colors.primaryBlack }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold" style={{ color: colors.primaryBlack }}>
                          {gateway.name}
                        </h3>
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: gateway.is_active ? `${colors.success}20` : `${colors.danger}20`,
                            color: gateway.is_active ? colors.success : colors.danger
                          }}
                        >
                          {gateway.code}
                        </span>
                      </div>
                      <p className="text-sm mt-1" style={{ color: colors.mediumGray }}>
                        Created: {new Date(gateway.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleGatewayStatus(gateway)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all"
                      style={{ 
                        backgroundColor: gateway.is_active ? colors.pureWhite : colors.darkGray,
                        borderColor: gateway.is_active ? colors.success : colors.danger,
                        color: gateway.is_active ? colors.success : colors.pureWhite
                      }}
                    >
                      {gateway.is_active ? (
                        <ToggleRight className="w-5 h-5" />
                      ) : (
                        <ToggleLeft className="w-5 h-5" />
                      )}
                      {gateway.is_active ? 'Active' : 'Inactive'}
                    </button>

                    <button
                      onClick={() => handleEditGateway(gateway)}
                      className="group p-2 rounded-lg border transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        color: colors.primaryBlack
                      }}
                    >
                      <Edit className="w-5 h-5 group-hover:text-white" />
                    </button>

                    <button
                      onClick={() => handleDeleteGateway(gateway.id)}
                      className="group p-2 rounded-lg border transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        color: colors.primaryBlack
                      }}
                    >
                      <Trash2 className="w-5 h-5 group-hover:text-white" />
                    </button>
                  </div>
                </div>

                {/* Configurations Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium" style={{ color: colors.primaryBlack }}>
                      Configurations ({gateway.configs?.length || 0})
                    </h4>
                    <button
                      onClick={() => {
                        handleEditGateway(gateway);
                        setTimeout(() => handleAddConfig(), 100);
                      }}
                      className="flex items-center gap-1 text-sm px-3 py-2 rounded-lg border transition-all"
                      style={{ 
                        backgroundColor: colors.pureWhite,
                        borderColor: colors.lightGray,
                        color: colors.primaryBlack
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Config
                    </button>
                  </div>

                  {gateway.configs?.length > 0 ? (
                    <div className="space-y-3">
                      {gateway.configs.map((config) => (
                        <div 
                          key={config.id} 
                          className="flex justify-between items-center p-4 rounded-lg border transition-all hover:bg-gray-50"
                          style={{ borderColor: colors.lightGray }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded" style={{ backgroundColor: `${colors.primaryBlack}10` }}>
                              <Key className="w-4 h-4" style={{ color: colors.primaryBlack }} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium" style={{ color: colors.primaryBlack }}>
                                  {config.key_name}
                                </span>
                                <span 
                                  className="px-2 py-0.5 text-xs rounded-full"
                                  style={{ 
                                    backgroundColor: config.environment === 'production' ? `${colors.danger}10` : `${colors.warning}10`,
                                    color: config.environment === 'production' ? colors.danger : colors.warning
                                  }}
                                >
                                  {config.environment}
                                </span>
                              </div>
                              <p className="text-xs mt-1" style={{ color: colors.mediumGray }}>
                                {config.is_active === 1 ? 'Active' : 'Inactive'} • Updated: {new Date(config.updated_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleConfigStatus(config)}
                              className={`p-1 rounded border transition-all ${config.is_active === 1 ? 'text-green-600 border-green-600' : 'text-gray-400 border-gray-400'}`}
                            >
                              {config.is_active === 1 ? (
                                <ToggleRight className="w-5 h-5" />
                              ) : (
                                <ToggleLeft className="w-5 h-5" />
                              )}
                            </button>

                            <button
                              onClick={() => {
                                handleEditGateway(gateway);
                                setTimeout(() => handleEditConfig(config), 100);
                              }}
                              className="group p-1 rounded border transition-all"
                              style={{ 
                                borderColor: colors.lightGray,
                                color: colors.primaryBlack
                              }}
                            >
                              <Edit className="w-4 h-4 group-hover:text-white" />
                            </button>

                            <button
                              onClick={() => {
                                handleEditGateway(gateway);
                                setTimeout(() => handleDeleteConfig(config.id), 100);
                              }}
                              className="group p-1 rounded border transition-all"
                              style={{ 
                                borderColor: colors.lightGray,
                                color: colors.primaryBlack
                              }}
                            >
                              <Trash2 className="w-4 h-4 group-hover:text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-lg" style={{ borderColor: colors.lightGray }}>
                      <Lock className="w-12 h-12 mx-auto mb-3" style={{ color: colors.mediumGray }} />
                      <p style={{ color: colors.mediumGray }}>No configurations added yet</p>
                      <button
                        onClick={() => {
                          handleEditGateway(gateway);
                          setTimeout(() => handleAddConfig(), 100);
                        }}
                        className="mt-3 text-sm font-medium hover:underline"
                        style={{ color: colors.primaryBlack }}
                      >
                        Add your first configuration
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {gateways.length === 0 && (
            <div className="text-center py-16">
              <Globe className="w-16 h-16 mx-auto mb-4" style={{ color: colors.mediumGray }} />
              <h3 className="text-lg font-medium mb-2" style={{ color: colors.primaryBlack }}>
                No Payment Gateways Found
              </h3>
              <p className="mb-6" style={{ color: colors.mediumGray }}>
                Start by adding your first payment gateway
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="group flex items-center gap-2 px-6 py-3 rounded-lg font-medium border mx-auto transition-all"
                style={{ 
                  backgroundColor: colors.primaryBlack,
                  borderColor: colors.primaryBlack,
                  color: colors.pureWhite
                }}
              >
                <Plus className="w-5 h-5" />
                <span className="group-hover:text-primaryBlack">Add First Gateway</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandlePaymentGateway;