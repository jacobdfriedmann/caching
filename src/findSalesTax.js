const sales_tax_lookup = address => {
  // Do something expensive
  return address.charCodeAt(0) / 100; // Some deterministic output
};

module.exports = sales_tax_lookup;
