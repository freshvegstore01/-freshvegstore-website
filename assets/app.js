/* =========================================================
   FreshVegStore — shared site behaviour
   1) Mobile nav toggle + footer year (every page)
   2) FVS.* — tiny localStorage CRM used by /billing and /bulk-order
      Swap this for a real backend later; the data shape is kept
      simple on purpose so it's easy to migrate.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

window.FVS = (function () {
  const KEYS = {
    customers: 'fvs_customers',
    bills: 'fvs_bills',
    bulkOrders: 'fvs_bulk_orders',
    billNo: 'fvs_bill_no',
    invoiceNo: 'fvs_invoice_no'
  };

  const SHOP = {
    name: 'FreshVegStore',
    tagline: "Punjab's Trusted Vegetable Supplier",
    addressLine1: 'VPO Asron, Near SBI Bank',
    addressLine2: 'Distt. Shahid Bhagat Singh Nagar, Punjab – 144533',
    phone: '+91 98159 37394',
    email: 'orders@freshvegstore.in',
    gstin: '03ABCFF1234K1Z5' /* demo GSTIN for template purposes — replace with the real one */
  };

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch (e) { return []; }
  }
  function write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function uid() { return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  function nextNumber(key, start) {
    let n = parseInt(localStorage.getItem(key) || String(start), 10);
    n += 1;
    localStorage.setItem(key, String(n));
    return n;
  }
  function nextBillNo() { return nextNumber(KEYS.billNo, 1000); }
  function nextInvoiceNo() {
    const n = nextNumber(KEYS.invoiceNo, 200);
    const y = new Date().getFullYear();
    return `FVS/BULK/${y}/${n}`;
  }

  function getCustomers() { return read(KEYS.customers); }
  function saveCustomers(list) { write(KEYS.customers, list); }

  /** Find a customer by phone, or create one. Updates order stats. */
  function upsertCustomer({ name, phone, address = '', segment = 'retail', orgType = '', gstin = '' }, orderTotal = 0) {
    const list = getCustomers();
    let cust = phone ? list.find(c => c.phone === phone) : null;
    const now = new Date().toISOString();
    if (cust) {
      cust.name = name || cust.name;
      cust.address = address || cust.address;
      cust.orgType = orgType || cust.orgType;
      cust.gstin = gstin || cust.gstin;
      cust.orders = (cust.orders || 0) + 1;
      cust.totalSpent = (cust.totalSpent || 0) + orderTotal;
      cust.lastOrderAt = now;
    } else if (name || phone) {
      cust = {
        id: uid(), name: name || 'Walk-in Customer', phone: phone || '',
        address, segment, orgType, gstin,
        orders: 1, totalSpent: orderTotal, createdAt: now, lastOrderAt: now
      };
      list.push(cust);
    }
    saveCustomers(list);
    return cust;
  }

  function getBills() { return read(KEYS.bills); }
  function recordBill(bill) {
    const list = getBills();
    list.unshift(bill);
    write(KEYS.bills, list);
  }

  function getBulkOrders() { return read(KEYS.bulkOrders); }
  function recordBulkOrder(order) {
    const list = getBulkOrders();
    list.unshift(order);
    write(KEYS.bulkOrders, list);
  }

  function money(n) {
    return '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return {
    SHOP, uid, nextBillNo, nextInvoiceNo,
    getCustomers, saveCustomers, upsertCustomer,
    getBills, recordBill, getBulkOrders, recordBulkOrder, money
  };
})();
