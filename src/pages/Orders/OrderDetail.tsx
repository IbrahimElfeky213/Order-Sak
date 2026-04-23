import React, { useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Order, OrderStatus, Transaction, Bill, Document, Installment, ActionLog
} from '../../data/ordersStore';
import {
  ChevronLeft, CheckCircle2, Copy, Phone, MapPin, Shield,
  CreditCard, Building2, FileText, Percent, ArrowRight, Clock,
  Eye, Download, Upload, Trash2, AlertTriangle, X, Check,
  ExternalLink, ChevronDown, Plus, RefreshCw
} from 'lucide-react';

/* ─── Helpers ────────────────────────────────────────────────── */
const fmt = (v: number) => v === 0 ? '0 SAR' : `${v.toLocaleString()} SAR`;
const ts  = () => new Date().toLocaleString('en-GB', { hour12: false }).replace(',', '');

/* ─── Status transitions ─────────────────────────────────────── */
const nextStatus: Partial<Record<string, OrderStatus>> = {
  'Complete Deposit':          'Deposit Paid',
  'Complete Amount':           'Installment Paid',
  'Settle Order':              'Tax Paid',
  'Make Tax Request':          'Tax Paid',
  'Skip Tax':                  'Tax Paid',
  'Deed Transfer':             'Deed Transferred',
  'Make Deed Transfer Request':'Deed Transferred',
  'Skip Expiration':           'Prebook',
  'Initiate Refund':           'Refunded',
  'Cancel Order':              'Cancelled',
};

/* ─── Status config ──────────────────────────────────────────── */
const statusConfig: Record<OrderStatus, { pill: string; dot: string }> = {
  'Prebook':          { pill: 'bg-slate-100 text-slate-700 border-slate-200',    dot: 'bg-slate-400' },
  'Expire':           { pill: 'bg-red-50 text-red-700 border-red-200',            dot: 'bg-red-500' },
  'Deposit Paid':     { pill: 'bg-blue-50 text-blue-700 border-blue-200',         dot: 'bg-blue-500' },
  'Pending':          { pill: 'bg-amber-50 text-amber-700 border-amber-200',      dot: 'bg-amber-500' },
  'Partially Paid':   { pill: 'bg-orange-50 text-orange-700 border-orange-200',   dot: 'bg-orange-500' },
  'Installment Paid': { pill: 'bg-indigo-50 text-indigo-700 border-indigo-200',   dot: 'bg-indigo-500' },
  'Tax Paid':         { pill: 'bg-violet-50 text-violet-700 border-violet-200',   dot: 'bg-violet-500' },
  'Deed Transferred': { pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',dot: 'bg-emerald-500' },
  'Cancelled':        { pill: 'bg-red-50 text-red-600 border-red-200',            dot: 'bg-red-400' },
  'Refunded':         { pill: 'bg-gray-100 text-gray-600 border-gray-200',        dot: 'bg-gray-400' },
};

/* ─── Action definitions ─────────────────────────────────────── */
interface ActionDef { label: string; type: 'primary'|'secondary'|'danger'; icon: React.ReactNode; desc: string; }

const statusActions: Record<OrderStatus, ActionDef[]> = {
  'Prebook': [
    { label: 'Complete Deposit', type: 'primary',   icon: <CreditCard size={14}/>, desc: 'Record the deposit payment for this order.' },
    { label: 'Skip Expiration',  type: 'secondary', icon: <Clock size={14}/>,      desc: 'Extend the booking window to prevent expiry.' },
    { label: 'Cancel Order',     type: 'danger',    icon: <X size={14}/>,          desc: 'Permanently cancel this order. Cannot be undone.' },
  ],
  'Expire': [
    { label: 'Skip Expiration', type: 'primary', icon: <Clock size={14}/>, desc: 'Re-activate by extending the booking window.' },
  ],
  'Deposit Paid': [
    { label: 'Complete Amount',         type: 'primary',   icon: <CreditCard size={14}/>, desc: 'Mark the full installment amount as paid.' },
    { label: 'Cash to Bank',            type: 'secondary', icon: <Building2 size={14}/>,  desc: 'Record a cash-to-bank transfer for this order.' },
    { label: 'Manual Deposit Discount', type: 'secondary', icon: <Percent size={14}/>,    desc: 'Apply a manual discount to the deposit amount.' },
    { label: 'Initiate Refund',         type: 'danger',    icon: <ArrowRight size={14}/>, desc: 'Begin the refund process for the deposit paid.' },
    { label: 'Cancel Order',            type: 'danger',    icon: <X size={14}/>,          desc: 'Permanently cancel this order.' },
  ],
  'Pending': [
    { label: 'Complete Amount',         type: 'primary',   icon: <CreditCard size={14}/>, desc: 'Mark full payment as completed.' },
    { label: 'Cash to Bank',            type: 'secondary', icon: <Building2 size={14}/>,  desc: 'Record a cash-to-bank transfer.' },
    { label: 'Manual Deposit Discount', type: 'secondary', icon: <Percent size={14}/>,    desc: 'Apply a manual discount.' },
    { label: 'Initiate Refund',         type: 'danger',    icon: <ArrowRight size={14}/>, desc: 'Begin the refund process.' },
    { label: 'Cancel Order',            type: 'danger',    icon: <X size={14}/>,          desc: 'Permanently cancel this order.' },
  ],
  'Partially Paid': [
    { label: 'Complete Amount', type: 'primary',   icon: <CreditCard size={14}/>, desc: 'Mark remaining payment as completed.' },
    { label: 'Cash to Bank',    type: 'secondary', icon: <Building2 size={14}/>,  desc: 'Record a cash-to-bank transfer.' },
    { label: 'Cancel Order',    type: 'danger',    icon: <X size={14}/>,          desc: 'Permanently cancel this order.' },
  ],
  'Installment Paid': [
    { label: 'Settle Order',     type: 'primary',   icon: <CheckCircle2 size={14}/>, desc: 'Mark this order as fully settled.' },
    { label: 'Deed Transfer',    type: 'primary',   icon: <ArrowRight size={14}/>,   desc: 'Initiate property deed transfer.' },
    { label: 'Make Tax Request', type: 'secondary', icon: <FileText size={14}/>,     desc: 'Submit a tax evaluation request.' },
    { label: 'Cash to Bank',     type: 'secondary', icon: <Building2 size={14}/>,    desc: 'Record a cash-to-bank transfer.' },
    { label: 'Skip Tax',         type: 'secondary', icon: <Shield size={14}/>,       desc: 'Skip tax step and proceed.' },
  ],
  'Tax Paid': [
    { label: 'Deed Transfer',              type: 'primary',   icon: <ArrowRight size={14}/>, desc: 'Initiate property deed transfer.' },
    { label: 'Make Deed Transfer Request', type: 'secondary', icon: <FileText size={14}/>,   desc: 'Submit deed transfer request.' },
  ],
  'Deed Transferred': [],
  'Cancelled':        [],
  'Refunded':         [],
};

/* ─── Form modal fields per action ──────────────────────────── */
const actionFields: Record<string, { id: string; label: string; type: string; placeholder?: string; options?: string[]; required?: boolean }[]> = {
  'Complete Deposit': [
    { id: 'amount',    label: 'Deposit Amount (SAR)', type: 'number',   placeholder: '50000', required: true },
    { id: 'method',    label: 'Payment Method',        type: 'select',   options: ['Bank Transfer','SADAD','Cash','Credit Card'], required: true },
    { id: 'reference', label: 'Reference / Receipt #', type: 'text',    placeholder: 'e.g. REF-BNK-001' },
    { id: 'paidAt',    label: 'Payment Date',          type: 'datetime-local', required: true },
  ],
  'Complete Amount': [
    { id: 'amount',    label: 'Amount Paid (SAR)',   type: 'number',   placeholder: '750000', required: true },
    { id: 'method',    label: 'Payment Method',       type: 'select',   options: ['Bank Transfer','SADAD','Cash','Credit Card'], required: true },
    { id: 'reference', label: 'Reference / Receipt #',type: 'text',    placeholder: 'e.g. REF-BNK-002' },
    { id: 'paidAt',    label: 'Payment Date',         type: 'datetime-local', required: true },
  ],
  'Cash to Bank': [
    { id: 'amount',    label: 'Cash Amount (SAR)', type: 'number',  placeholder: '50000',       required: true },
    { id: 'bank',      label: 'Bank Name',          type: 'select',  options: ['Al Rajhi Bank','SNB – Saudi National Bank','Riyad Bank','BSF','SABB'], required: true },
    { id: 'reference', label: 'Transfer Reference', type: 'text',   placeholder: 'e.g. TRF-001', required: true },
    { id: 'paidAt',    label: 'Transfer Date',       type: 'datetime-local', required: true },
  ],
  'Manual Deposit Discount': [
    { id: 'discountType',  label: 'Discount Type',       type: 'select', options: ['Amount','Percentage'], required: true },
    { id: 'discountValue', label: 'Discount Value',       type: 'number', placeholder: '5000',              required: true },
    { id: 'reason',        label: 'Reason',               type: 'textarea', placeholder: 'Reason for discount…', required: true },
  ],
  'Initiate Refund': [
    { id: 'method', label: 'Refund Method', type: 'select',   options: ['Bank Transfer','Cash','SADAD'], required: true },
    { id: 'reason', label: 'Reason',        type: 'textarea', placeholder: 'Reason for refund…',       required: true },
  ],
  'Cancel Order': [
    { id: 'reason', label: 'Cancellation Reason', type: 'textarea', placeholder: 'Why is this order being cancelled?', required: true },
  ],
  'Skip Expiration': [
    { id: 'newExpiry', label: 'New Expiry Date', type: 'date', required: true },
    { id: 'reason',    label: 'Reason',          type: 'textarea', placeholder: 'Reason for extension…' },
  ],
  'Settle Order': [
    { id: 'notes', label: 'Settlement Notes', type: 'textarea', placeholder: 'Any notes…' },
  ],
  'Deed Transfer': [
    { id: 'deedNumber',    label: 'Deed Number',     type: 'text', placeholder: 'e.g. DEED-2026-001', required: true },
    { id: 'transferDate',  label: 'Transfer Date',   type: 'date', required: true },
    { id: 'notes',         label: 'Notes',            type: 'textarea', placeholder: 'Additional notes…' },
  ],
  'Make Tax Request': [
    { id: 'notes', label: 'Request Notes', type: 'textarea', placeholder: 'Any additional details…' },
  ],
  'Skip Tax': [
    { id: 'reason', label: 'Reason for Skipping Tax', type: 'textarea', placeholder: 'Justification…', required: true },
  ],
  'Make Deed Transfer Request': [
    { id: 'authorityRef', label: 'Authority Reference',  type: 'text',     placeholder: 'e.g. AUTH-REF-001' },
    { id: 'notes',        label: 'Request Notes',        type: 'textarea', placeholder: 'Any additional details…' },
  ],
  'Complete Tax': [
    { id: 'taxRef', label: 'Tax Clearance Reference', type: 'text',     placeholder: 'e.g. TAX-CLR-001', required: true },
    { id: 'notes',  label: 'Notes',                    type: 'textarea', placeholder: 'Notes…' },
  ],
  'Force Initiate Refund': [
    { id: 'method', label: 'Refund Method', type: 'select',   options: ['Bank Transfer','Cash','SADAD'], required: true },
    { id: 'reason', label: 'Reason',        type: 'textarea', placeholder: 'Reason for forced refund… (required)', required: true },
  ],
};

/* ─── Toast ──────────────────────────────────────────────────── */
function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success'|'error'; onClose: () => void }) {
  React.useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 ${type === 'success' ? 'bg-gray-900 text-white' : 'bg-red-600 text-white'}`}>
      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-1 opacity-50 hover:opacity-100"><X size={13}/></button>
    </div>
  );
}

/* ─── Action Modal ───────────────────────────────────────────── */
function ActionModal({ action, order, onSubmit, onCancel }: {
  action: ActionDef & { label: string };
  order: Order;
  onSubmit: (values: Record<string,string>) => void;
  onCancel: () => void;
}) {
  const fields = actionFields[action.label] ?? [];
  const [values, setValues] = useState<Record<string,string>>(() => {
    const init: Record<string,string> = {};
    if (action.label === 'Complete Deposit') init['amount'] = String(order.depositAmount);
    if (action.label === 'Complete Amount')  init['amount'] = String(order.installmentRemaining);
    return init;
  });
  const [loading, setLoading] = useState(false);
  const isDanger = action.type === 'danger';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onSubmit(values); }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-5 border-b ${isDanger ? 'bg-red-50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDanger ? 'bg-red-100 text-red-600' : 'bg-brand/10 text-brand'}`}>
                {action.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">{action.label}</h3>
                <p className="text-xs text-gray-400">Order {order.id}</p>
              </div>
            </div>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18}/></button>
          </div>
          {action.desc && <p className="text-xs text-gray-500 mt-3 leading-relaxed">{action.desc}</p>}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {fields.length === 0 && (
            <p className="text-sm text-gray-500 py-2">Are you sure you want to proceed?</p>
          )}
          {fields.map(f => (
            <div key={f.id}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                {f.label} {f.required && <span className="text-red-400">*</span>}
              </label>
              {f.type === 'select' ? (
                <select
                  required={f.required}
                  value={values[f.id] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-white"
                >
                  <option value="">Select…</option>
                  {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea
                  required={f.required}
                  rows={3}
                  placeholder={f.placeholder}
                  value={values[f.id] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                />
              ) : (
                <input
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={values[f.id] ?? ''}
                  onChange={e => setValues(v => ({ ...v, [f.id]: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-10">Cancel</Button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 h-10 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                isDanger
                  ? 'bg-red-600 hover:bg-red-700 text-white disabled:opacity-60'
                  : 'bg-brand hover:bg-brand/90 text-white disabled:opacity-60'
              }`}
            >
              {loading ? <RefreshCw size={15} className="animate-spin" /> : null}
              {loading ? 'Processing…' : isDanger ? 'Confirm' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── InfoRow ────────────────────────────────────────────────── */
function InfoRow({ label, value, mono, link, badge, highlight }: {
  label: string; value?: string; mono?: boolean;
  link?: boolean; badge?: React.ReactNode; highlight?: string;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">{label}</span>
      {badge ?? (
        <span className={`text-sm font-medium text-right ${mono ? 'font-mono text-xs' : ''} ${link ? 'text-brand hover:underline cursor-pointer flex items-center gap-1' : ''} ${highlight ?? 'text-gray-900'}`}>
          {value}
          {link && <ExternalLink size={10} className="opacity-40" />}
        </span>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
interface OrderDetailProps {
  orderId:       string;
  orders:        Order[];
  onBack:        () => void;
  onUpdateOrder: (o: Order) => void;
}

export default function OrderDetail({ orderId, orders, onBack, onUpdateOrder }: OrderDetailProps) {
  const [activeTab,   setActiveTab]   = useState('Transactions');
  const [openAction,  setOpenAction]  = useState<ActionDef | null>(null);
  const [toast,       setToast]       = useState<{ msg: string; type?: 'success'|'error' } | null>(null);
  const [dangerOpen,  setDangerOpen]  = useState(false);
  const [copied,      setCopied]      = useState(false);
  const [uploadingId, setUploadingId] = useState<string|null>(null);

  const order = orders.find(o => o.id === orderId);
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <AlertTriangle size={40} className="mb-3 text-gray-300" />
        <h2 className="text-lg font-bold text-gray-700 mb-1">Order not found</h2>
        <Button onClick={onBack}>← Back to Orders</Button>
      </div>
    );
  }

  const allActions = statusActions[order.status] ?? [];
  const primary    = allActions.filter(a => a.type === 'primary');
  const secondary  = allActions.filter(a => a.type === 'secondary');
  const danger     = allActions.filter(a => a.type === 'danger');
  const tabs       = ['Transactions','Bills','Installments','Documents','Developer Transfer','Action Logs'];
  const sc         = statusConfig[order.status];

  /* ── Apply action → mutate order ── */
  const applyAction = (actionLabel: string, values: Record<string,string>) => {
    const now = ts();
    let updated: Order = { ...order, actionLogs: [...order.actionLogs] };

    switch (actionLabel) {
      case 'Complete Deposit': {
        const amt = parseInt(values['amount'] || String(order.depositAmount));
        updated = {
          ...updated,
          status: 'Deposit Paid',
          depositPaid: amt,
          totalPaid: updated.totalPaid + amt,
          depositPaidAt: now,
          transactions: [
            ...updated.transactions,
            { id: `TRX-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
              amount: amt, paymentType: 'Deposit', type: 'Credit',
              method: values['method'] as any || 'Bank Transfer',
              status: 'Completed', createdAt: now, reference: values['reference'] },
          ],
        };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Deposit Recorded', by: 'Admin',
            desc: `Deposit of ${amt.toLocaleString()} SAR recorded via ${values['method'] || 'Bank Transfer'}.` }];
        break;
      }
      case 'Complete Amount': {
        const amt = parseInt(values['amount'] || String(order.installmentRemaining));
        updated = {
          ...updated,
          status: 'Installment Paid',
          installmentPaid: updated.installmentPaid + amt,
          installmentRemaining: Math.max(0, updated.installmentRemaining - amt),
          totalPaid: updated.totalPaid + amt,
          transactions: [
            ...updated.transactions,
            { id: `TRX-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
              amount: amt, paymentType: 'Installment', type: 'Credit',
              method: values['method'] as any || 'Bank Transfer',
              status: 'Completed', createdAt: now, reference: values['reference'] },
          ],
        };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Full Amount Paid', by: 'Admin',
            desc: `Payment of ${amt.toLocaleString()} SAR recorded. Status → Installment Paid.` }];
        break;
      }
      case 'Cash to Bank': {
        const amt = parseInt(values['amount'] || '0');
        updated = {
          ...updated,
          transactions: [
            ...updated.transactions,
            { id: `TRX-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
              amount: amt, paymentType: 'Deposit', type: 'Credit',
              method: 'Cash', status: 'Completed', createdAt: now, reference: values['reference'] },
          ],
        };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Cash to Bank', by: 'Admin',
            desc: `${amt.toLocaleString()} SAR transferred to ${values['bank'] || 'bank'}.` }];
        break;
      }
      case 'Manual Deposit Discount': {
        const val = parseInt(values['discountValue'] || '0');
        const afterDisc = Math.max(0, updated.depositAmount - (values['discountType'] === 'Percentage' ? Math.round(updated.depositAmount * val / 100) : val));
        const discAmt   = updated.depositAmount - afterDisc;
        updated = {
          ...updated,
          discountValue: discAmt,
          discountAppliedAt: now.slice(0,10),
          discountType: values['discountType'] || 'Amount',
          priceAfterDiscount: Math.max(0, updated.priceAfterDiscount - discAmt),
        };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Discount Applied', by: 'Admin',
            desc: `Manual discount of ${discAmt.toLocaleString()} SAR applied. Reason: ${values['reason']}.` }];
        break;
      }
      case 'Initiate Refund':
      case 'Force Initiate Refund': {
        updated = {
          ...updated,
          status: 'Refunded',
          transactions: [
            ...updated.transactions,
            { id: `TRX-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
              amount: updated.totalPaid, paymentType: 'Refund', type: 'Debit',
              method: values['method'] as any || 'Bank Transfer',
              status: 'Completed', createdAt: now },
          ],
        };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Refund Initiated', by: 'Admin',
            desc: `Refund of ${updated.totalPaid.toLocaleString()} SAR via ${values['method']}. Reason: ${values['reason']}.` }];
        break;
      }
      case 'Cancel Order': {
        updated = { ...updated, status: 'Cancelled' };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Order Cancelled', by: 'Admin',
            desc: `Order cancelled. Reason: ${values['reason']}.` }];
        break;
      }
      case 'Skip Expiration': {
        updated = { ...updated, status: 'Prebook' };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Expiration Skipped', by: 'Admin',
            desc: `Booking extended to ${values['newExpiry']}. ${values['reason'] ? 'Reason: ' + values['reason'] : ''}` }];
        break;
      }
      case 'Settle Order': {
        updated = { ...updated, status: 'Tax Paid' };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Order Settled', by: 'Admin', desc: `Order settled. ${values['notes'] || ''}` }];
        break;
      }
      case 'Make Tax Request': {
        updated = { ...updated, status: 'Tax Paid' };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Tax Request Submitted', by: 'Admin', desc: `Tax evaluation request submitted.` }];
        break;
      }
      case 'Skip Tax': {
        updated = { ...updated, status: 'Tax Paid', adminTaxExempt: 'Skipped' };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Tax Skipped', by: 'Admin', desc: `Tax evaluation skipped. Reason: ${values['reason']}.` }];
        break;
      }
      case 'Deed Transfer':
      case 'Make Deed Transfer Request': {
        updated = { ...updated, status: 'Deed Transferred' };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Deed Transferred', by: 'Admin',
            desc: `Property deed transferred${values['deedNumber'] ? ` (Deed #${values['deedNumber']})` : ''}.` }];
        break;
      }
      case 'Complete Tax': {
        updated = { ...updated, adminTaxExempt: 'Completed' };
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: 'Tax Completed', by: 'Admin',
            desc: `Tax cleared. Ref: ${values['taxRef']}.` }];
        break;
      }
      default: {
        updated.actionLogs = [...updated.actionLogs,
          { time: now, action: actionLabel, by: 'Admin', desc: JSON.stringify(values) }];
      }
    }

    onUpdateOrder(updated);
    setToast({ msg: `"${actionLabel}" completed successfully.` });
    setOpenAction(null);
    setDangerOpen(false);
  };

  /* ── Document delete ── */
  const deleteDocument = (docId: string) => {
    const updated: Order = { ...order, documents: order.documents.filter(d => d.id !== docId) };
    onUpdateOrder(updated);
    setToast({ msg: 'Document deleted.' });
  };

  /* ── Simulate document upload ── */
  const simulateUpload = () => {
    const fakeId = `DOC-${Math.random().toString(36).slice(2,5).toUpperCase()}`;
    setUploadingId(fakeId);
    setTimeout(() => {
      const newDoc: Document = {
        id: fakeId,
        name: `Uploaded Document ${new Date().toLocaleDateString()}.pdf`,
        type: 'PDF',
        uploadedAt: new Date().toLocaleDateString('en-CA'),
        size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
      };
      const updated: Order = { ...order, documents: [...order.documents, newDoc] };
      onUpdateOrder(updated);
      setUploadingId(null);
      setToast({ msg: 'Document uploaded successfully.' });
    }, 1500);
  };

  /* ── Generate bill ── */
  const generateBill = () => {
    const newBill: Bill = {
      id: `BILL-${Date.now()}`,
      sadadNumber: `SADAD-${Math.floor(Math.random() * 900000 + 100000)}`,
      amount: order.installmentRemaining > 0 ? Math.round(order.installmentRemaining / 4) : order.depositAmount,
      status: 'Pending',
      createdAt: ts(),
      expiryDate: new Date(Date.now() + 30 * 864e5).toISOString().slice(0,10) + ' 23:59',
      invoiceId: `INV-${Math.floor(Math.random() * 9000 + 1000)}`,
    };
    const updated: Order = { ...order, bills: [...order.bills, newBill] };
    onUpdateOrder(updated);
    setToast({ msg: 'New bill generated.' });
  };

  /* ── Pay installment ── */
  const payInstallment = (n: number) => {
    const now = ts();
    const updated: Order = {
      ...order,
      installments: order.installments.map(inst =>
        inst.n === n ? { ...inst, paidDate: now.slice(0,10), status: 'Paid' } : inst
      ),
      installmentPaid: order.installmentPaid + (order.installments.find(i => i.n === n)?.amount ?? 0),
      installmentRemaining: Math.max(0, order.installmentRemaining - (order.installments.find(i => i.n === n)?.amount ?? 0)),
      totalPaid: order.totalPaid + (order.installments.find(i => i.n === n)?.amount ?? 0),
      transactions: [
        ...order.transactions,
        { id: `TRX-${Math.random().toString(36).slice(2,6).toUpperCase()}`,
          amount: order.installments.find(i => i.n === n)?.amount ?? 0,
          paymentType: 'Installment', type: 'Credit', method: 'Bank Transfer',
          status: 'Completed', createdAt: now },
      ],
      actionLogs: [...order.actionLogs,
        { time: now, action: `Installment #${n} Paid`, by: 'Admin',
          desc: `Installment ${n} of ${order.installments.length} paid.` }],
    };
    onUpdateOrder(updated);
    setToast({ msg: `Installment #${n} marked as paid.` });
  };

  /* ── Copy Camunda ID ── */
  const handleCopy = () => {
    navigator.clipboard.writeText(order.camundaId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Payment progress ── */
  const total   = order.priceAfterDiscount || 1;
  const depPct  = Math.min(100, Math.round((order.depositPaid     / total) * 100));
  const instPct = Math.min(100 - depPct, Math.round((order.installmentPaid / total) * 100));
  const paidPct = depPct + instPct;

  return (
    <>
      {openAction && (
        <ActionModal
          action={openAction}
          order={order}
          onSubmit={vals => applyAction(openAction.label, vals)}
          onCancel={() => setOpenAction(null)}
        />
      )}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-4">

        {/* ── HEADER ───────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand transition-colors mb-2">
              <ChevronLeft size={13} /> Back to Orders
            </button>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900">{order.id}</h1>
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${sc.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
              <MapPin size={10} /> {order.projectName} &nbsp;&middot;&nbsp; {order.propertyName}
              &nbsp;&middot;&nbsp; <Clock size={10} /> Booked {order.bookingDate}
            </p>
          </div>
        </div>

        {/* ── 3-COLUMN LAYOUT ─────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

          {/* ════ LEFT — Info sidebar ════════════════════════ */}
          <div className="xl:col-span-3 space-y-4">

            {/* Buyer */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-brand/8 to-transparent p-5 border-b">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {order.buyerInitials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-900 text-sm truncate">{order.buyerName}</span>
                      {order.buyerVerified && <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-gray-400">{order.buyerUsername}</p>
                  </div>
                </div>
                <a href="#" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand transition-colors">
                  <Phone size={11} /> {order.buyerPhone}
                </a>
              </div>
              <CardContent className="p-4">
                <InfoRow label="Email"         value={order.buyerEmail} />
                <InfoRow label="Nationality"   value={order.buyerNationality} />
                <InfoRow label="National ID"   value={order.buyerNationalId} mono />
                <InfoRow label="Gender"        value={order.buyerGender === 'M' ? 'Male' : 'Female'} />
                <InfoRow label="Date of Birth" value={order.buyerDob} />
                <button className="w-full mt-3 text-xs font-medium text-brand hover:underline text-center pt-2 border-t border-gray-100">
                  View Customer Profile →
                </button>
              </CardContent>
            </Card>

            {/* Property */}
            <Card>
              <CardHeader className="pt-4 pb-2 px-4">
                <CardTitle className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
                  <MapPin size={10} /> Property
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <InfoRow label="ID"       value={order.propertyId} mono />
                <InfoRow label="Project"  value={order.projectName} link />
                <InfoRow label="Property" value={order.propertyName} link />
                <InfoRow label="Block"    value={order.blockNumber} />
                <InfoRow label="Area"     value={`${order.area} m²`} />
                <InfoRow label="Price"    value={fmt(order.price)} />
                {order.price !== order.priceAfterDiscount && (
                  <InfoRow label="After Discount" value={fmt(order.priceAfterDiscount)} highlight="text-brand font-semibold" />
                )}
              </CardContent>
            </Card>

            {/* Tax & Discount */}
            <Card>
              <CardHeader className="pt-4 pb-2 px-4">
                <CardTitle className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold flex items-center gap-1.5">
                  <Shield size={10} /> Tax & Discount
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <InfoRow label="Tax Amount"   value={fmt(order.taxAmount)} />
                <InfoRow label="Over 1M SAR"  badge={<Badge variant={order.taxOverMillion ? 'warning' : 'secondary'} className="text-[10px]">{order.taxOverMillion ? 'Yes' : 'No'}</Badge>} />
                <InfoRow label="Admin Exempt" badge={<Badge variant={order.adminTaxExempt === 'Normal' ? 'success' : 'warning'} className="text-[10px]">{order.adminTaxExempt}</Badge>} />
                {order.discountValue > 0 && <>
                  <div className="border-t border-dashed my-2" />
                  <InfoRow label="Discount"     value={fmt(order.discountValue)} highlight="text-emerald-600" />
                  <InfoRow label="Applied"      value={order.discountAppliedAt} />
                  <InfoRow label="Discount Type" badge={<Badge variant="secondary" className="text-[10px]">{order.discountType}</Badge>} />
                </>}
              </CardContent>
            </Card>

            {/* Request History */}
            <Card>
              <CardHeader className="pt-4 pb-2 px-4">
                <CardTitle className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Request History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <table className="w-full text-xs">
                  <thead className="border-y bg-gray-50/60 text-gray-400">
                    <tr><th className="px-4 py-2 text-left font-medium">Type</th><th className="px-4 py-2 text-left font-medium">Status</th><th className="px-4 py-2 text-left font-medium">Response</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-4 py-2.5">Tax Eval</td>
                      <td className="px-4 py-2.5"><Badge variant="success" className="text-[10px]">Done</Badge></td>
                      <td className="px-4 py-2.5 text-gray-400">Approved</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>

          {/* ════ CENTER — Content ═══════════════════════════ */}
          <div className="xl:col-span-6 space-y-4">

            {/* Payment Summary */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-semibold text-gray-700">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Progress toward {fmt(total)}</span>
                    <span className="font-bold text-gray-900">{paidPct}% paid</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full flex rounded-full overflow-hidden">
                      {depPct  > 0 && <div className="bg-brand transition-all duration-700"       style={{ width: `${depPct}%` }} />}
                      {instPct > 0 && <div className="bg-emerald-400 transition-all duration-700" style={{ width: `${instPct}%` }} />}
                    </div>
                  </div>
                  <div className="flex gap-4 text-[11px] text-gray-400 mt-2">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-brand" /> Deposit</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-400" /> Installment</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-200" /> Remaining</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { l: 'Property Price',    v: fmt(order.priceAfterDiscount), c: 'text-gray-900' },
                    { l: 'Total Paid',        v: fmt(order.totalPaid),          c: 'text-emerald-600 font-bold' },
                    { l: 'Remaining',         v: fmt(order.installmentRemaining), c: order.installmentRemaining > 0 ? 'text-amber-600 font-bold' : 'text-emerald-600' },
                    { l: 'Deposit Amount',    v: fmt(order.depositAmount),      c: 'text-gray-700' },
                    { l: 'Deposit Paid',      v: fmt(order.depositPaid),        c: 'text-brand font-semibold' },
                    { l: 'Installment Paid',  v: fmt(order.installmentPaid),    c: 'text-gray-700' },
                  ].map(row => (
                    <div key={row.l} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{row.l}</p>
                      <p className={`text-sm ${row.c}`}>{row.v}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Info */}
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">Order Information</CardTitle>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400 hover:text-brand transition-colors bg-gray-50 px-2.5 py-1 rounded border hover:border-brand/30">
                    {order.camundaId}
                    {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
                  </button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                  {[
                    { l: 'Order ID',           v: order.id },
                    { l: 'Deposit Amount',     v: fmt(order.depositAmount) },
                    { l: 'Installment Amount', v: fmt(order.installmentAmount) },
                    { l: 'Active Installment', v: order.activeInstallment },
                    { l: 'Booking Fee',        v: fmt(order.bookingFee) },
                    { l: 'Payment Method',     v: order.paymentOption },
                    { l: 'Booking Date',       v: order.bookingDate },
                    { l: 'Deposit Paid At',    v: order.depositPaidAt },
                    { l: 'Tax Amount',         v: fmt(order.taxAmount) },
                  ].map(f => (
                    <div key={f.l}>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">{f.l}</p>
                      <p className="text-sm font-medium text-gray-900">{f.v}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card className="overflow-hidden">
              <div className="border-b bg-gray-50/40">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {tabs.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-5 py-3.5 text-xs font-semibold whitespace-nowrap relative transition-colors flex-shrink-0 ${
                        activeTab === tab ? 'text-brand' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions */}
              {activeTab === 'Transactions' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-400 border-b text-xs">
                      <tr>{['#','ID','Amount','Payment Type','Type','Method','Status','Created At',''].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.transactions.length === 0 ? (
                        <tr><td colSpan={9} className="px-4 py-10 text-center text-gray-300 text-sm">No transactions yet.</td></tr>
                      ) : order.transactions.map((t, i) => (
                        <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 text-gray-400 text-xs">{i+1}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-600">{t.id}</td>
                          <td className="px-4 py-3 font-semibold">{fmt(t.amount)}</td>
                          <td className="px-4 py-3"><Badge variant="secondary" className="text-[10px]">{t.paymentType}</Badge></td>
                          <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${t.type === 'Credit' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'}`}>{t.type}</span></td>
                          <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{t.method}</Badge></td>
                          <td className="px-4 py-3"><Badge variant={t.status === 'Completed' ? 'success' : t.status === 'Failed' ? 'destructive' : 'warning'} className="text-[10px]">{t.status}</Badge></td>
                          <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{t.createdAt}</td>
                          <td className="px-4 py-3"><Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400"><Eye size={13}/></Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Bills */}
              {activeTab === 'Bills' && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-400 border-b text-xs">
                        <tr>{['SADAD Number','Amount','Status','Created At','Expiry','Invoice',''].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {order.bills.length === 0 ? (
                          <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-300 text-sm">No bills generated yet.</td></tr>
                        ) : order.bills.map(b => (
                          <tr key={b.id} className="hover:bg-gray-50/50">
                            <td className="px-4 py-3 font-mono text-xs">{b.sadadNumber}</td>
                            <td className="px-4 py-3 font-semibold">{fmt(b.amount)}</td>
                            <td className="px-4 py-3"><Badge variant={b.status === 'Bill Paid' ? 'success' : b.status === 'Expired' ? 'destructive' : 'warning'} className="text-[10px]">{b.status}</Badge></td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{b.createdAt}</td>
                            <td className="px-4 py-3 text-gray-400 text-xs">{b.expiryDate}</td>
                            <td className="px-4 py-3 font-mono text-xs text-gray-400">{b.invoiceId}</td>
                            <td className="px-4 py-3"><Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400"><Eye size={13}/></Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 border-t">
                    <Button variant="outline" className="gap-1.5 h-8 text-xs" onClick={generateBill}>
                      <Plus size={12}/> Generate New Bill
                    </Button>
                  </div>
                </div>
              )}

              {/* Installments */}
              {activeTab === 'Installments' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-400 border-b text-xs">
                      <tr>{['#','Amount','Due Date','Paid Date','Status',''].map(h => <th key={h} className="px-4 py-3 font-medium">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {order.installments.map(inst => (
                        <tr key={inst.n} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-medium">{inst.n}</td>
                          <td className="px-4 py-3 font-semibold">{fmt(inst.amount)}</td>
                          <td className="px-4 py-3 text-gray-500">{inst.dueDate}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">{inst.paidDate ?? <span className="italic">Not paid yet</span>}</td>
                          <td className="px-4 py-3">
                            <Badge variant={inst.status === 'Paid' ? 'success' : inst.status === 'Overdue' ? 'destructive' : 'warning'} className="text-[10px]">
                              {inst.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            {inst.status !== 'Paid' && (
                              <button
                                onClick={() => payInstallment(inst.n)}
                                className="text-[11px] font-semibold text-brand hover:underline"
                              >
                                Mark Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Documents */}
              {activeTab === 'Documents' && (
                <div className="p-4 space-y-2">
                  {order.documents.length === 0 && (
                    <p className="text-sm text-gray-300 text-center py-6">No documents uploaded yet.</p>
                  )}
                  {order.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText size={13} className="text-brand" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                          <p className="text-xs text-gray-400">{doc.size} &middot; Uploaded {doc.uploadedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400"><Download size={13}/></Button>
                        <button onClick={() => deleteDocument(doc.id)} className="h-7 w-7 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </div>
                  ))}
                  {uploadingId ? (
                    <div className="flex items-center gap-3 p-3 border border-dashed rounded-lg text-sm text-gray-400 animate-pulse">
                      <RefreshCw size={14} className="animate-spin text-brand" /> Uploading document…
                    </div>
                  ) : (
                    <button onClick={simulateUpload} className="flex items-center gap-1.5 h-8 px-3 text-xs font-medium border rounded-lg text-gray-600 hover:bg-gray-50 transition-colors mt-1">
                      <Upload size={12}/> Upload Document
                    </button>
                  )}
                </div>
              )}

              {/* Developer Transfer */}
              {activeTab === 'Developer Transfer' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-400 border-b text-xs">
                      <tr>{['Transfer ID','Date','Amount','By','Status','Proof'].map(h => <th key={h} className="px-4 py-3 font-medium text-left">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-300 text-sm">No developer transfers recorded yet.</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Action Logs */}
              {activeTab === 'Action Logs' && (
                <div className="p-5">
                  {order.actionLogs.length === 0 ? (
                    <p className="text-center text-gray-300 py-6 text-sm">No logs yet.</p>
                  ) : (
                    <div className="relative border-l-2 border-gray-100 ml-3 space-y-5">
                      {[...order.actionLogs].reverse().map((log, i) => (
                        <div key={i} className="relative pl-5">
                          <div className="absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-brand" />
                          <p className="text-[10px] text-gray-400 font-mono mb-0.5">{log.time}</p>
                          <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                          <p className="text-xs text-gray-500">{log.desc}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">by {log.by}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* ════ RIGHT — Actions panel (sticky) ════════════ */}
          <div className="xl:col-span-3 space-y-4 xl:sticky xl:top-4">

            {/* Status + primary/secondary actions */}
            <Card className="overflow-hidden">
              <div className="px-5 py-4 border-b bg-gray-50/60">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-2">Current Status</p>
                <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border ${sc.pill}`}>
                  <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                  {order.status}
                </span>
              </div>
              <CardContent className="p-4">
                {allActions.length === 0 ? (
                  <div className="flex flex-col items-center text-center py-4">
                    <CheckCircle2 size={28} className="text-emerald-400 mb-2" />
                    <p className="text-sm font-semibold text-emerald-700">Order Complete</p>
                    <p className="text-xs text-gray-400 mt-0.5">No further actions needed.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {primary.length > 0 && (
                      <div className="space-y-2">
                        {primary.map(a => (
                          <button
                            key={a.label}
                            onClick={() => setOpenAction(a)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand/90 active:scale-[0.98] transition-all shadow-sm"
                          >
                            <span className="opacity-80">{a.icon}</span>
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                    {secondary.length > 0 && (
                      <div className={`${primary.length > 0 ? 'pt-3 border-t border-gray-100' : ''} space-y-1`}>
                        {primary.length > 0 && <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-2">Other Actions</p>}
                        {secondary.map(a => (
                          <button
                            key={a.label}
                            onClick={() => setOpenAction(a)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100 active:scale-[0.98] transition-all border border-transparent hover:border-gray-200"
                          >
                            <span className="text-gray-400">{a.icon}</span>
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Danger Zone */}
            {danger.length > 0 && (
              <div>
                <button
                  onClick={() => setDangerOpen(v => !v)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100"
                >
                  <span className="flex items-center gap-1.5"><AlertTriangle size={13}/> Danger Zone</span>
                  <ChevronDown size={13} className={`transition-transform ${dangerOpen ? 'rotate-180' : ''}`} />
                </button>
                {dangerOpen && (
                  <Card className="mt-2 border-red-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    <CardContent className="p-3 space-y-1.5">
                      <p className="text-[10px] text-red-400 mb-2 leading-relaxed">These actions are permanent and irreversible.</p>
                      {danger.map(a => (
                        <button
                          key={a.label}
                          onClick={() => setOpenAction(a)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 active:scale-[0.98] transition-all font-medium"
                        >
                          <span className="opacity-70">{a.icon}</span>
                          {a.label}
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Admin Overrides */}
            <Card className="border-dashed">
              <CardContent className="p-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mb-3">Admin Overrides</p>
                <div className="space-y-2">
                  <button
                    onClick={() => setOpenAction({ label: 'Complete Tax', type: 'secondary', icon: <FileText size={14}/>, desc: 'Override: mark the tax evaluation as completed.' })}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-gray-600 rounded-lg hover:bg-gray-50 active:scale-[0.98] transition-all border border-gray-200 font-medium"
                  >
                    <FileText size={13} className="text-gray-400"/> Complete Tax
                  </button>
                  <button
                    onClick={() => setOpenAction({ label: 'Force Initiate Refund', type: 'danger', icon: <AlertTriangle size={14}/>, desc: 'Force-refund the total amount. Bypasses standard flow and cannot be reversed.' })}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-red-600 rounded-lg hover:bg-red-50 active:scale-[0.98] transition-all border border-red-100 font-medium"
                  >
                    <AlertTriangle size={13} className="opacity-70"/> Force Initiate Refund
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
