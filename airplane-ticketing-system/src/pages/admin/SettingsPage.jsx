import { useState, useEffect } from 'react';
import { useSettings, useUpdateGeneralSettings, useUpdateMailSettings, useUploadLogo, useUploadFavicon, useTestMail,
   useUpdateStripeSettings,
} from '../../hooks/useSettings';
import { getFileUrl } from '../../utils/getFileUrl';

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateGeneral = useUpdateGeneralSettings();
  const updateMail = useUpdateMailSettings();
  const uploadLogo = useUploadLogo();
  const uploadFavicon = useUploadFavicon();
  const testMail = useTestMail();
  const updateStripe = useUpdateStripeSettings();

  const [general, setGeneral] = useState({ siteName: '', supportEmail: '', contactPhone: '' });
  const [mail, setMail] = useState({
    smtpHost: '', smtpPort: 587, smtpUsername: '', smtpPassword: '',
    fromName: '', fromEmail: '', enableSsl: true,
  });
  const [testEmail, setTestEmail] = useState('');

   const [stripe, setStripe] = useState({ secretKey: '', publishableKey: '', webhookSecret: '' });


  // settings fetch হয়ে এলে form state populate করা হচ্ছে (uncontrolled defaultValue bug fix)
  useEffect(() => {
    if (settings) {
      setGeneral({
        siteName: settings.siteName || '',
        supportEmail: settings.supportEmail || '',
        contactPhone: settings.contactPhone || '',
      });
      setMail({
        smtpHost: settings.smtpHost || '',
        smtpPort: settings.smtpPort || 587,
        smtpUsername: settings.smtpUsername || '',
        smtpPassword: '', // password কখনো prefill হবে না — blank রাখলে backend পুরোনো password রেখে দেয়
        fromName: settings.fromName || '',
        fromEmail: settings.fromEmail || '',
        enableSsl: settings.enableSsl ?? true,
      });

       setStripe({
        secretKey: '',
        publishableKey: settings.stripePublishableKey || '',
        webhookSecret: '',
      });
    
    }
  }, [settings]);

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
            {settings?.logoUrl && (
              <img src={getFileUrl(settings.logoUrl)} alt="logo" className="h-12 mb-2" />
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={(e) => e.target.files[0] && uploadLogo.mutate(e.target.files[0])}
            />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-1">Favicon</p>
            {settings?.faviconUrl && (
              <img src={getFileUrl(settings.faviconUrl)} alt="favicon" className="h-8 mb-2" />
            )}
            <input
              type="file"
              accept="image/x-icon,image/png"
              onChange={(e) => e.target.files[0] && uploadFavicon.mutate(e.target.files[0])}
            />
          </div>
        </div>
      </section>

      {/* General */}
      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">General</h2>
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Site Name"
          value={general.siteName}
          onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Support Email"
          value={general.supportEmail}
          onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Contact Phone"
          value={general.contactPhone}
          onChange={(e) => setGeneral({ ...general, contactPhone: e.target.value })}
        />
        <button
          onClick={() => updateGeneral.mutate(general)}
          disabled={updateGeneral.isPending}
          className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {updateGeneral.isPending ? 'Saving...' : 'Save'}
        </button>
        {updateGeneral.isSuccess && (
          <p className="text-xs text-green-600">Saved successfully.</p>
        )}
      </section>

      {/* Mail */}
      <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">Mail (SMTP)</h2>

        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="SMTP Host"
          value={mail.smtpHost}
          onChange={(e) => setMail({ ...mail, smtpHost: e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="SMTP Port"
          type="number"
          value={mail.smtpPort}
          onChange={(e) => setMail({ ...mail, smtpPort: +e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="SMTP Username"
          value={mail.smtpUsername}
          onChange={(e) => setMail({ ...mail, smtpUsername: e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="New Password (leave blank to keep current)"
          type="password"
          value={mail.smtpPassword}
          onChange={(e) => setMail({ ...mail, smtpPassword: e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="From Name"
          value={mail.fromName}
          onChange={(e) => setMail({ ...mail, fromName: e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="From Email"
          value={mail.fromEmail}
          onChange={(e) => setMail({ ...mail, fromEmail: e.target.value })}
        />

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={mail.enableSsl}
            onChange={(e) => setMail({ ...mail, enableSsl: e.target.checked })}
          />
          Enable SSL/TLS
        </label>

        <button
          onClick={() => updateMail.mutate(mail)}
          disabled={updateMail.isPending}
          className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {updateMail.isPending ? 'Saving...' : 'Save'}
        </button>
        {updateMail.isSuccess && (
          <p className="text-xs text-green-600">Mail settings saved.</p>
        )}
        {updateMail.isError && (
          <p className="text-xs text-red-500">Failed to save mail settings.</p>
        )}

        <div className="pt-4 border-t border-slate-100 flex gap-2 items-start">
          <input
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
            placeholder="Send test email to..."
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <button
            onClick={() => testMail.mutate(testEmail)}
            disabled={testMail.isPending || !testEmail}
            className="bg-slate-100 text-slate-700 text-sm px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {testMail.isPending ? 'Sending...' : 'Send Test'}
          </button>
        </div>
        {testMail.isSuccess && (
          <p className="text-xs text-green-600">Test email sent — check the inbox.</p>
        )}
        {testMail.isError && (
          <p className="text-xs text-red-500">Test email failed — check SMTP settings.</p>
        )}
      </section>

       <section className="bg-white rounded-xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">Stripe Payment Gateway</h2>
        <p className="text-xs text-slate-500">
          {settings?.stripeConfigured
            ? '✅ Stripe is currently configured.'
            : '⚠️ Stripe secret key not set — card payments will fail until configured.'}
        </p>

        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Publishable Key (pk_test_... or pk_live_...)"
          value={stripe.publishableKey}
          onChange={(e) => setStripe({ ...stripe, publishableKey: e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Secret Key (leave blank to keep current) — sk_test_..."
          type="password"
          value={stripe.secretKey}
          onChange={(e) => setStripe({ ...stripe, secretKey: e.target.value })}
        />
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm"
          placeholder="Webhook Secret (optional, leave blank to keep current)"
          type="password"
          value={stripe.webhookSecret}
          onChange={(e) => setStripe({ ...stripe, webhookSecret: e.target.value })}
        />

        <button
          onClick={() => updateStripe.mutate(stripe)}
          disabled={updateStripe.isPending}
          className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {updateStripe.isPending ? 'Saving...' : 'Save'}
        </button>
        {updateStripe.isSuccess && (
          <p className="text-xs text-green-600">Stripe settings saved.</p>
        )}
        {updateStripe.isError && (
          <p className="text-xs text-red-500">Failed to save Stripe settings.</p>
        )}

        
      </section>
    </div>
  );
}