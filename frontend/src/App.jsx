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
    accent: 'u-border-v1',
  },
  v2: {
    label: 'Version 2',
    postEndpoint: 'POST /api/v2/users',
    getEndpoint: 'GET /api/v2/users',
    schema: 'firstName, lastName, email',
    accent: 'u-border-v2',
  },
  v3: {
    label: 'Version 3',
    postEndpoint: 'POST /api/v3/users',
    getEndpoint: 'GET /api/v3/users',
    schema: 'fullName, email, age, phone',
    accent: 'u-border-v3',
  },
};

function App() {
  const [v1Users, setV1Users] = useState([]);
  const [v2Users, setV2Users] = useState([]);
  const [v3Users, setV3Users] = useState([]);
  const [rawResponses, setRawResponses] = useState({ v1: null, v2: null, v3: null });
  const [selectedVersion, setSelectedVersion] = useState('v3');
  const [rawViewVersion, setRawViewVersion] = useState('v3');
  const [viewMode, setViewMode] = useState('split');
  const [copiedVersion, setCopiedVersion] = useState('');
  const [deprecationNotice, setDeprecationNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [v1FormData, setV1FormData] = useState({ name: '', email: '' });
  const [v2FormData, setV2FormData] = useState({ firstName: '', lastName: '', email: '' });
  const [v3FormData, setV3FormData] = useState({ fullName: '', email: '', age: '', phone: '' });

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const [v1Res, v2Res, v3Res] = await Promise.all([
        getUsersV1(),
        getUsersV2(),
        getUsersV3(),
      ]);

      setV1Users(v1Res.data.data || []);
      setV2Users(v2Res.data.data || []);
      setV3Users(v3Res.data.data || []);
      setRawResponses({
        v1: v1Res.data || null,
        v2: v2Res.data || null,
        v3: v3Res.data || null,
      });

      const selectedResponse = {
        v1: v1Res,
        v2: v2Res,
        v3: v3Res,
      }[selectedVersion];

      const isDeprecated = String(selectedResponse.headers?.deprecation || '').toLowerCase() === 'true';
      if (isDeprecated) {
        const successor = selectedResponse.headers?.['x-api-successor-version'] || '/api/v3/users';
        setDeprecationNotice(`${selectedVersion.toUpperCase()} is deprecated. Use ${successor}.`);
      } else {
        setDeprecationNotice('');
      }
    } catch (error) {
      console.error('Error fetching users', error);
      setErrorMessage('Unable to fetch users at the moment.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedVersion]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setRawViewVersion(selectedVersion);
  }, [selectedVersion]);

  const handleV1Submit = async (e) => {
    e.preventDefault();
    try {
      await createUserV1(v1FormData);
      setV1FormData({ name: '', email: '' });
      fetchUsers();
      alert('V1 user created.');
    } catch {
      alert('Error creating V1 user');
    }
  };

  const handleV2Submit = async (e) => {
    e.preventDefault();
    try {
      await createUserV2(v2FormData);
      setV2FormData({ firstName: '', lastName: '', email: '' });
      fetchUsers();
      alert('V2 user created.');
    } catch {
      alert('Error creating V2 user');
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
      alert('V3 user created.');
    } catch {
      alert('Error creating V3 user');
    }
  };

  const activeUsers = selectedVersion === 'v1' ? v1Users : selectedVersion === 'v2' ? v2Users : v3Users;
  const activeMeta = VERSION_CONFIG[selectedVersion];
  const activeRawResponse = rawResponses[rawViewVersion];

  const handleCopyRawJson = async () => {
    if (!activeRawResponse || !navigator?.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify(activeRawResponse, null, 2));
      setCopiedVersion(rawViewVersion);
      setTimeout(() => setCopiedVersion(''), 1500);
    } catch (error) {
      console.error('Failed to copy raw JSON:', error);
    }
  };

  const handleDownloadRawJson = () => {
    if (!activeRawResponse) {
      return;
    }

    const jsonText = JSON.stringify(activeRawResponse, null, 2);
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rawViewVersion}-users-response.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen u-bg-surface u-text-ink">
      <div className="premium-bg relative overflow-hidden">
        <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full u-bg-glow-a blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full u-bg-glow-b blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
          <header className="mb-10 animate-fade-in-up">
            <div className="inline-flex items-center rounded-full border u-border-soft bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] u-text-brand shadow-sm">
              Enterprise API Evolution
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">API Versioning Control Center</h1>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed u-text-muted sm:text-base">
              A professional interface for creating versioned users, validating backward compatibility, and inspecting raw transport payloads.
            </p>
          </header>

          <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up-delayed">
            <div className="stat-chip">
              <div className="stat-label">Active Version</div>
              <div className="stat-value uppercase">{selectedVersion}</div>
            </div>
            <div className="stat-chip">
              <div className="stat-label">V1 Records</div>
              <div className="stat-value">{v1Users.length}</div>
            </div>
            <div className="stat-chip">
              <div className="stat-label">V2 Records</div>
              <div className="stat-value">{v2Users.length}</div>
            </div>
            <div className="stat-chip">
              <div className="stat-label">V3 Records</div>
              <div className="stat-value">{v3Users.length}</div>
            </div>
          </section>

          <div className="mb-8 grid gap-4 lg:grid-cols-2 animate-fade-in-up-delayed-2">
            <div className="glass-panel">
              <label htmlFor="version-selector" className="mb-2 block text-xs font-semibold uppercase tracking-wider u-text-muted">
                Select API Version
              </label>
              <select
                id="version-selector"
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                className="w-full rounded-xl border u-border-soft bg-white px-4 py-3 text-sm font-semibold u-text-ink outline-none transition u-focus-border-brand"
              >
                <option value="v1">v1</option>
                <option value="v2">v2</option>
                <option value="v3">v3</option>
              </select>
            </div>

            <div className="glass-panel">
              <div className="mb-2 block text-xs font-semibold uppercase tracking-wider u-text-muted">View Mode</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'formatted', label: 'Formatted' },
                  { key: 'raw', label: 'Raw JSON' },
                  { key: 'split', label: 'Split' },
                ].map((mode) => (
                  <button
                    key={mode.key}
                    type="button"
                    aria-pressed={viewMode === mode.key}
                    onClick={() => setViewMode(mode.key)}
                    className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      viewMode === mode.key
                        ? 'u-bg-brand text-white shadow-md'
                        : 'bg-white u-text-muted u-hover-text-ink'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {deprecationNotice && (
            <div className="mb-8 rounded-xl border u-border-v1 u-bg-v1-soft px-4 py-3 text-sm font-semibold u-text-brand animate-fade-in-up-delayed-2">
              {deprecationNotice}
            </div>
          )}

          {errorMessage && (
            <div className="mb-8 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {errorMessage}
            </div>
          )}

          <main className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <section className="space-y-8 animate-fade-in-up-delayed-2">
              <Card title={`${activeMeta.label} API`} className={`border-l-4 ${activeMeta.accent}`}>
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                <div className="mt-6 rounded-xl border u-border-soft u-bg-neutral-soft p-4 text-sm">
                  <div className="font-semibold u-text-brand">API Endpoints</div>
                  <div className="mt-2 font-mono text-xs u-text-muted">{activeMeta.postEndpoint}</div>
                  <div className="font-mono text-xs u-text-muted">{activeMeta.getEndpoint}</div>
                  <div className="mt-2 u-text-muted">Schema: {activeMeta.schema}</div>
                </div>
              </Card>

              {(viewMode === 'formatted' || viewMode === 'split') && (
                <Card title={`${selectedVersion.toUpperCase()} Users List`}>
                  {isLoading && <p className="text-sm u-text-muted">Loading users...</p>}
                  {!isLoading && activeUsers.length === 0 && <p className="text-sm u-text-muted">No users found.</p>}
                  <ul className="space-y-3">
                    {activeUsers.map((user) => (
                      <li key={user._id} className="rounded-xl border u-border-soft bg-white p-4 shadow-sm transition hover:shadow-md">
                        {selectedVersion === 'v1' && (
                          <>
                            <div className="font-semibold u-text-ink">{user.name}</div>
                            <div className="text-sm u-text-muted">{user.email}</div>
                          </>
                        )}
                        {selectedVersion === 'v2' && (
                          <>
                            <div className="font-semibold u-text-ink">{user.firstName} {user.lastName}</div>
                            <div className="text-sm u-text-muted">{user.email}</div>
                          </>
                        )}
                        {selectedVersion === 'v3' && (
                          <>
                            <div className="font-semibold u-text-ink">{user.fullName}</div>
                            <div className="text-sm u-text-muted">{user.email}</div>
                            <div className="mt-1 text-xs u-text-muted">Age: {user.age ?? 'N/A'} | Phone: {user.phone || 'N/A'}</div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </section>

            <section className="space-y-8 animate-fade-in-up-delayed-2">
              <Card title="Version Comparison">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b u-border-soft">
                        <th className="py-2 pr-4 u-text-muted">Version</th>
                        <th className="py-2 pr-4 u-text-muted">Fields</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b u-border-soft">
                        <td className="py-3 pr-4 font-semibold">v1</td>
                        <td className="py-3 pr-4">name, email</td>
                      </tr>
                      <tr className="border-b u-border-soft">
                        <td className="py-3 pr-4 font-semibold">v2</td>
                        <td className="py-3 pr-4">firstName, lastName, email</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4 font-semibold">v3</td>
                        <td className="py-3 pr-4">fullName, email, age, phone</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>

              {(viewMode === 'raw' || viewMode === 'split') && (
                <Card title="Raw JSON Responses">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="text-sm u-text-muted">Inspect exact payloads by API version.</div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadRawJson}
                        disabled={!activeRawResponse}
                        className="rounded-md u-bg-v2 px-3 py-1.5 text-xs font-semibold u-text-ink transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Download JSON
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyRawJson}
                        disabled={!activeRawResponse}
                        className="rounded-md u-bg-v1 px-3 py-1.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {copiedVersion === rawViewVersion ? 'Copied' : `Copy ${rawViewVersion.toUpperCase()} JSON`}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-3 gap-2">
                    {['v1', 'v2', 'v3'].map((version) => (
                      <button
                        key={version}
                        type="button"
                        aria-pressed={rawViewVersion === version}
                        onClick={() => setRawViewVersion(version)}
                        className={`rounded-lg px-3 py-2 text-sm font-semibold uppercase transition ${
                          rawViewVersion === version
                            ? 'u-bg-brand text-white'
                            : 'u-bg-neutral-soft u-text-muted u-hover-text-ink'
                        }`}
                      >
                        {version}
                      </button>
                    ))}
                  </div>

                  <pre className="max-h-80 overflow-auto rounded-lg u-bg-ink p-4 font-mono text-xs u-text-code whitespace-pre-wrap wrap-break-word">
                    {activeRawResponse ? JSON.stringify(activeRawResponse, null, 2) : 'No data loaded.'}
                  </pre>
                </Card>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;



