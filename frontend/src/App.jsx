import React, { useState, useEffect, useCallback } from 'react';
import {
  createUserV1,
  createUserV2,
  createUserV3,
  getUsersV1,
  getUsersV2,
  getUsersV3,
} from './services/api';
import Button from './components/Button';
import Input from './components/Input';
import Card from './components/Card';

const VERSION_CONFIG = {
  v1: {
    label: 'Version 1',
    postEndpoint: 'POST /api/v1/users',
    getEndpoint: 'GET /api/v1/users',
    schema: 'name, email',
  },
  v2: {
    label: 'Version 2',
    postEndpoint: 'POST /api/v2/users',
    getEndpoint: 'GET /api/v2/users',
    schema: 'firstName, lastName, email',
  },
  v3: {
    label: 'Version 3',
    postEndpoint: 'POST /api/v3/users',
    getEndpoint: 'GET /api/v3/users',
    schema: 'fullName, email, age, phone',
  },
};

function App() {
  const [v1Users, setV1Users] = useState([]);
  const [v2Users, setV2Users] = useState([]);
  const [v3Users, setV3Users] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('v3');
  const [deprecationNotice, setDeprecationNotice] = useState('');
  
  const [v1FormData, setV1FormData] = useState({ name: '', email: '' });
  const [v2FormData, setV2FormData] = useState({ firstName: '', lastName: '', email: '' });
  const [v3FormData, setV3FormData] = useState({ fullName: '', email: '', age: '', phone: '' });

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchUsers = useCallback(async () => {
    try {
      const [v1Res, v2Res, v3Res] = await Promise.all([
        getUsersV1(),
        getUsersV2(),
        getUsersV3(),
      ]);

      setV1Users(v1Res.data.data || []);
      setV2Users(v2Res.data.data || []);
      setV3Users(v3Res.data.data || []);

      const selectedResponse = {
        v1: v1Res,
        v2: v2Res,
        v3: v3Res,
      }[selectedVersion];

      const isDeprecated = String(selectedResponse.headers?.deprecation || '').toLowerCase() === 'true';
      if (isDeprecated) {
        const successor = selectedResponse.headers?.['x-api-successor-version'] || '/api/v3/users';
        setDeprecationNotice(`⚠️ ${selectedVersion.toUpperCase()} is deprecated. Please use ${successor}.`);
      } else {
        setDeprecationNotice('');
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  }, [selectedVersion]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleV1Submit = async (e) => {
    e.preventDefault();
    try {
      await createUserV1(v1FormData);
      setV1FormData({ name: '', email: '' });
      fetchUsers();
      alert("V1 User Created!");
    } catch {
      alert("Error creating V1 user");
    }
  };

  const handleV2Submit = async (e) => {
    e.preventDefault();
    try {
      await createUserV2(v2FormData);
      setV2FormData({ firstName: '', lastName: '', email: '' });
      fetchUsers();
      alert("V2 User Created!");
    } catch {
      alert("Error creating V2 user");
    }
  };

  const handleV3Submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...v3FormData,
        age: v3FormData.age === '' ? null : Number(v3FormData.age),
      };
      await createUserV3(payload);
      setV3FormData({ fullName: '', email: '', age: '', phone: '' });
      fetchUsers();
      alert("V3 User Created!");
    } catch {
      alert("Error creating V3 user");
    }
  };

  const activeUsers = selectedVersion === 'v1' ? v1Users : selectedVersion === 'v2' ? v2Users : v3Users;
  const activeMeta = VERSION_CONFIG[selectedVersion];

  return (
    <div className={`min-h-screen p-8 transition-colors duration-300 bg-cream dark:bg-dark-bg`}>
      <header className="max-w-6xl mx-auto mb-12 text-center relative">
        <div className="absolute right-0 top-0">
            <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full bg-dark-green text-cream dark:bg-cream dark:text-dark-green font-bold text-sm shadow-lg transition-transform hover:scale-105"
            >
                {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
        </div>
        <h1 className="text-5xl font-bold text-dark-green dark:text-cream mb-4 transition-colors">API Versioning System</h1>
        <p className="text-xl text-dark-green/80 dark:text-cream/80 transition-colors">Demonstrating Backward Compatibility & Evolution</p>

        <div className="mt-8 max-w-md mx-auto text-left">
          <label htmlFor="version-selector" className="block text-dark-green dark:text-cream font-bold mb-2">
            Select Version
          </label>
          <select
            id="version-selector"
            value={selectedVersion}
            onChange={(e) => setSelectedVersion(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-dark-green/20 dark:border-cream/20 bg-white/80 dark:bg-black/30 text-dark-green dark:text-cream font-semibold"
          >
            <option value="v1">v1</option>
            <option value="v2">v2</option>
            <option value="v3">v3</option>
          </select>
        </div>

        {deprecationNotice && (
          <div className="mt-6 max-w-3xl mx-auto rounded-xl border border-terracotta bg-terracotta/10 px-4 py-3 text-left text-dark-green dark:text-cream font-semibold">
            {deprecationNotice}
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-8">
          <Card title={`${activeMeta.label} API`} className={`border-t-8 ${selectedVersion === 'v1' ? 'border-terracotta' : selectedVersion === 'v2' ? 'border-mustard' : 'border-dark-green'}`}>
            {selectedVersion === 'v1' && (
              <form onSubmit={handleV1Submit}>
                <Input
                  label="Full Name"
                  name="name"
                  value={v1FormData.name}
                  onChange={(e) => setV1FormData({ ...v1FormData, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={v1FormData.email}
                  onChange={(e) => setV1FormData({ ...v1FormData, email: e.target.value })}
                  required
                />
                <Button type="submit" variant="primary" className="w-full">Create V1 User</Button>
              </form>
            )}

            {selectedVersion === 'v2' && (
              <form onSubmit={handleV2Submit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={v2FormData.firstName}
                    onChange={(e) => setV2FormData({ ...v2FormData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={v2FormData.lastName}
                    onChange={(e) => setV2FormData({ ...v2FormData, lastName: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={v2FormData.email}
                  onChange={(e) => setV2FormData({ ...v2FormData, email: e.target.value })}
                  required
                />
                <Button type="submit" variant="secondary" className="w-full">Create V2 User</Button>
              </form>
            )}

            {selectedVersion === 'v3' && (
              <form onSubmit={handleV3Submit}>
                <Input
                  label="Full Name"
                  name="fullName"
                  value={v3FormData.fullName}
                  onChange={(e) => setV3FormData({ ...v3FormData, fullName: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={v3FormData.email}
                  onChange={(e) => setV3FormData({ ...v3FormData, email: e.target.value })}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Age"
                    name="age"
                    type="number"
                    value={v3FormData.age}
                    onChange={(e) => setV3FormData({ ...v3FormData, age: e.target.value })}
                    placeholder="Optional"
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={v3FormData.phone}
                    onChange={(e) => setV3FormData({ ...v3FormData, phone: e.target.value })}
                    placeholder="Optional"
                  />
                </div>
                <Button type="submit" variant="outline" className="w-full">Create V3 User</Button>
              </form>
            )}

            <div className="mt-5 rounded-lg bg-dark-green/5 dark:bg-cream/5 p-4 space-y-2 text-sm">
              <div className="font-semibold text-dark-green dark:text-cream">API Endpoints</div>
              <div className="font-mono text-dark-green/80 dark:text-cream/80">{activeMeta.postEndpoint}</div>
              <div className="font-mono text-dark-green/80 dark:text-cream/80">{activeMeta.getEndpoint}</div>
              <div className="text-dark-green/70 dark:text-cream/70">Schema: {activeMeta.schema}</div>
            </div>
          </Card>

          <Card title={`${selectedVersion.toUpperCase()} User Summary`}>
            <div className="rounded-lg bg-dark-green/5 dark:bg-cream/5 p-4 space-y-2 text-sm">
              <div className="text-dark-green dark:text-cream font-semibold">
                Total records: {activeUsers.length}
              </div>
              <div className="text-dark-green/70 dark:text-cream/70">
                Raw user details are hidden for all versions.
              </div>
            </div>
          </Card>
        </section>

        <section className="space-y-8">
          <Card title="Version Comparison">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-dark-green/20 dark:border-cream/20">
                    <th className="py-2 pr-4 text-dark-green dark:text-cream">Version</th>
                    <th className="py-2 pr-4 text-dark-green dark:text-cream">Fields</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dark-green/10 dark:border-cream/10">
                    <td className="py-2 pr-4 font-semibold">v1</td>
                    <td className="py-2 pr-4">name, email</td>
                  </tr>
                  <tr className="border-b border-dark-green/10 dark:border-cream/10">
                    <td className="py-2 pr-4 font-semibold">v2</td>
                    <td className="py-2 pr-4">firstName, lastName, email</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-semibold">v3</td>
                    <td className="py-2 pr-4">fullName, email, age, phone</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

        </section>
      </main>
    </div>
  );
}

export default App;
