import { useState } from 'react';

import { useSettings, useUpdateGeneralSettings, useUpdateMailSettings, useUploadLogo, useUploadFavicon, useTestMail } from '../../hooks/useSettings';

import { getFileUrl } from '../../utils/getFileUrl';   // note: path 2 level up, admin folder theke

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateGeneral = useUpdateGeneralSettings();
  const updateMail = useUpdateMailSettings();
  const uploadLogo = useUploadLogo();
  const uploadFavicon = useUploadFavicon();
  const testMail = useTestMail();

  const [general, setGeneral] = useState({ siteName: '', supportEmail: '', contactPhone: '' });
  const [mail, setMail] = useState({ smtpHost: '', smtpPort: 587, smtpUsername: '', smtpPassword: '', fromName: '', fromEmail: '', enableSsl: true });
  const [testEmail, setTestEmail] = useState('');

  if (isLoading) return <div className="p-8 text-slate-500">Loading...</div>;

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-xl font-bold text-slate-800">Project Settings</h1>

      {/* Branding */}
      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">Branding</h2>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-slate-500 mb-1">Logo</p>
            {settings?.logoUrl && <img src={getFileUrl(settings.logoUrl)} alt="logo" className="h-12 mb-2" />}
            <input type="file" accept="image/png,image/jpeg,image/svg+xml"
              onChange={(e) => e.target.files[0] && uploadLogo.mutate(e.target.files[0])} />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Favicon</p>
            {settings?.faviconUrl && <img src={getFileUrl(settings.faviconUrl)} alt="favicon" className="h-8 mb-2" />}
            <input type="file" accept="image/x-icon,image/png"
              onChange={(e) => e.target.files[0] && uploadFavicon.mutate(e.target.files[0])} />
          </div>
        </div>
      </section>

      {/* General */}
      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">General</h2>
        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Site Name"
          defaultValue={settings?.siteName} onChange={(e) => setGeneral({ ...general, siteName: e.target.value })} />
        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Support Email"
          defaultValue={settings?.supportEmail} onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })} />
        <button onClick={() => updateGeneral.mutate(general)}
          className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg">Save</button>
      </section>

      {/* Mail */}
      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">Mail (SMTP)</h2>
        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="SMTP Host"
          defaultValue={settings?.smtpHost} onChange={(e) => setMail({ ...mail, smtpHost: e.target.value })} />
        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="SMTP Port" type="number"
          defaultValue={settings?.smtpPort} onChange={(e) => setMail({ ...mail, smtpPort: +e.target.value })} />
        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="SMTP Username"
          defaultValue={settings?.smtpUsername} onChange={(e) => setMail({ ...mail, smtpUsername: e.target.value })} />
        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="New Password (leave blank to keep current)"
          type="password" onChange={(e) => setMail({ ...mail, smtpPassword: e.target.value })} />
        <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="From Email"
          defaultValue={settings?.fromEmail} onChange={(e) => setMail({ ...mail, fromEmail: e.target.value })} />
        <button onClick={() => updateMail.mutate(mail)}
          className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg">Save</button>

        <div className="pt-4 border-t border-slate-100 flex gap-2">
          <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Send test email to..."
            value={testEmail} onChange={(e) => setTestEmail(e.target.value)} />
          <button onClick={() => testMail.mutate(testEmail)}
            className="bg-slate-100 text-slate-700 text-sm px-4 py-2 rounded-lg">Send Test</button>
        </div>
      </section>
    </div>
  );
}