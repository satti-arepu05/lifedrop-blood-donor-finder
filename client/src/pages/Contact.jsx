import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function Contact() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit');
      setSent(true);
      addToast('Message received! Our team will contact you.', 'success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Info Col */}
        <div className="space-y-6">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-brand-red uppercase">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
              Contact LifeDrop Support
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Have questions regarding blood drive partnerships, hospital onboarding, or technical assistance? Send us a note.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Phone className="w-5 h-5 text-brand-red" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">Emergency Hotline</span>
                <span className="text-slate-500">1800-LIFEDROP / +91 1800 543 337 (24/7)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Mail className="w-5 h-5 text-brand-blue" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">Email Address</span>
                <span className="text-slate-500">support@lifedrop.org / hospital.desk@lifedrop.org</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-bold block text-slate-900 dark:text-white">National Central Office</span>
                <span className="text-slate-500">Health Innovation Hub, Hitec City, Hyderabad - 500081</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Col */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          {sent ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Message Delivered</h3>
              <p className="text-xs text-slate-500">
                Thank you for reaching out. We have registered your message in our dispatch logs and will follow up shortly.
              </p>
              <button
                onClick={() => setSent(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm"
                  placeholder="e.g. Dr. K. Srinath"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm"
                  placeholder="srinath@redcross.org"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm"
                  placeholder="How can we assist you?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-brand-red hover:bg-brand-redHover text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Transmitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
